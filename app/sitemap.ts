import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/data';

const SITE_URL = 'https://muhammadhassan.dev';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const routes = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
  ];

  projects.forEach((p) => {
    routes.push({
      url: `${SITE_URL}/work/${p.slug}`,
      lastModified: new Date(p.updated_at || p.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    });
  });

  return routes;
}
