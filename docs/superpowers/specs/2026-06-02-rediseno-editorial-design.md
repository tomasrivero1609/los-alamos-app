# Rediseño integral — Los Álamos Indumentaria (Editorial Minimal)

**Fecha:** 2026-06-02
**Estado:** Aprobado (diseño) — pendiente plan de implementación

## Contexto

Sitio catálogo B2B (sin checkout) de indumentaria laboral. Frontend Next.js 16 (App Router) + React 19 + Tailwind v4, consume Directus (solo lectura) y convierte vía WhatsApp y formulario de cotización. El diseño actual es funcional pero genérico ("template"): mucho gris zinc alternado, un solo verde apagado (`#4a5d4a`), títulos en MAYÚSCULA verdes tracked por todos lados, íconos Heroicons estándar.

## Objetivo

Rediseño **integral** que cubre los cuatro frentes elegidos por el usuario:
1. Verse más premium/distintivo.
2. Más conversión (cotizar / WhatsApp).
3. Mejor experiencia de catálogo.
4. Performance / accesibilidad / SEO.

Se ejecuta **por fases** (estrategia elegida): cada fase es revisable y deployable por separado.

## Dirección visual (aprobada)

**Editorial Minimal + Verde heritage.** Layout limpio con mucho aire y foto protagonista; el verde de marca es el acento protagonista (botones, marca, eyebrows). Negro `#111` para titulares, sentence-case, tipografía sans grande con tracking ajustado.

El usuario tanteó "Verde Premium" antes de elegir "Editorial Minimal" → la fusión (estructura editorial + identidad verde) es intencional, no un compromiso.

### Design tokens (`globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#111111` | Texto / titulares |
| `--ink-soft` | `#52525b` | Cuerpo secundario |
| `--brand` | `#3f5840` | Acento protagonista (reemplaza `#4a5d4a`) |
| `--brand-hover` | `#324530` | Hover de acento |
| `--brand-tint` | `#eef2ec` | Washes suaves / fondos de eyebrow |
| `--surface` | `#fafafa` | Secciones alternas sutiles |
| `--line` | `#ececec` | Bordes hairline |
| WhatsApp | `#25D366` | Solo botones de WhatsApp |

**Cambio estructural clave:** se elimina la alternancia pesada de fondos gris zinc. Las secciones se separan con **aire + líneas finas**, no con bloques de color.

### Tipografía

Geist Sans (ya cargada). Titulares grandes, sentence-case, en `--ink`, tracking `-0.02em`, peso 700–800, con un **eyebrow** chico arriba (uppercase, tracked `.18em`, en `--brand`). Se elimina el patrón de títulos en MAYÚSCULA verdes. Escala tipográfica fluida con `clamp()`.

### Componentes base

- **Botones:** primario (verde sólido), secundario (outline ink), WhatsApp (pill verde-WA). Radios y tamaños consistentes en toda la app.
- **Product Card:** imagen protagonista (aspect 3/4), nombre **siempre visible** debajo en negro (se elimina el efecto de título que sube con "glow"), muestras de color prolijas, zoom sutil de la foto en hover.
- **Eyebrow / kicker:** componente reutilizable.

## Alcance por fases

### Fase 1 — Design system + restyle global

- **`globals.css`:** nuevos tokens (tabla de arriba), utilidad de eyebrow, escala tipográfica fluida.
- **Header (`Header.tsx` + `NavLinks.tsx`):** hoy es barra verde sólida con nav pegada a la derecha y **sin logo**. Nuevo: header claro (paper), **logo "los álamos." a la izquierda**, nav + Categorías + WhatsApp a la derecha, hairline inferior, sticky. Restyle de dropdowns (categorías / redes) al sistema editorial.
- **Hero (`page.tsx` + `HeroLogo` / `HeroVideo`):** split editorial — eyebrow verde, titular grande sentence-case, subtítulo, dos botones (Ver catálogo / Pedir cotización) y foto/video con tratamiento más liviano (sin overlay negro al 50%).
- **Secciones de home** (destacados, "por qué elegirnos", "cómo trabajamos", testimonios, marcas, CTA cotización, footer): aplicar tokens, quitar alternancia de grises zinc, eyebrows, ritmo de espaciado consistente (`py-24`+), botones unificados.
- **`ProductCard`:** nombre siempre visible en negro, zoom sutil, muestras de color prolijas.

**Entregable:** la home y los componentes globales con el nuevo sistema visual, sin cambios de estructura de datos.

### Fase 2 — Catálogo + producto + conversión

- **Catálogo (`/productos`):** hoy **no hay filtro visible en la página** (solo dropdown del header / URL `?categoria=`). Agregar **barra de categorías (pills)** visible y accesible, contador de resultados y empty state cuidado. Grid editorial. Mantener el filtrado server-side por `searchParams` ya existente.
- **Producto (`ProductDetail` + `producto/[slug]/page.tsx`):** restyle editorial — título en negro (no MAYÚSCULA verde), mejor jerarquía de descripción / características / uso recomendado, breadcrumb. **CTA "Consultar por WhatsApp" sticky en mobile.** Se conservan las variantes de color, badges de disponibilidad (`disponible` / `sin_stock` / `proximamente`), galería y ficha técnica que ya funcionan.
- **Cotización (`/cotizacion`):** restyle del formulario al nuevo sistema; reforzarlo como conversión principal. (Sin cambios en `/api/cotizacion`.)
- **Conversión global:** "Pedir cotización" + WhatsApp presentes y claros en la navegación.

**Entregable:** catálogo navegable con filtros visibles y página de producto editorial orientada a conversión.

### Fase 3 — Performance, SEO, accesibilidad

- **Performance:** quitar `unoptimized` de `ProductCard` (activa la optimización de Next/Image); agregar el dominio de Directus de producción (`admin.losalamosindumentaria.com.ar`, `/assets/**`) a `remotePatterns` en `next.config.ts`; revisar `sizes`.
- **SEO:** enriquecer metadata — OG images por producto, metadata por categoría en `/productos`; JSON-LD de producto (opcional/nice-to-have).
- **A11y:** orden correcto de headings, contraste verificado con la nueva paleta, foco visible consistente, y **arreglar los links de Instagram/LinkedIn del footer en `page.tsx` que apuntan a `#`** (deben usar `NEXT_PUBLIC_INSTAGRAM_URL` / `NEXT_PUBLIC_LINKEDIN_URL` como ya hace el Header).

**Entregable:** sitio optimizado en carga de imágenes, indexable y accesible.

## No incluido (YAGNI)

- Checkout / pagos (fuera del modelo de negocio).
- Modo oscuro (las clases `dark:` existen sin uso; no se activan).
- Migración de tipografía a otra fuente (Geist alcanza para editorial).
- Cambios en el backend Directus, el schema o las rutas de API.
- Carga de testimonios/marcas desde CMS (siguen hardcodeados; se puede evaluar a futuro).

## Riesgos / notas

- El restyle global toca muchos componentes; hacerlo dirigido por los tokens de `globals.css` minimiza divergencias.
- Activar la optimización de imágenes de Next requiere que `remotePatterns` incluya el dominio real de Directus, o las imágenes romperán en producción — validar en Fase 3 antes de quitar `unoptimized`.
- Mantener la accesibilidad ya presente (skip-link, `prefers-reduced-motion`, focus states) durante el restyle.
