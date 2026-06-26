"use client";

import { useState, useEffect } from "react";
import type { Product, ProductColorVariant, Color } from "@/types/directus";
import { getProductImageIds, getVariantImageIds, getFichaTecnicaUrl, getTablaTallesUrl } from "@/lib/directus";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { ProductGallery } from "./ProductGallery";
import { Button } from "@/components/ui/Button";
import { TablaMedidas, type MedidaFila } from "./TablaMedidas";

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
  const [tablaOpen, setTablaOpen] = useState(false);

  useEffect(() => {
    if (!tablaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTablaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tablaOpen]);

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
  const tablaTallesUrl = getTablaTallesUrl(product);
  const talles = Array.isArray(product.talles) ? product.talles.filter(Boolean) : [];
  const medidas: MedidaFila[] | null =
    Array.isArray(product.tabla_medidas) && product.tabla_medidas.length > 0
      ? product.tabla_medidas
      : null;

  const caracteristicasList =
    product.caracteristicas
      ?.split("\n")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const disponibilidad = selectedVariant?.disponibilidad ?? "disponible";

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="w-full min-w-0 max-w-3xl">
        <ProductGallery imageIds={displayImageIds} productName={product.name} />
      </div>

      <div className="min-w-0 lg:sticky lg:top-24">
        {category && (
          <p className="text-sm text-ink-soft">{category.name}</p>
        )}
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {product.name}
        </h1>

        {fichaTecnicaUrl && (
          <a
            href={fichaTecnicaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            Ficha técnica
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        )}

        {product.description && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Descripción</h2>
            <div
              className="mt-2 text-base text-ink-soft [&>p]:mb-2"
              dangerouslySetInnerHTML={{ __html: String(product.description).replace(/\n/g, "<br />") }}
            />
          </div>
        )}

        {caracteristicasList.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Características</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base text-ink-soft">
              {caracteristicasList.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {product.uso_recomendado && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Uso recomendado</h2>
            <p className="mt-2 text-base text-ink-soft">{product.uso_recomendado}</p>
          </div>
        )}

        {talles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Talles</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {talles.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-md border border-line px-2.5 py-1 text-sm font-medium text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {((medidas && talles.length > 0) || tablaTallesUrl) && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Tabla de talles</h2>
            {medidas && talles.length > 0 && (
              <div className="mt-2">
                <TablaMedidas talles={talles} filas={medidas} />
                <p className="mt-1.5 text-xs text-ink-soft">Medidas en centímetros.</p>
              </div>
            )}
            {!(medidas && talles.length > 0) && tablaTallesUrl && (
              <>
                <button
                  type="button"
                  onClick={() => setTablaOpen(true)}
                  className="mt-2 block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  aria-label="Ampliar la tabla de talles"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- tabla de talles: imagen de ancho variable */}
                  <img
                    src={tablaTallesUrl}
                    alt={`Tabla de talles — ${product.name}`}
                    className="w-full"
                  />
                </button>
                <p className="mt-1 text-xs text-ink-soft">Tocá la imagen para ampliarla.</p>
              </>
            )}
          </div>
        )}

        {hasVariants && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink">
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
                    className={`relative h-9 w-9 cursor-pointer rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                      isSelected
                        ? "border-ink ring-1 ring-ink"
                        : "border-line hover:border-ink"
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

        {price != null && !Number.isNaN(price) && (
          <p className="mt-6 text-xl font-semibold text-ink">
            ${price.toLocaleString("es-AR")}
          </p>
        )}

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

      {/* Lightbox de la tabla de talles */}
      {tablaOpen && tablaTallesUrl && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 focus:outline-none"
          onClick={() => setTablaOpen(false)}
          aria-label="Cerrar tabla de talles"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tabla en lightbox */}
          <img
            src={tablaTallesUrl}
            alt={`Tabla de talles — ${product.name}`}
            className="max-h-[90vh] w-auto max-w-[95vw] object-contain"
          />
        </button>
      )}

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
