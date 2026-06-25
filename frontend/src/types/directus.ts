/** Tipos según el modelo de datos en Directus (CONTEXT.md) */

export interface DirectusFile {
  id: string;
  title?: string | null;
  filename_download: string;
  width?: number | null;
  height?: number | null;
  [key: string]: unknown;
}

export interface DirectusImageItem {
  directus_files_id: DirectusFile | string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order?: number;
  products?: Product[];
}

export interface Color {
  id: number;
  name: string;
  hex: string;
  sort_order?: number;
}

/** Imagen del carrusel "Detalles" de la home (gestionado desde Directus) */
export interface Detalle {
  id: number;
  alt?: string | null;
  /** UUID del archivo en directus_files */
  image?: string | null;
  sort_order?: number;
}

export interface ProductColorVariant {
  id: number;
  product?: number | Product;
  color: Color | number;
  disponibilidad?: "disponible" | "sin_stock" | "proximamente";
  images?: DirectusImageItem[];
  sort_order?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | string | null;
  is_active?: boolean;
  /** Mostrar en "Productos destacados" de la home */
  destacado?: boolean;
  sort_order?: number;
  category?: Category | number | null;
  images?: DirectusImageItem[];
  /** Texto, una característica por línea (en Directus: Text / textarea) */
  caracteristicas?: string | null;
  /** Párrafo de uso recomendado (en Directus: Text o WYSIWYG) */
  uso_recomendado?: string | null;
  /** UUID del archivo de ficha técnica (en Directus: File, single) */
  ficha_tecnica?: string | null;
  /** Talles disponibles (en Directus: tags / lista de strings) */
  talles?: string[] | null;
  /** Imagen de la tabla de talles (en Directus: File, single) — fallback */
  tabla_talles?: string | DirectusFile | null;
  /** Tabla de talles: filas de medidas (las columnas salen de `talles`) */
  tabla_medidas?: { medida?: string; valores?: string }[] | null;
  /** Variantes de color con imágenes propias y disponibilidad */
  color_variants?: ProductColorVariant[];
}

export interface DirectusResponse<T> {
  data: T | T[] | null;
}
