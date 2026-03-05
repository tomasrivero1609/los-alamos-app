import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug, getProductImageIds, getFichaTecnicaUrl } from "@/lib/directus";
import { whatsappProductUrl } from "@/lib/whatsapp";
import { ProductGallery } from "@/components/ProductGallery";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  const description = product.description
    ? String(product.description).slice(0, 160)
    : `Producto: ${product.name}`;
  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
    },
  };
}

export default async function ProductoPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const imageIds = getProductImageIds(product);
  const price =
    product.price != null
      ? typeof product.price === "number"
        ? product.price
        : parseFloat(String(product.price))
      : null;
  const category = product.category && typeof product.category === "object" ? product.category : null;
  const fichaTecnicaUrl = getFichaTecnicaUrl(product);
  const caracteristicasList =
    product.caracteristicas
      ?.split("\n")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 pt-16 pb-8">
      <Link
        href="/productos"
        className="mb-6 inline-block text-base text-zinc-600 hover:underline"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* Galería a la izquierda, no ocupa todo el ancho para quedar más pegada a la izquierda */}
        <div className="w-full max-w-3xl">
          <ProductGallery imageIds={imageIds} productName={product.name} />
        </div>

        {/* Columna derecha: título, ficha, descripción, características, uso recomendado, WhatsApp */}
        <div className="lg:sticky lg:top-24">
          {category && (
            <p className="text-base text-zinc-500">{category.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl">
            {product.name}
          </h1>

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
            href={whatsappProductUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition hover:bg-[#20BD5A]"
          >
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
