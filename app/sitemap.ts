import type { MetadataRoute } from 'next';

const BASE_URL = 'https://coastalsurfacerestoration.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Only real, live routes. Add new SEO/location pages here as they ship.
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/services/rust-removal-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/historic-ironwork-restoration-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/gallery', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/quote', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/services/graffiti-removal-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/marine-cleaning-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/brick-cleaning-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/vacation-rental-cleaning-charleston', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/services/antique-restoration-charleston', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/services/commercial-exterior-cleaning-charleston', priority: 0.7, changeFrequency: 'monthly' },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}