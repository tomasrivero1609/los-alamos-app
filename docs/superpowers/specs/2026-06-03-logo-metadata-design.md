# Logo + Metadata — Los Álamos · Diseño

**Fecha:** 2026-06-03
**Estado:** Aprobado (diseño) — pendiente plan de implementación
**Rama:** `redesign/editorial-minimal` (continúa el rediseño)

## Contexto

El sitio ya tiene el rediseño "Editorial Minimal · Verde heritage" (Fases 1–3). Faltan dos piezas de identidad:

1. **Logo propio en SVG.** Hoy el header usa solo el wordmark de texto "los álamos." y el hero usa `logo-los-alamos.jpeg`. Existe un `public/logo.png`: un **sello circular verde con tres álamos** (los árboles) + "LOS ÁLAMOS / Indumentaria laboral", pero es raster, pintado, y no escala nítido para header/favicon.
2. **Title / description** genéricos que conviene mejorar para SEO.

## Objetivo

- Crear un **símbolo vectorial limpio de los tres álamos** (continuidad con la marca actual) y un componente `Logo` reutilizable.
- Integrarlo en header, favicon y footer/OG.
- Mejorar el copy de `title` / `description`.

Sin cambios de datos ni de API. Mantiene los tokens y el estilo editorial de las fases previas.

## Dirección aprobada

**Logo "Trío sólido":** tres álamos como siluetas plenas (almendra/llama vertical) en verde de marca `#3f5840`, el del medio más alto, con troncos finos. Moderno, reconocible y legible incluso a 16px. El **wordmark** se mantiene en minúscula editorial: **"los álamos."** (punto en verde), con eyebrow "Indumentaria laboral".

El **sello circular** (Dirección C) NO se implementa ahora; el `logo.png` actual queda disponible para usos de packaging/etiquetas.

### Geometría del símbolo (SVG, `viewBox="0 0 120 96"`)

Árboles (relleno `currentColor`):
```
M35 30 Q46 51 35 72 Q24 51 35 30 Z
M60 16 Q73 44 60 72 Q47 44 60 16 Z
M85 32 Q96 52 85 72 Q74 52 85 32 Z
```
Troncos (trazo `currentColor`, `stroke-width="2.5"`, `stroke-linecap="round"`):
```
M35 72 V80   M60 72 V83   M85 72 V80
```

El símbolo usa `fill="currentColor"` / `stroke="currentColor"` para heredar color (verde en claro, blanco en fondos oscuros).

## Componentes y archivos

### `Logo` (componente nuevo)
- `frontend/src/components/ui/Logo.tsx`
- Props: `variant?: "mark" | "full"` (default `"full"`), `className?`.
  - `mark`: solo el SVG del símbolo (hereda `currentColor`).
  - `full`: símbolo + wordmark "los álamos." + eyebrow "Indumentaria laboral".
- El símbolo se extrae a un sub-componente interno (`AlamosMark`) para reusar en `mark` y `full`.
- Server-component friendly (sin estado).

### Integración
- **Header** (`frontend/src/components/Header.tsx`): reemplazar el `<Link href="/">los álamos.</Link>` de texto por `<Link href="/"><Logo variant="full" /></Link>`. Mantiene el verde del punto y el eyebrow.
- **Favicon**: agregar `frontend/src/app/icon.svg` (símbolo blanco sobre cuadro verde `#3f5840`, esquinas redondeadas) — Next lo sirve como favicon automáticamente. Se elimina/sustituye el `favicon.ico` genérico (Next prioriza `icon.svg`; se puede conservar `favicon.ico` como fallback o quitarlo).
- **Footer** (sección `#contacto` en `page.tsx`): opción de sumar `<Logo variant="mark" className="text-brand" />` arriba del bloque de contacto (nice-to-have, no obligatorio).
- **OG / hero**: fuera de alcance de esta tanda (el hero sigue con su imagen; el OG por defecto ya existe de Fase 3). Se puede evaluar una OG image con el símbolo más adelante.

### Metadata (`frontend/src/app/layout.tsx`)
Actualizar el objeto `metadata` (manteniendo `metadataBase`, `template` y OG de Fase 3):

| Campo | Valor aprobado |
|---|---|
| `title.default` | `Los Álamos · Indumentaria y ropa de trabajo` |
| `title.template` | `%s · Los Álamos` |
| `description` | `Indumentaria laboral y ropa de trabajo para empresas y equipos: camperas, pantalones, buzos y más. Calidad durable, envíos a todo el país. Consultá por WhatsApp.` |
| `openGraph.title` | igual al `title.default` |
| `openGraph.description` | igual a `description` |

## No incluido (YAGNI)

- Sello circular vectorial (Dirección C) — queda el `logo.png` para packaging.
- OG image personalizada con el logo — evaluable a futuro.
- Cambiar la imagen del hero.
- Animaciones del logo.

## Verificación

- `npx tsc --noEmit` limpio, `npm run lint` sin errores nuevos (baseline actual: 0), `npm run build` OK.
- Chequeo visual: header con el símbolo + wordmark, favicon nítido en la pestaña, render correcto en mobile.
