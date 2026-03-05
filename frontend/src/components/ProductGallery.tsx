"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { assetUrl } from "@/lib/directus";

// eslint-disable-next-line @next/next/no-img-element -- lightbox: tamaño natural
const LightboxImg = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="max-h-[90vh] w-auto max-w-[90vw] object-contain" />
);

interface ProductGalleryProps {
  imageIds: string[];
  productName: string;
}

export function ProductGallery({ imageIds, productName }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
    };
    if (lightboxIndex !== null) {
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [lightboxIndex]);

  if (imageIds.length === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
        Sin imágenes
      </div>
    );
  }

  return (
    <>
      {/* 2x2: cada imagen llena toda la card (sin espacios en blanco) */}
      <div className="grid w-full grid-cols-2 gap-3">
        {imageIds.map((id, index) => (
          <button
            key={id}
            type="button"
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={assetUrl(id)}
              alt={`${productName} - imagen ${index + 1}`}
              fill
              className="object-cover object-center transition hover:opacity-90"
              sizes="(max-width: 640px) 50vw, 45vw"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Lightbox: click para ver en detalle */}
      {lightboxIndex !== null && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 focus:outline-none"
          onClick={() => setLightboxIndex(null)}
          aria-label="Cerrar"
        >
          <span onClick={(e) => e.stopPropagation()}>
            <LightboxImg
              src={assetUrl(imageIds[lightboxIndex])}
              alt={`${productName} - imagen ${lightboxIndex + 1}`}
            />
          </span>
        </button>
      )}
    </>
  );
}
