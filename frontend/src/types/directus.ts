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

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price?: number | string | null;
  is_active?: boolean;
  sort_order?: number;
  category?: Category | number | null;
  images?: DirectusImageItem[];
  /** Texto, una característica por línea (en Directus: Text / textarea) */
  caracteristicas?: string | null;
  /** Párrafo de uso recomendado (en Directus: Text o WYSIWYG) */
  uso_recomendado?: string | null;
  /** UUID del archivo de ficha técnica (en Directus: File, single) */
  ficha_tecnica?: string | null;
}

export interface DirectusResponse<T> {
  data: T | T[] | null;
}
