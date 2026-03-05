import type { Category, DirectusFile, Product } from "@/types/directus";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_DIRECTUS_URL no está definida");
  return url.replace(/\/$/, "");
};

const directusUrl = (path: string): string => `${getBaseUrl()}${path}`;

/** Productos activos con categoría e imágenes (primera de images = imagen principal) */
export async function fetchProducts(categorySlug?: string, limit?: number): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set("filter[is_active][_eq]", "true");
  params.set("sort", "sort_order,-id");
  params.set("fields", "*,category.*,images.directus_files_id.*");

  if (categorySlug) {
    params.set("filter[category][slug][_eq]", categorySlug);
  }
  if (limit != null && limit > 0) {
    params.set("limit", String(limit));
  }

  const res = await fetch(directusUrl(`/items/products?${params}`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

/** Productos destacados para la home (por defecto 6, ordenados por sort_order) */
export async function fetchFeaturedProducts(count = 6): Promise<Product[]> {
  return fetchProducts(undefined, count);
}

/** Un producto por slug (para la página de detalle) */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const params = new URLSearchParams();
  params.set("filter[slug][_eq]", slug);
  params.set("filter[is_active][_eq]", "true");
  params.set("fields", "*,category.*,images.directus_files_id.*");
  params.set("limit", "1");

  const res = await fetch(directusUrl(`/items/products?${params}`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  const data = json.data;
  if (Array.isArray(data) && data.length > 0) return data[0];
  return null;
}

/** Categorías para filtro / menú (solo id, name, slug) */
export async function fetchCategories(): Promise<Category[]> {
  const params = new URLSearchParams();
  params.set("sort", "sort_order");
  params.set("fields", "id,name,slug");

  const res = await fetch(directusUrl(`/items/categories?${params}`), {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

/** URL del asset en Directus (para Next/Image o <img>) */
export function assetUrl(fileId: string | undefined | null): string {
  if (!fileId) return "";
  return directusUrl(`/assets/${fileId}`);
}

/** Primera imagen del producto (objeto expandido); puede ser null */
export function getFirstImage(product: Product): DirectusFile | null {
  const images = product.images;
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0]?.directus_files_id;
  if (!first) return null;
  return typeof first === "string" ? ({ id: first } as DirectusFile) : first;
}

/** ID de la primera imagen (objeto expandido o solo ID) */
export function getFirstImageId(product: Product): string | null {
  const images = product.images;
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0]?.directus_files_id;
  if (!first) return null;
  if (typeof first === "string") return first;
  return (first as DirectusFile).id ?? null;
}

function extractFileIdFromItem(item: unknown): string | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, unknown>;
  // directus_files_id (objeto expandido o UUID) — nombre habitual en M2M a directus_files
  const file = raw.directus_files_id;
  if (file != null) {
    if (typeof file === "string") return file;
    if (typeof file === "object" && file !== null) {
      const id = (file as Record<string, unknown>).id;
      if (typeof id === "string") return id;
    }
  }
  // File en la raíz del item
  if (typeof raw.id === "string") return raw.id;
  // Cualquier otra clave que sea objeto con .id (ej. "file", "image")
  for (const value of Object.values(raw)) {
    if (value && typeof value === "object" && typeof (value as Record<string, unknown>).id === "string") {
      return (value as Record<string, unknown>).id as string;
    }
  }
  return null;
}

/** ID del archivo de ficha técnica (campo file puede venir como UUID u objeto) */
export function getFichaTecnicaId(product: Product): string | null {
  const raw = product.ficha_tecnica;
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  if (typeof raw === "object" && raw !== null && typeof (raw as { id?: string }).id === "string")
    return (raw as { id: string }).id;
  return null;
}

/** URL para descargar la ficha técnica del producto */
export function getFichaTecnicaUrl(product: Product): string | null {
  const id = getFichaTecnicaId(product);
  return id ? directusUrl(`/assets/${id}`) : null;
}

/** Todos los IDs de imagen del producto (orden del M2M en Directus) */
export function getProductImageIds(product: Product): string[] {
  const images = product.images;
  if (!Array.isArray(images)) return [];
  const ids: string[] = [];
  for (const item of images) {
    const id = extractFileIdFromItem(item);
    if (id) ids.push(id);
  }
  return ids;
}

export { getBaseUrl as getDirectusUrl };
