# Contexto del proyecto: Catálogo (sin pagos) con Next.js + Directus

## Objetivo
Construir un sitio tipo "e-commerce catálogo" (sin checkout, sin pasarela de pagos).
Los usuarios navegan productos/categorías y contactan por WhatsApp.
El cliente cargará productos, imágenes y categorías desde un CMS.

## Arquitectura
- Frontend: Next.js (App Router) desplegado en Vercel.
- CMS/Backend: Directus auto-hosteado en una VPS (Hostinger) detrás de Nginx + SSL.
- DB: PostgreSQL en la misma VPS.
- Imágenes: almacenadas en el servidor (uploads de Directus) y servidas por Directus/Nginx.
- El frontend consume la API pública de Directus (solo lectura).

## Entorno local actual
- Directus + PostgreSQL corriendo con Docker Compose.
- Directus expuesto en: http://localhost:8055
- Next.js correrá aparte en: http://localhost:3000
- Variable env para frontend:
  - NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055

## Modelo de datos en Directus
Colecciones:
1) categories
- id (auto)
- name (string, required)
- slug (string, unique, required)
- sort_order (int, default 0)
- products (O2M a products vía foreign key products.category)

2) products
- id (auto)
- name (string, required)
- slug (string, unique, required)
- description (text)
- price (decimal, opcional)
- is_active (boolean toggle, default true)
- sort_order (int, default 0)
- category (M2O a categories)
- images (M2M a directus_files; en API se obtiene como tabla intermedia)
- caracteristicas (text, opcional): una característica por línea; en el frontend se muestra como lista con viñetas.
- uso_recomendado (text o WYSIWYG, opcional): párrafo de uso recomendado.
- ficha_tecnica (file, opcional): archivo único (PDF) para botón "Ficha técnica".

Relación inversa:
- categories.products (O2M) apunta al campo products.category

## Permisos (muy importante)
Rol Public:
- SOLO READ en:
  - categories
  - products
  - directus_files
  - products_directus_files (tabla intermedia M2M)
NO permitir create/update/delete/share al público.

## Consultas API que usamos
- Productos con categoría e info del archivo expandida:
  GET /items/products?filter[is_active][_eq]=true&sort=sort_order,-id&fields=*,category.*,images.directus_files_id.*
Ejemplo local:
http://localhost:8055/items/products?fields=*,category.*,images.directus_files_id.*

- Imagen:
Directus sirve assets en:
GET /assets/<file_uuid>
Ejemplo:
http://localhost:8055/assets/660fa1dc-c947-4a8e-9557-e5e0fdafa670

## Requerimientos del frontend
- Listado de productos con imagen principal (primera de images).
- Página detalle por slug.
- Filtros simples por categoría (opcional).
- Botón “Consultar por WhatsApp” por producto con mensaje prellenado.
- SEO básico (metadata por producto/categoría, sitemap si se puede).

## Next.js - configuración de imágenes
En next.config (o next.config.mjs) permitir remotePatterns:
- protocol: http
- hostname: localhost
- port: 8055
- pathname: /assets/**

## Notas de implementación
- El frontend debe manejar que `images` puede venir vacío.
- En el JSON, `images` tiene forma:
  images: [{ directus_files_id: { id, title, filename_download, width, height, ... } }]
- Evitar hardcodear URLs: usar NEXT_PUBLIC_DIRECTUS_URL.
