import type { MetadataRoute } from 'next';

const BASE_URL = 'https://coastalsurfacerestoration.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep the API route out of the index.
      disallow: '/api/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}