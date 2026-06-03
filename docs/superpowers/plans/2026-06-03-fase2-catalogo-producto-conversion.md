# Fase 2 — Catálogo + Producto + Conversión · Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer el catálogo navegable (filtros visibles), restylear la página de producto al sistema editorial con CTA de WhatsApp sticky en mobile, y restylear el formulario de cotización — reforzando la conversión.

**Architecture:** Reutiliza los tokens y primitivos (`Button`, `Eyebrow`) de la Fase 1. Se agrega un componente `CategoryFilter` (Server Component con pills via `<Link>`). Producto y cotización consumen tokens; no se toca la capa de datos (`directus.ts`) ni las rutas de API.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4.

**Verificación (sin suite de tests):** cada tarea cierra con `npx tsc --noEmit` limpio + `npm run lint` sin errores nuevos (baseline pre-fase: 1 error en `/admin/cotizaciones` + 2 warnings en `ProductGallery`). Al cerrar la fase: `npm run build` OK + chequeo visual en `npm run dev` (Directus local en `:8055` debe estar arriba). Todos los comandos desde `frontend/`.

**Referencia de diseño:** `docs/superpowers/specs/2026-06-02-rediseno-editorial-design.md`

---

## File Structure

| Archivo | Responsabilidad | Acción |
|---|---|---|
| `frontend/src/components/CategoryFilter.tsx` | Pills de categoría con estado activo (Server Component) | Crear |
| `frontend/src/app/productos/page.tsx` | Header editorial + filtro + contador + grid | Modificar |
| `frontend/src/components/ProductDetail.tsx` | Restyle editorial + CTA WhatsApp sticky mobile | Modificar |
| `frontend/src/app/producto/[slug]/page.tsx` | Breadcrumb / back link + contenedor | Modificar |
| `frontend/src/components/ProductGallery.tsx` | Tokens + fix de warnings de lint | Modificar |
| `frontend/src/app/cotizacion/page.tsx` | Restyle del form a tokens + Button | Modificar |

---

## Task 1: Componente `CategoryFilter`

**Files:**
- Create: `frontend/src/components/CategoryFilter.tsx`

- [ ] **Step 1: Crear `CategoryFilter.tsx`**

```tsx
import Link from "next/link";
import type { Category } from "@/types/directus";

interface CategoryFilterProps {
  categories: Category[];
  /** slug de la categoría activa, o null para "Todos" */
  active: string | null;
}

const base =
  "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
const activeCls = "border-brand bg-brand text-white";
const idleCls = "border-line text-ink-soft hover:border-ink hover:text-ink";

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="flex flex-wrap justify-center gap-2" aria-label="Filtrar por categoría">
      <Link href="/productos" className={`${base} ${active === null ? activeCls : idleCls}`}>
        Todos
      </Link>
      {categories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}`}
            className={`${base} ${isActive ? activeCls : idleCls}`}
            aria-current={isActive ? "page" : undefined}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Verificar**

Run (desde `frontend/`): `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos; componente aún sin usar no debe romper).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/CategoryFilter.tsx
git commit -m "feat(catalogo): componente CategoryFilter (pills)"
```

---

## Task 2: Página de catálogo editorial con filtro

**Files:**
- Modify: `frontend/src/app/productos/page.tsx`

- [ ] **Step 1: Reescribir `productos/page.tsx`**

Header con eyebrow + título en negro, fila de filtros, contador de resultados, empty state cuidado, grid con más aire.

```tsx
import { fetchCategories, fetchProducts } from "@/lib/directus";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface ProductosProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductosPage({ searchParams }: ProductosProps) {
  const { categoria } = await searchParams;
  const [products, categories] = await Promise.all([
    fetchProducts(categoria),
    fetchCategories(),
  ]);

  const categoryName = categoria
    ? categories.find((c) => c.slug === categoria)?.name ?? categoria
    : null;
  const title = categoryName ?? "Todos los productos";

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <Eyebrow>Catálogo</Eyebrow>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
          {title}
        </h1>
      </div>

      <div className="mt-8">
        <CategoryFilter categories={categories} active={categoria ?? null} />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">
          No hay productos en esta categoría por ahora. Probá con otra o mirá todo el catálogo.
        </p>
      ) : (
        <>
          <p className="mt-8 text-center text-sm text-ink-soft">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
```

Nota: la grilla pasa a 2 columnas en mobile / 4 en desktop (más editorial). El `ProductCard` (Fase 1) ya muestra el nombre debajo.

- [ ] **Step 2: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/productos/page.tsx
git commit -m "feat(catalogo): header editorial + filtro de categorias + contador"
```

---

## Task 3: ProductGallery a tokens + fix de warnings

**Files:**
- Modify: `frontend/src/components/ProductGallery.tsx`

- [ ] **Step 1: Mover el eslint-disable al `<img>` y aplicar tokens**

El warning "Unused eslint-disable directive" ocurre porque el comentario está en la línea 7 pero el `<img>` está en la 9. Mover el comentario justo encima del `<img>`. Reemplazar el componente `LightboxImg`:

```tsx
const LightboxImg = ({ src, alt }: { src: string; alt: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- lightbox: tamaño natural, fuera de optimización
  <img src={src} alt={alt} className="max-h-[90vh] w-auto max-w-[90vw] object-contain" />
);
```

- [ ] **Step 2: Tokens en placeholders y rings**

Reemplazos:
- Empty state: `bg-zinc-100 dark:bg-zinc-800 text-zinc-500` → `bg-surface text-ink-soft`
- Botón de cada imagen: `bg-zinc-100 dark:bg-zinc-800 focus:ring-2 focus:ring-zinc-400` → `bg-surface focus:ring-2 focus:ring-brand`

- [ ] **Step 3: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint`. Esperado: desaparecen los **2 warnings** de ProductGallery (la directiva ahora sí aplica al `<img>`).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ProductGallery.tsx
git commit -m "fix(producto): galeria a tokens y eslint-disable en su lugar"
```

---

## Task 4: ProductDetail editorial + CTA WhatsApp sticky en mobile

**Files:**
- Modify: `frontend/src/components/ProductDetail.tsx`

Mantener intacta toda la lógica (variantes, `selectedIndex`, disponibilidad, `getVariantImageIds`, ficha técnica). Solo cambian las clases y se agrega una barra sticky en mobile.

- [ ] **Step 1: Importar el primitivo Button**

Agregar al tope:
```tsx
import { Button } from "@/components/ui/Button";
```

- [ ] **Step 2: Restyle del encabezado y secciones de info**

Reemplazos de clases dentro del `return`:
- Categoría: `text-base text-zinc-500` → `text-sm text-ink-soft`
- Título `h1`: `mt-1 text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl` → `mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl`
- Botón "Ficha técnica" (`<a ...>`): reemplazar las clases `rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)]` por `rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white` (queda como acción secundaria; el WhatsApp es la primaria).
- Sub-encabezados `h2` de Descripción / Características / Uso recomendado: `text-base font-semibold uppercase tracking-wide text-[var(--brand)]` → `text-xs font-semibold uppercase tracking-wider text-ink-soft` (los tres).
- Cuerpos de texto: `text-lg text-zinc-600` → `text-base text-ink-soft` (descripción, características `ul`, uso recomendado).
- Label "Color:" `text-sm font-medium text-zinc-700` → `text-sm font-medium text-ink`; el valor `font-semibold` queda.
- Botones de color seleccionado: `border-[var(--brand)] ring-1 ring-[var(--brand)]` → `border-ink ring-1 ring-ink`; inactivos `border-zinc-300 hover:border-zinc-400` → `border-line hover:border-ink`.
- Precio: `text-xl font-medium text-[var(--brand)]` → `text-xl font-semibold text-ink`.

- [ ] **Step 3: Reemplazar el CTA de WhatsApp por el primitivo + barra sticky mobile**

Reemplazar el `<a ...>Consultar por WhatsApp</a>` final por un bloque que: (a) en desktop queda inline como ahora, (b) en mobile aparece fijo abajo. Reemplazar:

```tsx
        <a
          href={whatsappProductUrl(product.name, selectedColor?.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#20BD5A]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
```

por:

```tsx
        {/* Desktop: CTA inline */}
        <div className="mt-6 hidden lg:block">
          <Button
            href={whatsappProductUrl(product.name, selectedColor?.name)}
            external
            variant="whatsapp"
          >
            Consultar por WhatsApp
          </Button>
        </div>
      </div>

      {/* Mobile: CTA sticky abajo */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <Button
          href={whatsappProductUrl(product.name, selectedColor?.name)}
          external
          variant="whatsapp"
          className="w-full"
        >
          Consultar por WhatsApp{selectedColor?.name ? ` · ${selectedColor.name}` : ""}
        </Button>
      </div>
    </div>
  );
}
```

Nota: la barra sticky usa el mismo `selectedColor`, por lo que refleja el color elegido. El padding inferior extra para que no tape contenido se agrega en la página (Task 5).

- [ ] **Step 4: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos). `whatsappProductUrl` sigue importado y usado.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ProductDetail.tsx
git commit -m "feat(producto): restyle editorial + CTA WhatsApp sticky en mobile"
```

---

## Task 5: Página de producto — breadcrumb y contenedor

**Files:**
- Modify: `frontend/src/app/producto/[slug]/page.tsx`

- [ ] **Step 1: Restyle del back-link y padding inferior para la barra sticky**

Reemplazar el `<main>` y el `<Link>` de volver:

```tsx
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 pb-28 lg:pb-12">
      <nav className="mb-6 text-sm text-ink-soft" aria-label="Migas de pan">
        <Link href="/" className="hover:text-ink">Inicio</Link>
        <span className="mx-2" aria-hidden>/</span>
        <Link href="/productos" className="hover:text-ink">Catálogo</Link>
        <span className="mx-2" aria-hidden>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} />
    </main>
  );
```

Nota: `pb-28 lg:pb-12` reserva espacio para la barra sticky de WhatsApp en mobile. `Link` ya está importado en este archivo.

- [ ] **Step 2: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/producto/[slug]/page.tsx
git commit -m "feat(producto): breadcrumb editorial y espacio para CTA sticky"
```

---

## Task 6: Restyle del formulario de cotización

**Files:**
- Modify: `frontend/src/app/cotizacion/page.tsx`

Mantener intacta toda la lógica (`handleSubmit`, estados `sending`/`sent`/`error`, fetch a `/api/cotizacion`). Solo clases + header + botón.

- [ ] **Step 1: Importar primitivos**

Agregar bajo los imports existentes:
```tsx
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
```

- [ ] **Step 2: Restyle del back-link y header**

- Back link: `mb-8 inline-block text-sm text-zinc-600 hover:underline` → `mb-8 inline-block text-sm text-ink-soft hover:text-ink`
- Header: reemplazar el `h1` y `p`:
```tsx
      <header className="mb-12">
        <Eyebrow>Cotización</Eyebrow>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Pedir cotización
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Contanos qué necesitás y te respondemos con una cotización a medida. No te olvides de indicar productos de interés, cantidades aproximadas y plazos si los tenés.
        </p>
      </header>
```

- [ ] **Step 3: Tokens en labels e inputs (replace_all)**

Como los estilos de campo se repiten, aplicar reemplazos globales en el archivo:
- `text-sm font-medium text-zinc-800` → `text-sm font-medium text-ink` (labels, replace_all)
- La clase de input/textarea/select se repite; reemplazar (replace_all) la subcadena:
  `border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]`
  →
  `border border-line px-4 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand`
- `placeholder:text-zinc-400` → `placeholder:text-ink-soft/60` (replace_all)

- [ ] **Step 4: Botón submit → estilo primario**

El submit es un `<button type="submit" disabled>` con texto dinámico, así que se mantiene como `<button>` pero con clases del primario. Reemplazar sus clases:
`w-full rounded-lg bg-[var(--brand)] px-6 py-3 font-medium text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-60`
→
`w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60`

(No se usa el primitivo `Button` acá porque necesita `type="submit"` + `disabled` dinámico; mantener `<button>` con las clases del sistema es lo correcto.)

- [ ] **Step 5: Caja de éxito a tokens (opcional, mantener semántica verde)**

La caja `sent` usa verdes de feedback (`green-200/50/800`); dejarla como está (es color semántico de éxito, no de marca). Sin cambios.

- [ ] **Step 6: Verificar**

Run: `npx tsc --noEmit` (limpio) y `npm run lint` (sin errores nuevos).

- [ ] **Step 7: Commit**

```bash
git add frontend/src/app/cotizacion/page.tsx
git commit -m "feat(cotizacion): restyle del formulario al sistema editorial"
```

---

## Self-Review (cobertura vs spec — Fase 2)

- ✅ Catálogo con filtro de categorías visible (pills) + contador + empty state → Tasks 1, 2.
- ✅ Producto restyle editorial (título ink, jerarquía) → Task 4.
- ✅ CTA "Consultar por WhatsApp" sticky en mobile → Task 4 + espacio en Task 5.
- ✅ Breadcrumb en producto → Task 5.
- ✅ Galería a tokens → Task 3 (de paso limpia los 2 warnings pre-existentes).
- ✅ Restyle del form de cotización → Task 6.
- ✅ Conversión: WhatsApp como CTA primaria en producto, ficha técnica como secundaria; "Pedir cotización" reforzado en home (Fase 1) y form propio.
- ↪ Fuera de Fase 2 (van a Fase 3): quitar `unoptimized`, `remotePatterns` de prod, metadata/OG por categoría, JSON-LD, fix de `href="#"` del footer, revisión final de contraste/foco/headings.

**Verificación de cierre de fase:** `npx tsc --noEmit` limpio, `npm run lint` sin errores nuevos (idealmente 1 error restante — solo `/admin/cotizaciones` — y 0 warnings), `npm run build` OK, y recorrido visual de `/productos`, una página de producto (con prueba del CTA sticky en viewport mobile) y `/cotizacion`.

---

## Fase siguiente (se planifica al arrancar)

- **Fase 3 — Performance / SEO / A11y:** `unoptimized` + `remotePatterns` del Directus de producción, metadata/OG por producto y categoría, JSON-LD opcional, fix de links del footer y revisión de contraste/foco/headings.
