# Marine Copy Audit

**Audited 2026-09-13. Nothing in the Pending section has been changed.**

## Why this exists

Standard general liability commonly excludes work on or over navigable water.
The GL classification codes on the current policy are unconfirmed, and the agent
has not answered in writing. Until she does, the site still advertises dock,
slip, and marina work that may fall outside coverage.

The decision was **not** to rewrite it yet. Rewriting the thesis of two pages
before the answer is known is expensive and possibly wrong, and the exposure is
controlled in the meantime by a hard personal rule:

> **No dock, slip, or over-water job until coverage is confirmed in writing.**

This file is the worklist for when that answer arrives. If coverage is
confirmed, close this file and change nothing. If it is excluded, everything
below has to go or be qualified as land based.

## Already done, do not redo

Shipped 2026-09-13:

- **All six "hull" references removed.** Hull work means a boat, either in the
  water or hauled out at a marine facility, and neither is work this business is
  positioned to take. The "Can you remove bottom paint?" FAQ on the marine page
  was removed entirely rather than reworded, because bottom paint is hull work
  by definition and stripping the word would have left the invitation standing.
- **Interior fireplace brick claim removed** from the brick cleaning page. That
  page now offers exterior chimney brick only, and the card title changed from
  "Chimneys & Fireplaces" to "Chimneys" so the heading does not reassert it.
- **Scope and coverage clause added to /terms**, between "Quotes and pricing"
  and "Payment". It states that every job is evaluated before a quote, that some
  surfaces, locations, and jobs fall outside what can be cleaned safely, lawfully
  or within coverage, and that nothing on the site is a commitment to take a
  particular job. That clause is what currently limits the exposure from
  everything listed below.

## Deliberately not changing

Reviewed and ruled in, for the record, so these do not get re-audited:

- **Restaurants as a marketed audience.** Storefront frontage, railings,
  security grates, and patio furniture are exterior work on land. No commercial
  kitchen work is offered anywhere on the site, so there was nothing to remove.
- **Quote form dropdown option "Marine Hardware Cleaning."** Already hardware
  focused, implies the hardware comes to us.
- **Pool gates, pool enclosure fencing, and pool decks.** Exterior metal on land.
- **`app/services/commercial-exterior-cleaning-charleston/page.tsx:225`**, "the
  space is ready to open as soon as we finish". Reads as a storefront reopening,
  not interior work.

## Pending: marine and over-water language

Roughly **65 lines across 13 public files.** Line numbers are as of 2026-09-13
and will drift; the quoted text is the reliable anchor.

**Metadata and JSON-LD must change alongside the visible copy.** Four pages
carry the same claims in three places each: the visible copy, the `pageMetadata`
description, and the `serviceSchema` JSON-LD description. Changing only what is
on screen leaves search results and structured data advertising work the page no
longer offers. The affected pairs are `james-island-folly-beach` lines 12 and
29, `mount-pleasant` lines 12 and 29, and `marine-cleaning-charleston` lines 13
and 30.

### Tier 1: explicit promises to work on a dock, over water

The strongest claims. Each states the work is performed on a structure over
navigable water.

| File | Line | Text |
|---|---|---|
| `app/locations/james-island-folly-beach/page.tsx` | 70 | "it can be done on a working dock without anything reaching the water below" |
| " | 85 | "cleaned in place on the dock" |
| " | 121 | section heading "Working on a Dock or Creek-Front Property" |
| " | 133 | "Some dock and lift work is much easier at a particular stage of tide" |
| " | 138 | "we can carry it out a long dock walkway" |
| " | 243 | "cleaned in place on the dock" |
| " | 248 | "workable on a dock over a tidal creek" |
| " | 253 | "Some dock and lift work is far easier at a particular stage of tide" |
| `app/locations/isle-of-palms-sullivans-island/page.tsx` | 97 | "We work at the dock rather than hauling parts off site" |
| " | 241 | FAQ "Do you work at the marina and on private docks?" |
| " | 243 | "cleaned at the dock" |
| `app/locations/mount-pleasant/page.tsx` | 89 | "on private docks along Shem Creek, the Wando... We work at the dock." |
| " | 251 | "cleaned in your driveway or at your dock" |
| `app/services/marine-cleaning-charleston/page.tsx` | 177 | "Work can be done dockside or at your location" |
| " | 217 | "boat owners, marinas, and dock owners... with dockside service wherever access allows" |
| " | 247 | FAQ "Do you work dockside?" |
| " | 249 | "we work at private docks and in marina slips" |
| `app/locations/page.tsx` | 63 | "at your property, at your dock, or in your driveway" |
| `app/llms.txt/route.ts` | 21 | "cleaned dockside" |
| " | 68 | "at the property, at the dock, or in the driveway" |

`app/llms.txt/route.ts` is what AI crawlers read. It is easy to forget and
states the dock claim twice.

### Tier 2: dock, lift, slip and marina hardware as an advertised category

Weaker individually, but they are what the pages are built around.

| File | Lines |
|---|---|
| `app/locations/james-island-folly-beach/page.tsx` | 12, 29 (metadata + JSON-LD), 46, 67, 88, 89, 128, 205, 263, 297 |
| `app/locations/isle-of-palms-sullivans-island/page.tsx` | 96, 155, 200 |
| `app/locations/mount-pleasant/page.tsx` | 12, 29 (metadata + JSON-LD), 70, 88, 218 |
| `app/services/marine-cleaning-charleston/page.tsx` | 92, 93 |
| `app/services/rust-removal-charleston/page.tsx` | 93, 369 |
| `app/services/vacation-rental-cleaning-charleston/page.tsx` | 100, 101, 207, 211 |
| `app/how-laser-cleaning-works/page.tsx` | 338 |
| `app/locations/page.tsx` | 24, 32, 38 |
| `app/locations/downtown-charleston/page.tsx` | 276, 286 |
| `app/page.tsx` | 16 |
| `app/services/page.tsx` | 41 |

### Tier 3: place names only, low exposure

Waterways named as geography or as runoff context, not as worksites. Probably
keep even in the worst case.

`app/components/ServiceAreaChips.tsx` 24 and 28, `marine-cleaning-charleston` 64,
70, 221, 222, `mount-pleasant` 46, 64, 70, 179, 271, `downtown-charleston` 67,
`james-island-folly-beach` 173.

### Not public copy

`app/components/icons.tsx:34` is a code comment. `TOOLING-CONTEXT.md:101` lists
marina and yacht club directories as internal prospecting targets. Neither is
visible to a customer, but the outreach note should not be acted on while the
rule above is in force.

## Two pages need rewriting, not editing

`app/locations/james-island-folly-beach/page.tsx` and
`app/services/marine-cleaning-charleston/page.tsx` do not merely mention dock
work. It is the organizing idea of both. James Island carries an entire section,
"Working on a Dock or Creek-Front Property", that exists only to sell it, and the
marine page's service area section is addressed to "boat owners, marinas, and
dock owners". Budget those as page rewrites.

The other eleven files are line edits.

## One thing noticed but left alone

`app/services/marine-cleaning-charleston/page.tsx` lines 13 and 30 open with
"Laser cleaning for boats, trailers, and marine hardware". "For boats" is a claim
about the vessel rather than about hardware. It was left in place because the
2026-09-13 pass was scoped to hull references only. Worth revisiting in the same
sweep as everything above.
