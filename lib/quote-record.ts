import { after } from 'next/server';
import { appendQuoteRow, type QuoteRow, type SheetResult } from '@/lib/notify';
import { buildIngestPayload, ingestQuote, type AreaVerdict } from '@/lib/supabase-ingest';

/** A sheet row plus the id the site made for it in the same sheetRow() call. */
export type QuoteRecord = QuoteRow & { submissionId: string };

/**
 * Records one quote: the sheet row exactly as before, then the Supabase copy
 * in the background.
 *
 * The one place every row-writing path in /api/quote goes through (over 50
 * miles, 20 to 50 miles, and normal), so no outcome can skip the copy. The
 * sheet write is awaited and its result returned unchanged. The Supabase
 * write starts only after it and runs after the response, so it can neither
 * slow the form nor change what the customer sees. Its failures are logged
 * and caught by the nightly reconcile.
 */
export async function recordQuote(record: QuoteRecord, area: AreaVerdict): Promise<SheetResult> {
  // The id stays out of the sheet payload, which goes to the Apps Script
  // byte for byte as it did before Phase 3.
  const { submissionId, ...row } = record;
  const sheet = await appendQuoteRow(row);

  const copy = async () => {
    const result = await ingestQuote(buildIngestPayload(row, submissionId, area, sheet));
    if (result.sent) {
      console.log(`Quote copied to Supabase: ${submissionId}${result.duplicate ? ' (already there)' : ''}`);
    } else {
      console.warn(`Quote not copied to Supabase (${submissionId}): ${result.reason}`);
    }
  };

  try {
    after(copy);
  } catch (error) {
    // Outside a request (scripts, tests) there is no after(). Run it detached;
    // it never throws.
    console.warn(`after() unavailable, copying inline: ${String(error)}`);
    void copy();
  }

  return sheet;
}
