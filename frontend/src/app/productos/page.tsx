import type { Metadata } from "next";
import { fetchCategories, fetchProducts } from "@/lib/directus";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface ProductosProps {
  searchParams: Promise<{ categoria?: string }>;
}

export async function generateMetadata({ searchParams }: ProductosProps): Promise<Metadata> {
  const { categoria } = await searchParams;
  if (categoria) {
    const categories = await fetchCategories();
    const name = categories.find((c) => c.slug === categoria)?.name ?? categoria;
    return {
      title: name,
      description: `Indumentaria laboral — ${name}. Mirá el catálogo de Los Álamos y consultá por WhatsApp.`,
    };
  }
  return {
    title: "Catálogo",
    description: "Catálogo completo de indumentaria laboral de Los Álamos. Consultá por WhatsApp.",
  };
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
