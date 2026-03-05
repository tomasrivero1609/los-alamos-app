import { fetchCategories, fetchProducts } from "@/lib/directus";
import { ProductCard } from "@/components/ProductCard";

interface ProductosProps {
  searchParams: Promise<{ categoria?: string }>;
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
  const title = categoryName ? categoryName.toUpperCase() : "Productos";

  return (
    <main className="mx-auto max-w-6xl px-4 pt-16 pb-12">
      <h1 className="mb-12 text-center text-4xl font-normal tracking-tight text-[var(--brand)] sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {products.length === 0 ? (
        <p className="text-center text-zinc-600">
          No hay productos para mostrar. Revisa que Directus esté corriendo y que existan productos activos.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
