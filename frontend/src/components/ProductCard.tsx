import Image from "next/image";
import Link from "next/link";
import type { Product, Color } from "@/types/directus";
import { assetUrl, getFirstImageId, assetsAreLocal } from "@/lib/directus";

interface ProductCardProps {
  product: Product;
}

const MAX_VISIBLE_COLORS = 5;

function getColors(product: Product): Color[] {
  const variants = product.color_variants;
  if (!Array.isArray(variants)) return [];
  const colors: Color[] = [];
  for (const v of variants) {
    if (typeof v.color === "object" && v.color !== null) colors.push(v.color);
  }
  return colors;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageId = getFirstImageId(product);
  const colors = getColors(product);

  return (
    <article className="group flex flex-col">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        aria-label={`Ver producto: ${product.name}`}
      >
        {imageId ? (
          <Image
            src={assetUrl(imageId)}
            alt={product.name}
            fill
            className="object-cover object-center transition duration-300 motion-safe:group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={assetsAreLocal()}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">
            Sin imagen
          </div>
        )}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{product.name}</h2>
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {colors.slice(0, MAX_VISIBLE_COLORS).map((c) => (
              <span
                key={c.id}
                className="block h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: c.hex }}
                title={c.name}
                aria-label={c.name}
              />
            ))}
            {colors.length > MAX_VISIBLE_COLORS && (
              <span className="text-xs text-ink-soft">+{colors.length - MAX_VISIBLE_COLORS}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
