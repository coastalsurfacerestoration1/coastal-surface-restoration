import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Crawlers belonging to AI answer engines, listed explicitly.
 *
 * A wildcard allow already covers them, but naming them is deliberate: it
 * documents the decision to opt in, and it means a future disallow for one
 * engine is a one line change rather than a rewrite. Google-Extended governs
 * Gemini grounding only and has no effect on ordinary Search indexing.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep the API route out of the index.
        disallow: '/api/',
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
