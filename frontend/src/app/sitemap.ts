import type { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/directus";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/productos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cotizacion`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...productEntries,
  ];
}
