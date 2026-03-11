import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nutricore.com';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://209.126.86.149:8079';

async function getProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

async function getBlogs() {
  try {
    const res = await fetch(`${API_BASE}/blogs`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

  const productEntries: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${BASE_URL}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((b: any) => ({
    url: `${BASE_URL}/blog/${b.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/information`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [...staticEntries, ...productEntries, ...blogEntries];
}
