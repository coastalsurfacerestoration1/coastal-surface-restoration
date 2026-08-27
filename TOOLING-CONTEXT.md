# Tooling Context for Claude Desktop

Paste this into a Claude Desktop project or conversation so it understands what
is installed on this machine and what it can realistically help with.

---

## The business

Coastal Surface Restoration (CSR) is Tyler's mobile laser cleaning business in
Charleston, SC. Status as of August 2026:

- Pre-launch. No jobs completed yet, first work targeted around October 2026.
- No photos, no reviews, no completed projects to reference.
- Google Business Profile created 2026-08-04.
- Marketing site is Next.js App Router + Tailwind v4, dark navy `#0a1628` with
  teal `#00d4d4`.
- Site structure: 8 service pages (brick cleaning, graffiti removal, rust
  removal, historic ironwork, marine, antique restoration, commercial exterior,
  vacation rental), 4 location pages (downtown Charleston, Mount Pleasant,
  James Island / Folly Beach, Isle of Palms / Sullivan's Island).
- Every page is written for search, not for existing customers.

## Standing content rules (these matter in any copy you draft)

1. **No em dashes** in user-facing copy. Applies to body text, meta titles and
   descriptions, OG and alt text, and strings inside JSON-LD. Use a comma, a
   colon, a full stop, or two sentences instead.
2. **Laser safety credential wording**: always "Laser Safety Officer trained to
   ANSI Z136.1 through the Laser Institute of America", short form "ANSI Z136.1
   Trained". Never "ANSI Z136.1 certified". ANSI Z136.1 is a standard, not a
   certification. The actual certification is CLSO from the Board of Laser
   Safety, which Tyler does not hold.
3. **No track record claims.** No past clients, completed jobs, or testimonials.
4. **No pricing claims** for now. The $400 minimum was pulled from site copy and
   returns once reviews and before/afters justify it.

---

## What is installed

### 1. Crawl4AI 0.9.2 (local Python package + CLI)

An open source web crawler that renders pages in a real headless browser and
returns clean markdown or structured data.

| Item | Location |
|---|---|
| Python | 3.14.6 at `C:\Users\mvptm\AppData\Local\Python\pythoncore-3.14-64` |
| Package | `crawl4ai` 0.9.2, user-scoped pip install |
| CLI | `crwl` (also `crawl4ai-setup`, `crawl4ai-doctor`) |
| Browser | Playwright / Patchright Chrome headless shell in `C:\Users\mvptm\AppData\Local\ms-playwright` |
| Local DB | `C:\Users\mvptm\.crawl4ai\crawl4ai.db` |

Verified working: `crawl4ai-doctor` completed a live crawl successfully.

### 2. claude-code-setup plugin (Claude Code only)

Installed from Anthropic's official marketplace. Contains one skill,
`claude-automation-recommender`, which analyzes a codebase and recommends
tailored Claude Code hooks, skills, MCP servers, and subagents.

---

## How the work splits up

Ask Desktop what to investigate and why, run the crawl in Claude Code or a
terminal, then bring the markdown back to Desktop for analysis and copy
drafting. Desktop is the strategist, Claude Code is the hands.

(Desktop cannot execute either tool itself. No shell, and the Crawl4AI pip
package has no MCP server. Not a problem for planning work, just worth knowing
so nothing here reads as directly runnable from a Desktop chat.)

---

## Practical use cases for CSR

### A. Competitor gap analysis
Crawl Charleston pressure washing, restoration, and graffiti removal companies
that currently rank. Extract service lists, page structure, word counts, FAQ
topics, and LocalBusiness schema. Output tells you what each service page needs
in order to compete, instead of guessing.

### B. Pre-deploy SEO and house-rules check
Crawl the local dev server or the live site and assert across every rendered
page: no em dashes anywhere including JSON-LD and meta tags, no "ANSI Z136.1
certified" phrasing, title and description lengths, unique H1s, correct
canonicals, no orphan pages, no missing alt text, no copy implying completed
jobs. This checks rendered output, which is what Google reads, so it catches
problems that a grep over source files misses.

### C. Verify what AI crawlers see
The site serves `/llms.txt` and has robots rules. Crawl your own pages using
GPTBot, PerplexityBot, and ClaudeBot user agents to confirm content is present
in server HTML rather than JavaScript-only, and that robots rules behave as
intended.

### D. Local prospect list building
Crawl publicly listed contact info for Charleston vacation rental managers,
marina and yacht club directories, HOA and property management firms, and
historic district commercial associations. These map directly onto the vacation
rental, marine, and historic ironwork service pages. With no reviews yet,
targeted outreach outperforms waiting on rankings.

### E. Authoritative source mining
Charleston Board of Architectural Review and historic preservation guidelines,
Laser Institute of America resources, and laser manufacturer technical docs.
Grounding brick and ironwork pages in real local regulation is a genuine
differentiator against generic national copy.

---

## Limits worth respecting

- Do not scrape Google SERPs or Google Business Profile. Against terms of
  service and actively blocked. Use Search Console and a real rank tracker.
- Yelp, BBB, and similar directories restrict scraping in their terms. Checking
  your own listing manually is fine. Do not build a harvesting pipeline.
- Rate limit against small local business sites. Crawl4AI supports delays and
  concurrency caps.
- LLM-based extraction needs an API key. CSS, XPath, and regex extraction are
  free and cover most of the above.

---

## Ready to run

```bash
# single page as markdown
crwl https://example.com -o markdown

# deep crawl a competitor, capped
crwl https://competitor.com --deep-crawl bfs --max-pages 25 -o markdown -O out.md

# ask a question about crawled content
crwl https://example.com -q "what services are listed and how are they priced?"

# health check
crawl4ai-doctor
```

```python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url="https://example.com")
        print(result.markdown)

asyncio.run(main())
```

Note: bare `crwl` requires a terminal started after the PATH change. Otherwise
use the full path:
`C:\Users\mvptm\AppData\Local\Python\pythoncore-3.14-64\Scripts\crwl.exe`
