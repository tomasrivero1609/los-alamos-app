import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/directus";
import { ProductDetail } from "@/components/ProductDetail";
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

  return (
    <main className="mx-auto max-w-7xl px-4 pt-16 pb-8">
      <Link
        href="/productos"
        className="mb-6 inline-block text-base text-zinc-600 hover:underline"
      >
        ← Volver al catálogo
      </Link>

      <ProductDetail product={product} />
    </main>
  );
}
