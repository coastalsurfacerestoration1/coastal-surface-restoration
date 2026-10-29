-- QuickBooks Online: one connection (company id + encrypted tokens) and the estimate id on each quote.
-- Tokens are encrypted by the server (AES-256-GCM, key QBO_TOKEN_KEY in Vercel env) before they reach the
-- database, and live in the private schema, which the API never exposes. Only the owner can call the three
-- functions below, and they only ever see ciphertext.

create table private.qbo_connection (
  id boolean primary key default true check (id), -- exactly one row
  realm_id text not null check (realm_id ~ '^[0-9]{1,32}$'),
  env text not null check (env in ('sandbox', 'production')),
  token_cipher text not null check (length(token_cipher) <= 8000),
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
revoke all on private.qbo_connection from anon, authenticated, public;
-- Row security on with no policies: nothing but the owner-only functions below (table owner) can touch it.
alter table private.qbo_connection enable row level security;

create or replace function public.qbo_load()
returns table (realm_id text, env text, token_cipher text, connected_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_owner() then
    raise exception 'not allowed' using errcode = 'insufficient_privilege';
  end if;
  return query select c.realm_id, c.env, c.token_cipher, c.connected_at from private.qbo_connection c;
end $$;

create or replace function public.qbo_save(p_realm_id text, p_env text, p_token_cipher text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_owner() then
    raise exception 'not allowed' using errcode = 'insufficient_privilege';
  end if;
  insert into private.qbo_connection (id, realm_id, env, token_cipher)
  values (true, p_realm_id, p_env, p_token_cipher)
  on conflict (id) do update set realm_id = excluded.realm_id, env = excluded.env, token_cipher = excluded.token_cipher,
    connected_at = case when private.qbo_connection.realm_id = excluded.realm_id then private.qbo_connection.connected_at else now() end,
    updated_at = now();
  insert into public.activity_log (actor, source, action, detail)
  values ((select auth.uid()), 'app', 'qbo.save', jsonb_build_object('env', p_env));
end $$;

create or replace function public.qbo_clear()
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_owner() then
    raise exception 'not allowed' using errcode = 'insufficient_privilege';
  end if;
  delete from private.qbo_connection;
  insert into public.activity_log (actor, source, action, detail) values ((select auth.uid()), 'app', 'qbo.disconnect', '{}');
end $$;

revoke all on function public.qbo_load() from public, anon;
revoke all on function public.qbo_save(text, text, text) from public, anon;
revoke all on function public.qbo_clear() from public, anon;
grant execute on function public.qbo_load() to authenticated;
grant execute on function public.qbo_save(text, text, text) to authenticated;
grant execute on function public.qbo_clear() to authenticated;

-- The QuickBooks estimate made from a quote (column from 0001). Created as a draft; sending is a separate
-- confirmed action. Ids are QuickBooks numbers and one estimate belongs to one quote.
alter table public.quotes
  add column qbo_synced_at timestamptz,
  add constraint quotes_qbo_estimate_id_shape check (qbo_estimate_id ~ '^[0-9]{1,32}$');
create unique index quotes_qbo_estimate_idx on public.quotes (qbo_estimate_id) where qbo_estimate_id is not null;
