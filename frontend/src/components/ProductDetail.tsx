"use client";

import { useState } from "react";
import type { Product, ProductColorVariant, Color } from "@/types/directus";
import { getProductImageIds, getVariantImageIds, getFichaTecnicaUrl } from "@/lib/directus";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { ProductGallery } from "./ProductGallery";

interface ProductDetailProps {
  product: Product;
}

function resolveColor(variant: ProductColorVariant): Color | null {
  if (typeof variant.color === "object" && variant.color !== null) return variant.color;
  return null;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const variants = product.color_variants ?? [];
  const hasVariants = variants.length > 0;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVariant = hasVariants ? variants[selectedIndex] : null;
  const selectedColor = selectedVariant ? resolveColor(selectedVariant) : null;

  const imageIds = hasVariants && selectedVariant
    ? getVariantImageIds(selectedVariant)
    : getProductImageIds(product);

  const fallbackImageIds = getProductImageIds(product);
  const displayImageIds = imageIds.length > 0 ? imageIds : fallbackImageIds;

  const price =
    product.price != null
      ? typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price))
      : null;

  const category =
    product.category && typeof product.category === "object" ? product.category : null;

  const fichaTecnicaUrl = getFichaTecnicaUrl(product);

  const caracteristicasList =
    product.caracteristicas
      ?.split("\n")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const disponibilidad = selectedVariant?.disponibilidad ?? "disponible";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div className="w-full max-w-3xl">
        <ProductGallery imageIds={displayImageIds} productName={product.name} />
      </div>

      <div className="lg:sticky lg:top-24">
        {category && (
          <p className="text-base text-zinc-500">{category.name}</p>
        )}
        <h1 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl">
          {product.name}
        </h1>

        {hasVariants && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-zinc-700">
              Color: <span className="font-semibold">{selectedColor?.name ?? "—"}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant, idx) => {
                const color = resolveColor(variant);
                if (!color) return null;
                const isSelected = idx === selectedIndex;
                const outOfStock = variant.disponibilidad === "sin_stock";

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative h-9 w-9 cursor-pointer rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
                        : "border-zinc-300 hover:border-zinc-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`${color.name}${outOfStock ? " (sin stock)" : ""}`}
                    title={`${color.name}${outOfStock ? " — sin stock" : ""}`}
                  >
                    {outOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
                        <span className="block h-[2px] w-full rotate-45 bg-zinc-500/80 rounded" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {disponibilidad === "sin_stock" && (
              <p className="mt-2 text-sm font-medium text-red-600">Sin stock en este color</p>
            )}
            {disponibilidad === "proximamente" && (
              <p className="mt-2 text-sm font-medium text-amber-600">Próximamente disponible</p>
            )}
          </div>
        )}

        {fichaTecnicaUrl && (
          <a
            href={fichaTecnicaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-hover)]"
          >
            Ficha técnica
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        )}

        {product.description && (
          <div className="mt-6">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[var(--brand)]">Descripción</h2>
            <div
              className="mt-2 text-lg text-zinc-600 [&>p]:mb-2"
              dangerouslySetInnerHTML={{ __html: String(product.description).replace(/\n/g, "<br />") }}
            />
          </div>
        )}

        {caracteristicasList.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[var(--brand)]">Características</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-lg text-zinc-600">
              {caracteristicasList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {product.uso_recomendado && (
          <div className="mt-6">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[var(--brand)]">Uso recomendado</h2>
            <p className="mt-2 text-lg text-zinc-600">{product.uso_recomendado}</p>
          </div>
        )}

        {price != null && !Number.isNaN(price) && (
          <p className="mt-6 text-xl font-medium text-[var(--brand)]">
            ${price.toLocaleString("es-AR")}
          </p>
        )}

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
