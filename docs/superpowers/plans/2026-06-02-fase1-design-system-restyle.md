# Fase 1 — Design System + Restyle Global · Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el sistema visual "Editorial Minimal · Verde heritage" a las fundaciones (tokens) y a todos los componentes globales y la home, sin tocar estructura de datos ni API.

**Architecture:** Todo hereda de tokens CSS en `globals.css` (Tailwind v4 `@theme inline` los expone como utilidades `bg-brand`, `text-ink`, `border-line`, etc.). Se agregan dos primitivos reutilizables (`Button`, `Eyebrow`) para DRY el restyle. Luego se restylea cada componente consumiendo tokens y primitivos.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Geist Sans.

**Verificación (sin suite de tests):** cada tarea cierra con `npm run lint` + `npm run build` OK y un chequeo visual en `npm run dev` (http://localhost:3000). Todos los comandos se ejecutan desde `frontend/`.

**Referencia de diseño:** `docs/superpowers/specs/2026-06-02-rediseno-editorial-design.md`

---

## File Structure

| Archivo | Responsabilidad | Acción |
|---|---|---|
| `frontend/src/app/globals.css` | Tokens, escala tipográfica, utilidad eyebrow | Modificar |
| `frontend/src/components/ui/Button.tsx` | Botón primario/secundario/whatsapp (link o button) | Crear |
| `frontend/src/components/ui/Eyebrow.tsx` | Kicker reutilizable | Crear |
| `frontend/src/components/Header.tsx` | Header editorial con logo a la izquierda | Modificar |
| `frontend/src/components/NavLinks.tsx` | Nav/dropdowns en tema claro | Modificar |
| `frontend/src/app/page.tsx` | Hero + todas las secciones de home | Modificar |
| `frontend/src/components/HeroLogo.tsx` | Tratamiento de fondo del hero | Modificar |
| `frontend/src/components/ProductCard.tsx` | Card editorial (nombre siempre visible) | Modificar |

Convención: el repo usa clases Tailwind inline (sin librería de componentes). Los primitivos `ui/` son mínimos y opcionales de adoptar, pero reducen duplicación en CTAs y kickers.

---

## Task 1: Tokens, escala tipográfica y utilidad eyebrow

**Files:**
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Reemplazar el contenido de `globals.css`**

```css
@import "tailwindcss";

/* Dark mode solo con clase .dark (no usamos, todo light) */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: #ffffff;
  --foreground: #111111;

  /* Sistema Editorial Minimal · Verde heritage */
  --ink: #111111;        /* texto / titulares */
  --ink-soft: #52525b;   /* cuerpo secundario */
  --brand: #3f5840;      /* acento protagonista (reemplaza #4a5d4a) */
  --brand-hover: #324530;
  --brand-tint: #eef2ec; /* washes suaves */
  --surface: #fafafa;    /* secciones alternas sutiles */
  --line: #ececec;       /* bordes hairline */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-brand: var(--brand);
  --color-brand-hover: var(--brand-hover);
  --color-brand-tint: var(--brand-tint);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}

/* Eyebrow / kicker editorial */
.eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--brand);
}

/* Titular display fluido (hero) */
.display {
  font-size: clamp(2.25rem, 5vw, 4rem);
  line-height: 1.03;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: var(--ink);
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 35s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee {
    animation: none;
  }
}
```

Nota: se elimina la regla `.card-title-glow` (el efecto de título que sube en la card); se reemplaza por nombre siempre visible en la Task 6.

- [ ] **Step 2: Verificar build/lint**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: ambos OK. `bg-brand`, `text-ink`, `text-ink-soft`, `bg-surface`, `border-line` quedan disponibles como utilidades.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat(design): nuevos tokens editorial-minimal + eyebrow/display utils"
```

---

## Task 2: Primitivos `Button` y `Eyebrow`

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Eyebrow.tsx`

- [ ] **Step 1: Crear `Button.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "whatsapp";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "rounded-lg bg-brand px-6 py-3 text-sm text-white hover:bg-brand-hover focus-visible:ring-brand",
  secondary:
    "rounded-lg border border-ink px-6 py-3 text-sm text-ink hover:bg-ink hover:text-white focus-visible:ring-ink",
  whatsapp:
    "rounded-full bg-[#25D366] px-5 py-2.5 text-sm text-white hover:bg-[#20bd5a] focus-visible:ring-[#25D366]",
};

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonProps =
  | (BaseProps & { href: string; external?: boolean; onClick?: never; type?: never })
  | (BaseProps & { href?: never; onClick?: () => void; type?: "button" | "submit" });

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const ext = props.external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <Link href={props.href} className={cls} {...ext}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={("type" in props && props.type) || "button"}
      onClick={"onClick" in props ? props.onClick : undefined}
      className={cls}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Crear `Eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}
```

- [ ] **Step 3: Verificar lint/build**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK (componentes aún no usados, no deben romper el build).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/ui/Button.tsx frontend/src/components/ui/Eyebrow.tsx
git commit -m "feat(ui): primitivos Button y Eyebrow"
```

---

## Task 3: Header editorial con logo a la izquierda

**Files:**
- Modify: `frontend/src/components/Header.tsx`
- Modify: `frontend/src/components/NavLinks.tsx`

- [ ] **Step 1: Reescribir `Header.tsx`**

Header claro (paper) con logo a la izquierda y nav a la derecha, hairline inferior, sticky.

```tsx
import Link from "next/link";
import { fetchCategories } from "@/lib/directus";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { NavLinks } from "./NavLinks";

export async function Header() {
  const categories = await fetchCategories();
  const socialLinks = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "#",
    whatsapp: whatsappContactUrl(),
  };

  return (
    <header className="sticky left-0 right-0 top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          los álamos<span className="text-brand">.</span>
        </Link>
        <NavLinks categories={categories} socialLinks={socialLinks} />
      </div>
    </header>
  );
}
```

Nota: el layout usa `fixed`/`pt` para compensar el header fijo. Como ahora es `sticky`, no hace falta padding-top extra; verificar visualmente que la home no quede tapada (el hero ya ocupa `min-h-screen`).

- [ ] **Step 2: Restyle de `NavLinks.tsx` a tema claro**

Cambiar las clases que asumen fondo verde a tema claro. Reemplazos exactos:

- `linkClass` → 
```tsx
const linkClass =
  "cursor-pointer text-ink-soft font-medium transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
```
- En el botón hamburguesa (móvil), reemplazar `text-white hover:bg-white/10 hover:text-white ... focus-visible:ring-white focus-visible:ring-offset-[var(--brand)]` por:
```tsx
className="cursor-pointer rounded p-2 text-ink hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
```
- En los dropdowns, reemplazar las referencias `focus-visible:ring-[var(--brand)]` por `focus-visible:ring-brand` (equivalente; mantiene consistencia con utilidades). El resto de los dropdowns (fondo blanco, `text-zinc-700`) ya es compatible con tema claro: dejar igual.

- [ ] **Step 3: Verificar lint/build + visual**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK.
Visual (`npm run dev`): header blanco, logo "los álamos." a la izquierda en negro con punto verde, nav legible a la derecha, dropdowns funcionan, foco visible.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/Header.tsx frontend/src/components/NavLinks.tsx
git commit -m "feat(header): header editorial claro con logo a la izquierda"
```

---

## Task 4: Hero editorial

**Files:**
- Modify: `frontend/src/app/page.tsx` (sección `#hero`, líneas ~45-66)
- Modify: `frontend/src/components/HeroLogo.tsx`

- [ ] **Step 1: Reemplazar la sección `#hero` en `page.tsx`**

Reemplazar el bloque actual `<section id="hero">...</section>` (overlay negro + typewriter centrado) por un hero editorial con eyebrow, titular display y dos botones. Importar `Button` y `Eyebrow` arriba del archivo:

```tsx
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
```

Sección:

```tsx
<section id="hero" className="relative overflow-hidden border-b border-line">
  <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
    <div>
      <Eyebrow>Indumentaria laboral</Eyebrow>
      <h1 className="display mt-4">Ropa de trabajo que rinde todos los días.</h1>
      <p className="mt-5 max-w-md text-base text-ink-soft sm:text-lg">
        Equipamos a tu equipo con prendas resistentes, cómodas y a buen precio. Envíos a todo el país.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/productos" variant="primary">Ver catálogo</Button>
        <Button href="/cotizacion" variant="secondary">Pedir cotización</Button>
      </div>
    </div>
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
      <HeroLogo />
    </div>
  </div>
</section>
```

Nota: se eliminan del hero el `HeroTypewriter` y el overlay negro. Mantener el import de `HeroTypewriter` solo si se reutiliza en otra sección; si no, quitar el import para que el lint no marque "unused".

- [ ] **Step 2: Ajustar `HeroLogo.tsx`**

Asegurar que `HeroLogo` rellena su contenedor (`fill` con `object-cover`) sin overlay oscuro. Revisar el componente y dejar la imagen `fill object-cover` dentro del contenedor con `aspect-[4/5]` definido por el padre. Quitar cualquier `bg-black/50` interno si existiera.

- [ ] **Step 3: Verificar lint/build + visual**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK, sin warnings de imports sin usar.
Visual: hero a dos columnas, titular grande en negro, eyebrow verde, dos botones, imagen a la derecha. Sin overlay negro.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/page.tsx frontend/src/components/HeroLogo.tsx
git commit -m "feat(home): hero editorial a dos columnas con CTAs"
```

---

## Task 5: ProductCard editorial

**Files:**
- Modify: `frontend/src/components/ProductCard.tsx`

- [ ] **Step 1: Reemplazar el render de la card**

Nombre siempre visible debajo de la imagen (en negro), sin el overlay/glow que sube. Mantener `getColors`, `getFirstImageId`, el manejo de `reduceMotion` para el zoom y las muestras de color. Reemplazar el `return (...)`:

```tsx
return (
  <article className="group flex flex-col">
    <Link
      href={`/producto/${product.slug}`}
      className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      aria-label={`Ver producto: ${product.name}`}
    >
      {imageId ? (
        <Image
          src={assetUrl(imageId)}
          alt={product.name}
          fill
          className={imageClass}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center text-ink-soft">
          Sin imagen
        </div>
      )}
    </Link>

    <div className="mt-3 flex items-start justify-between gap-2">
      <h2 className="text-sm font-semibold text-ink">{product.name}</h2>
      {colors.length > 0 && (
        <div className="flex items-center gap-1.5 pt-0.5">
          {colors.slice(0, MAX_VISIBLE_COLORS).map((c) => (
            <span
              key={c.id}
              className="block h-3.5 w-3.5 rounded-full border border-line"
              style={{ backgroundColor: c.hex }}
              title={c.name}
              aria-label={c.name}
            />
          ))}
          {colors.length > MAX_VISIBLE_COLORS && (
            <span className="text-xs text-ink-soft">+{colors.length - MAX_VISIBLE_COLORS}</span>
          )}
        </div>
      )}
    </div>
  </article>
);
```

Nota: `imageClass` se mantiene (zoom sutil en hover respetando `reduceMotion`). `titleClass` y la dependencia de `.card-title-glow` quedan sin uso — eliminarlos del componente para que el lint no marque variables sin usar. `unoptimized` se mantiene en esta fase; se quita en Fase 3.

- [ ] **Step 2: Verificar lint/build + visual**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK, sin variables sin usar.
Visual: cards con foto, nombre en negro siempre visible, muestras de color a la derecha del nombre, zoom sutil al pasar el mouse.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ProductCard.tsx
git commit -m "feat(card): ProductCard editorial con nombre siempre visible"
```

---

## Task 6: Restyle de secciones de la home

**Files:**
- Modify: `frontend/src/app/page.tsx` (secciones de destacados, "por qué elegirnos", "cómo trabajamos", CTA cotización, marcas, contacto/footer)

Objetivo: quitar la alternancia de fondos `bg-zinc-50/100`, aplicar tokens, ritmo de espaciado consistente, eyebrows y botones unificados.

- [ ] **Step 1: Encabezados de sección → patrón eyebrow + título**

En cada sección, reemplazar el patrón `<h2 class="... uppercase ... text-[var(--brand)]">TÍTULO</h2>` por el par Eyebrow + título en negro. Patrón a aplicar (ejemplo destacados):

```tsx
<div className="text-center">
  <Eyebrow>Catálogo</Eyebrow>
  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
    Nuestros productos destacados
  </h2>
  <p className="mx-auto mt-3 max-w-xl text-ink-soft">
    Una selección de lo mejor de nuestra línea de indumentaria laboral.
  </p>
</div>
```

Aplicar el mismo patrón (eyebrow corto + `h2` en `text-ink` + bajada en `text-ink-soft`) a: "Nuestros productos destacados" (eyebrow: *Catálogo*), "¿Por qué elegirnos?" (*Nosotros*), "Detalles de nuestra indumentaria…" (*Detalles*), "¿Cómo trabajamos en Álamos?" (*Proceso*), "¿Necesitás una cotización a medida?" (*Cotización*), "Marcas que confían en nosotros" (*Confianza*).

- [ ] **Step 2: Fondos de sección → aire + hairlines**

Reemplazos de clase de `<section>`:
- `border-b border-zinc-200 bg-zinc-50` → `border-b border-line bg-white`
- `bg-zinc-100/60` y `bg-zinc-100` → `bg-surface`
- Subir el padding vertical a `py-24` donde hoy sea `py-16` para ritmo editorial.
- En las mini-cards de "por qué elegirnos" y el proceso: `border-zinc-200/80 bg-white` → `border-line bg-white`; íconos `text-[var(--brand)]` → `text-brand`; divisores `divide-sky-200/80` → `divide-line`.

- [ ] **Step 3: Botones de sección → primitivo `Button`**

- "Ver todo el catálogo" y "Pedir cotización": reemplazar los `<Link className="... bg-[var(--brand)] ...">` por `<Button href="/productos" variant="primary">` y `<Button href="/cotizacion" variant="primary">`.
- Botón WhatsApp del footer: reemplazar por `<Button href={whatsappContactUrl()} external variant="whatsapp">WhatsApp</Button>` (mantener el `<svg>` adentro como children junto al texto).

- [ ] **Step 4: Footer — arreglar texto de copy y colores**

En la sección `#contacto`, cambiar `bg-zinc-100` → `bg-surface`, `border-zinc-200` → `border-line`, y los hovers `hover:bg-zinc-200 hover:text-zinc-900` → `hover:bg-white hover:text-ink`. (El fix de los `href="#"` de Instagram/LinkedIn se hace en Fase 3.)

- [ ] **Step 5: Verificar lint/build + visual**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK.
Visual: home sin bloques grises alternados, separada por aire/hairlines, encabezados con eyebrow verde + título negro, botones consistentes.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat(home): restyle editorial de secciones (tokens, eyebrows, botones)"
```

---

## Task 7: Alinear componentes de carrusel/testimonios a tokens

**Files:**
- Modify: `frontend/src/components/TestimoniosSection.tsx`
- Modify: `frontend/src/components/TextCarousel.tsx`
- Modify: `frontend/src/components/MarcasCarousel.tsx`
- Modify: `frontend/src/components/IndumentariaCarousel.tsx`

- [ ] **Step 1: Reemplazar colores hardcodeados por tokens**

En cada componente, reemplazar:
- `text-[var(--brand)]` → `text-brand`
- `bg-[var(--brand)]` → `bg-brand` / hover `bg-brand-hover`
- `bg-zinc-50` / `bg-zinc-100` de fondo → `bg-surface` o `bg-white` según corresponda al ritmo
- `border-zinc-200` → `border-line`
- Títulos en MAYÚSCULA verde dentro de estos componentes → `text-ink` (mantener tamaño/peso), agregando `<Eyebrow>` arriba si el componente tiene encabezado propio.

Revisar cada archivo y aplicar los reemplazos donde aparezcan. No cambiar la lógica (marquee, estado de slides, props).

- [ ] **Step 2: Verificar lint/build + visual**

Run (desde `frontend/`): `npm run lint; npm run build`
Expected: OK.
Visual: testimonios y carruseles coherentes con el nuevo sistema; el marquee de marcas sigue animando y respeta `prefers-reduced-motion`.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/TestimoniosSection.tsx frontend/src/components/TextCarousel.tsx frontend/src/components/MarcasCarousel.tsx frontend/src/components/IndumentariaCarousel.tsx
git commit -m "feat(home): carruseles y testimonios alineados a tokens"
```

---

## Self-Review (cobertura vs spec — Fase 1)

- ✅ Tokens nuevos (`--ink`, `--brand:#3f5840`, `--brand-tint`, `--surface`, `--line`) + eyebrow + escala tipográfica → Task 1.
- ✅ Header editorial con logo a la izquierda → Task 3.
- ✅ Hero split editorial sin overlay negro → Task 4.
- ✅ Secciones de home sin alternancia zinc, con eyebrows y botones unificados → Task 6.
- ✅ ProductCard con nombre siempre visible (sin glow) → Task 5.
- ✅ Botones consistentes (primario/secundario/whatsapp) → Task 2 + uso en 4/6.
- ✅ Carruseles/testimonios a tokens → Task 7.
- ↪ Fuera de Fase 1 (van a Fase 2/3): filtros de catálogo, restyle de producto/cotización, `unoptimized`, `remotePatterns`, SEO, fix de `href="#"` del footer, a11y final. Documentado en el spec.

**Verificación de cierre de fase:** `npm run lint` y `npm run build` OK, y recorrido visual de la home + un par de cards en `npm run dev`.

---

## Fases siguientes (se planifican al arrancar cada una)

- **Fase 2 — Catálogo + producto + conversión:** barra de categorías (pills) visible en `/productos`, restyle editorial de `ProductDetail` + CTA WhatsApp sticky en mobile + breadcrumb, restyle del form `/cotizacion`.
- **Fase 3 — Performance / SEO / A11y:** quitar `unoptimized` y configurar `remotePatterns` del Directus de producción, metadata/OG por producto y categoría, JSON-LD opcional, fix de links del footer y revisión de contraste/foco/headings.
