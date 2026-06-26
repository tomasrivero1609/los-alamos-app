"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { assetUrl, assetsAreLocal } from "@/lib/directus";

interface ProductGalleryProps {
  imageIds: string[];
  productName: string;
}

export function ProductGallery({ imageIds, productName }: ProductGalleryProps) {
  const n = imageIds.length;
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const reduce = useReducedMotion();

  const open = (i: number) => {
    setDir(0);
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => {
    setDir(1);
    setIndex((i) => (i === null ? i : (i + 1) % n));
  }, [n]);
  const prev = useCallback(() => {
    setDir(-1);
    setIndex((i) => (i === null ? i : (i - 1 + n) % n));
  }, [n]);
  const goTo = (j: number) => {
    setDir(index !== null && j > index ? 1 : -1);
    setIndex(j);
  };

  // Teclado (Esc / ← / →) + bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, next, prev]);

  if (n === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-surface text-ink-soft">
        Sin imágenes
      </div>
    );
  }

  const variants = {
    enter: (d: number) => ({ x: reduce ? 0 : d > 0 ? 340 : -340, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduce ? 0 : d > 0 ? -340 : 340, opacity: 0 }),
  };

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    const power = Math.abs(info.offset.x) * info.velocity.x;
    if (power < -8000 || info.offset.x < -100) next();
    else if (power > 8000 || info.offset.x > 100) prev();
  };

  return (
    <>
      {/* Grilla de miniaturas */}
      <div className="grid w-full grid-cols-2 gap-3">
        {imageIds.map((id, i) => (
          <button
            key={id}
            type="button"
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand"
            onClick={() => open(i)}
            aria-label={`Ampliar imagen ${i + 1} de ${n}`}
          >
            <Image
              src={assetUrl(id)}
              alt={`${productName} - imagen ${i + 1}`}
              fill
              className="object-cover object-center transition hover:opacity-90"
              sizes="(max-width: 640px) 50vw, 45vw"
              unoptimized={assetsAreLocal()}
            />
          </button>
        ))}
      </div>

      {/* Lightbox / carrusel */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 select-none"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} — imagen ${index + 1} de ${n}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* Contador */}
            {n > 1 && (
              <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/90">
                {index + 1} / {n}
              </div>
            )}

            {/* Cerrar */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Imagen (con swipe/drag) */}
            <div className="flex h-full w-full items-center justify-center px-4">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img
                  key={index}
                  src={assetUrl(imageIds[index])}
                  alt={`${productName} - imagen ${index + 1}`}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.15 } }}
                  drag={n > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={onDragEnd}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[88vh] w-auto max-w-[92vw] cursor-grab object-contain active:cursor-grabbing"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Flechas (solo si hay más de una) */}
            {n > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
                  aria-label="Imagen anterior"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
                  aria-label="Imagen siguiente"
                >
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Puntitos */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {imageIds.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); goTo(i); }}
                      className={`h-2 w-2 rounded-full transition ${i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                      aria-label={`Ir a la imagen ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
