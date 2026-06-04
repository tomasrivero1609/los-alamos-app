# Logo + Metadata · Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar el logo SVG de los tres álamos (componente `Logo`), integrarlo en header y favicon, y mejorar el copy de title/description.

**Architecture:** Componente `Logo` con símbolo SVG inline (`currentColor`), reutilizado en header/footer; `icon.svg` para favicon; metadata en `layout.tsx`. Reusa tokens del rediseño. Sin cambios de datos/API.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4.

**Verificación:** cada tarea cierra con `npx tsc --noEmit` limpio + `npm run lint` sin errores nuevos (baseline: 0). Cierre de tanda: `npm run build` OK + chequeo visual (header, favicon).

**Referencia:** `docs/superpowers/specs/2026-06-03-logo-metadata-design.md`

---

## Task 1: Componente `Logo`

**Files:** Create `frontend/src/components/ui/Logo.tsx`

- [ ] **Step 1: Crear el componente**

```tsx
interface LogoProps {
  variant?: "mark" | "full";
  className?: string;
}

function AlamosMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} fill="none" aria-hidden="true">
      <g fill="currentColor">
        <path d="M35 30 Q46 51 35 72 Q24 51 35 30 Z" />
        <path d="M60 16 Q73 44 60 72 Q47 44 60 16 Z" />
        <path d="M85 32 Q96 52 85 72 Q74 52 85 32 Z" />
      </g>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M35 72 V80" />
        <path d="M60 72 V83" />
        <path d="M85 72 V80" />
      </g>
    </svg>
  );
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "mark") {
    return <AlamosMark className={className || "h-7 w-auto text-brand"} />;
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AlamosMark className="h-7 w-auto text-brand" />
      <span className="leading-none">
        <span className="block text-lg font-extrabold tracking-tight text-ink">
          los álamos<span className="text-brand">.</span>
        </span>
        <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.2em] text-brand">
          Indumentaria laboral
        </span>
      </span>
    </span>
  );
}
```

- [ ] **Step 2: Verificar** — `npx tsc --noEmit` (limpio) y `npm run lint`.
- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/ui/Logo.tsx
git commit -m "feat(ui): componente Logo (simbolo SVG tres alamos)"
```

---

## Task 2: Integrar Logo en el Header

**Files:** Modify `frontend/src/components/Header.tsx`

- [ ] **Step 1: Importar y reemplazar el wordmark de texto**

Agregar import: `import { Logo } from "./ui/Logo";`

Reemplazar el `<Link href="/" ...>los álamos.</Link>` por:

```tsx
        <Link
          href="/"
          aria-label="Los Álamos — inicio"
          className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Logo variant="full" />
        </Link>
```

- [ ] **Step 2: Verificar** — `npx tsc --noEmit` (limpio) y `npm run lint`.
- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/Header.tsx
git commit -m "feat(header): usar el logo con simbolo de alamos"
```

---

## Task 3: Favicon (icon.svg) + metadata copy

**Files:** Create `frontend/src/app/icon.svg`; Modify `frontend/src/app/layout.tsx`

- [ ] **Step 1: Crear `icon.svg`** (símbolo blanco sobre cuadro verde redondeado)

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#3f5840"/>
  <g transform="translate(32 32) scale(0.6) translate(-60 -49.5)">
    <g fill="#ffffff">
      <path d="M35 30 Q46 51 35 72 Q24 51 35 30 Z"/>
      <path d="M60 16 Q73 44 60 72 Q47 44 60 16 Z"/>
      <path d="M85 32 Q96 52 85 72 Q74 52 85 32 Z"/>
    </g>
    <g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round">
      <path d="M35 72 V80"/><path d="M60 72 V83"/><path d="M85 72 V80"/>
    </g>
  </g>
</svg>
```

Nota: Next sirve `src/app/icon.svg` como favicon automáticamente (prioriza sobre `favicon.ico`). El `favicon.ico` existente queda como fallback.

- [ ] **Step 2: Actualizar metadata en `layout.tsx`**

Reemplazar `title` y `description` (mantener `metadataBase` y `openGraph.type/siteName`):

```tsx
  title: {
    default: "Los Álamos · Indumentaria y ropa de trabajo",
    template: "%s · Los Álamos",
  },
  description:
    "Indumentaria laboral y ropa de trabajo para empresas y equipos: camperas, pantalones, buzos y más. Calidad durable, envíos a todo el país. Consultá por WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Los Álamos",
    title: "Los Álamos · Indumentaria y ropa de trabajo",
    description:
      "Indumentaria laboral y ropa de trabajo para empresas y equipos: camperas, pantalones, buzos y más. Calidad durable, envíos a todo el país. Consultá por WhatsApp.",
  },
```

- [ ] **Step 3: Verificar** — `npx tsc --noEmit` (limpio), `npm run lint`, y `npm run build` (OK).
- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/icon.svg frontend/src/app/layout.tsx
git commit -m "feat(seo): favicon con simbolo de alamos + copy de title/description"
```

---

## Task 4: Símbolo en el footer (remate de marca)

**Files:** Modify `frontend/src/app/page.tsx`

- [ ] **Step 1: Importar y sumar el símbolo arriba del bloque de contacto**

Import: `import { Logo } from "@/components/ui/Logo";`

En la sección `#contacto`, dentro del contenedor centrado, agregar antes del bloque de botones:

```tsx
          <Logo variant="mark" className="h-9 w-auto text-brand" />
```

- [ ] **Step 2: Verificar** — `npx tsc --noEmit` (limpio) y `npm run lint`.
- [ ] **Step 3: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat(footer): remate con el simbolo de alamos"
```

---

## Self-Review (cobertura vs spec)

- ✅ Componente `Logo` (mark/full) con la geometría del spec → Task 1.
- ✅ Header con símbolo + wordmark → Task 2.
- ✅ Favicon `icon.svg` → Task 3.
- ✅ Metadata title/description aprobados → Task 3.
- ✅ Footer mark (era opcional en el spec; se incluye) → Task 4.

**Cierre:** `tsc` limpio, `lint` sin errores nuevos, `build` OK, header/favicon verificados visualmente.
