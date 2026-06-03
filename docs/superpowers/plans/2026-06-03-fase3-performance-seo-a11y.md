# Fase 3 — Performance + SEO + Accesibilidad · Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar el rediseño con optimización de imágenes, SEO enriquecido (OG, metadata por categoría, JSON-LD) y arreglos de accesibilidad — sin cambiar el look ya aprobado.

**Architecture:** Cambios puntuales en `next.config.ts` (remotePatterns), componentes de imagen (quitar `unoptimized`), metadata de páginas y el footer. No se toca la capa de datos ni las rutas de API.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4.

**Verificación (sin suite de tests):** cada tarea cierra con `npx tsc --noEmit` limpio + `npm run lint` sin errores nuevos (baseline: 1 error en `/admin/cotizaciones`, fuera de scope). Al cerrar la fase: `npm run build` OK + recorrido visual con `npm run dev` (Directus local en `:8055` arriba) confirmando que **las imágenes siguen cargando** tras quitar `unoptimized`.

**Referencia de diseño:** `docs/superpowers/specs/2026-06-02-rediseno-editorial-design.md`

**Datos de entorno:** Directus prod = `admin.losalamosindumentaria.com.ar`; sitio = `losalamosindumentaria.com.ar`.

---

## File Structure

| Archivo | Responsabilidad | Acción |
|---|---|---|
| `frontend/next.config.ts` | remotePatterns (Directus prod) | Modificar |
| `frontend/src/app/layout.tsx` | metadataBase + OG por defecto | Modificar |
| `frontend/src/components/ProductCard.tsx` | quitar `unoptimized` | Modificar |
| `frontend/src/components/ProductGallery.tsx` | quitar `unoptimized` | Modificar |
| `frontend/src/app/producto/[slug]/page.tsx` | OG image + JSON-LD de producto | Modificar |
| `frontend/src/app/productos/page.tsx` | generateMetadata por categoría | Modificar |
| `frontend/src/app/page.tsx` | footer: links sociales reales | Modificar |

---

## Task 1: remotePatterns de Directus prod + metadataBase

**Files:**
- Modify: `frontend/next.config.ts`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Agregar el dominio de Directus de producción a `next.config.ts`**

Reemplazar el array `remotePatterns` para incluir el host de prod (necesario antes de quitar `unoptimized`, o las imágenes romperán en producción):

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "admin.losalamosindumentaria.com.ar",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Agregar `metadataBase` y OG por defecto en `layout.tsx`**

Reemplazar el objeto `metadata` exportado:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "LOS ÁLAMOS — Indumentaria laboral",
    template: "%s — LOS ÁLAMOS",
  },
  description: "Catálogo de indumentaria laboral. Consultas por WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Los Álamos",
    title: "LOS ÁLAMOS — Indumentaria laboral",
    description: "Catálogo de indumentaria laboral. Consultas por WhatsApp.",
  },
};
```

Nota: el `template` hace que las páginas con `title: "X"` se rendericen como "X — LOS ÁLAMOS". El producto ya define `title: product.name`, así que quedará "Campera — LOS ÁLAMOS".

- [ ] **Step 3: Verificar**

Run (desde `frontend/`): `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 4: Commit**

```bash
git add frontend/next.config.ts frontend/src/app/layout.tsx
git commit -m "feat(seo): remotePatterns de Directus prod + metadataBase y OG por defecto"
```

---

## Task 2: Activar optimización de imágenes (quitar `unoptimized`)

**Files:**
- Modify: `frontend/src/components/ProductCard.tsx`
- Modify: `frontend/src/components/ProductGallery.tsx`

Solo en las imágenes de producto que vienen de Directus (el beneficio real). Los carruseles de marcas/indumentaria (assets locales en `/public`, con drag y `onError`) se dejan como están.

- [ ] **Step 1: `ProductCard.tsx` — quitar `unoptimized`**

Eliminar la línea `unoptimized` del `<Image>`:

```tsx
          <Image
            src={assetUrl(imageId)}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-300 motion-safe:group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
```

- [ ] **Step 2: `ProductGallery.tsx` — quitar `unoptimized`**

En el `<Image>` de la grilla (no en el `<img>` del lightbox), eliminar la línea `unoptimized`:

```tsx
            <Image
              src={assetUrl(id)}
              alt={`${productName} - imagen ${index + 1}`}
              fill
              className="object-cover object-center transition hover:opacity-90"
              sizes="(max-width: 640px) 50vw, 45vw"
            />
```

- [ ] **Step 3: Verificar build + carga de imágenes**

Run: `npx tsc --noEmit` (limpio), `npm run lint`, y `npm run build` (OK).
Luego `npm run dev` y `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/productos` → 200. **Abrir el catálogo y un producto en el navegador y confirmar que las imágenes (servidas por `/_next/image?...`) cargan.** Si una imagen no carga, verificar que el host de Directus esté en `remotePatterns` (Task 1).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ProductCard.tsx frontend/src/components/ProductGallery.tsx
git commit -m "perf(img): activar optimizacion de next/image en producto"
```

---

## Task 3: SEO de producto (OG image) + catálogo (metadata) + JSON-LD

**Files:**
- Modify: `frontend/src/app/producto/[slug]/page.tsx`
- Modify: `frontend/src/app/productos/page.tsx`

- [ ] **Step 1: `producto/[slug]/page.tsx` — OG image en `generateMetadata` + JSON-LD**

Importar helpers arriba:
```tsx
import { fetchProductBySlug, assetUrl, getFirstImageId } from "@/lib/directus";
```

Reemplazar el `return` de `generateMetadata` para incluir la imagen:

```tsx
  const imageId = getFirstImageId(product);
  const ogImages = imageId ? [{ url: assetUrl(imageId) }] : undefined;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: ogImages,
    },
  };
```

Y dentro del componente `ProductoPage`, agregar un script JSON-LD de producto antes de `<ProductDetail>` (dentro del `<main>`):

```tsx
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description:
              typeof product.description === "string" ? product.description : undefined,
            image: (() => {
              const id = getFirstImageId(product);
              return id ? assetUrl(id) : undefined;
            })(),
            category:
              product.category && typeof product.category === "object"
                ? product.category.name
                : undefined,
          }),
        }}
      />
```

Asegurar que `getFirstImageId` y `assetUrl` estén importados en el archivo (ver import de arriba).

- [ ] **Step 2: `productos/page.tsx` — `generateMetadata` por categoría**

Agregar arriba del componente (la página ya recibe `searchParams`):

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: ProductosProps): Promise<Metadata> {
  const { categoria } = await searchParams;
  if (categoria) {
    const categories = await fetchCategories();
    const name = categories.find((c) => c.slug === categoria)?.name ?? categoria;
    return {
      title: name,
      description: `Indumentaria laboral — ${name}. Mirá el catálogo de Los Álamos y consultá por WhatsApp.`,
    };
  }
  return {
    title: "Catálogo",
    description: "Catálogo completo de indumentaria laboral de Los Álamos. Consultá por WhatsApp.",
  };
}
```

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/producto/[slug]/page.tsx frontend/src/app/productos/page.tsx
git commit -m "feat(seo): OG image en producto, metadata por categoria y JSON-LD"
```

---

## Task 4: A11y — links sociales reales en el footer

**Files:**
- Modify: `frontend/src/app/page.tsx`

El footer tiene `<a href="#">` para Instagram/LinkedIn dentro de un `<span aria-hidden>` (links muertos ocultos a lectores). Cablearlos a las env (como hace el Header) y exponerlos solo si están configurados.

- [ ] **Step 1: Leer las env en el componente `Home`**

Al inicio de `Home`, después de `const featuredProducts = ...`:

```tsx
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;
```

- [ ] **Step 2: Reemplazar el `<span aria-hidden>` con los dos `<a href="#">`**

Reemplazar el bloque completo del `<span ... aria-hidden>...</span>` (los íconos de Instagram y LinkedIn) por enlaces condicionales reales:

```tsx
            <span className="flex items-center gap-3">
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full p-2 text-ink-soft transition hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2" aria-label="Instagram de Los Álamos">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer rounded-full p-2 text-ink-soft transition hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2" aria-label="LinkedIn de Los Álamos">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </span>
```

Nota: si ninguna env está definida, el `<span>` queda vacío y no se muestran íconos rotos. Ya no hay `aria-hidden` ni `href="#"`.

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "fix(a11y): links sociales reales en el footer (env, sin href muertos)"
```

---

## Self-Review (cobertura vs spec — Fase 3)

- ✅ Quitar `unoptimized` (ProductCard + ProductGallery) → Task 2.
- ✅ `remotePatterns` del Directus de producción → Task 1.
- ✅ OG images por producto → Task 3.
- ✅ Metadata por categoría en `/productos` → Task 3.
- ✅ JSON-LD de producto → Task 3.
- ✅ Fix de `href="#"` del footer (Instagram/LinkedIn) → Task 4.
- ✅ metadataBase + template de título (mejora SEO base) → Task 1.
- ↪ Revisión de contraste/foco/headings: el sistema de Fase 1 ya usa `--ink`/`--brand` con buen contraste y focus rings consistentes; se valida en el recorrido visual de cierre, sin cambios de código previstos.

**Verificación de cierre de fase:** `npx tsc --noEmit` limpio, `npm run lint` sin errores nuevos, `npm run build` OK, y recorrido visual confirmando que **las imágenes cargan optimizadas** (`/_next/image`) en catálogo y producto, y que los links del footer apuntan a las redes reales (o no aparecen si no hay env).

---

## Cierre del rediseño

Completadas las 3 fases, el trabajo queda listo en `redesign/editorial-minimal` para revisión de la clienta y, con su OK, merge/PR a `main` (vía superpowers:finishing-a-development-branch).
