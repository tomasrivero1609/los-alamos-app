"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Product } from "@/types/directus";
import { assetUrl, getFirstImageId } from "@/lib/directus";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageId = getFirstImageId(product);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const imageClass = reduceMotion
    ? "object-cover object-center"
    : "object-cover object-center transition duration-300 group-hover:scale-105";

  const titleClass = reduceMotion
    ? "card-title-glow font-semibold text-white"
    : "card-title-glow translate-y-full font-semibold text-white opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100";

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/producto/${product.slug}`}
        className="relative block aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-inset"
        aria-label={`Ver producto: ${product.name}`}
      >
        {imageId ? (
          <span className="absolute inset-0 block size-full">
            <Image
              src={assetUrl(imageId)}
              alt={product.name}
              fill
              className={imageClass}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          </span>
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-t from-black/80 to-transparent pt-12 pb-3 px-4">
          <h2 className={titleClass}>
            {product.name}
          </h2>
        </div>
      </Link>
    </article>
  );
}
