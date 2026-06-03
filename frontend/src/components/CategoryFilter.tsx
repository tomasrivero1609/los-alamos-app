import Link from "next/link";
import type { Category } from "@/types/directus";

interface CategoryFilterProps {
  categories: Category[];
  /** slug de la categoría activa, o null para "Todos" */
  active: string | null;
}

const base =
  "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";
const activeCls = "border-brand bg-brand text-white";
const idleCls = "border-line text-ink-soft hover:border-ink hover:text-ink";

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="flex flex-wrap justify-center gap-2" aria-label="Filtrar por categoría">
      <Link href="/productos" className={`${base} ${active === null ? activeCls : idleCls}`}>
        Todos
      </Link>
      {categories.map((cat) => {
        const isActive = active === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/productos?categoria=${cat.slug}`}
            className={`${base} ${isActive ? activeCls : idleCls}`}
            aria-current={isActive ? "page" : undefined}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
