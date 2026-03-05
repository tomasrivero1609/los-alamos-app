"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";

const SLIDE_WIDTH = 180;
const SLIDE_HEIGHT = 90;
const GAP = 32;
const SPEED = 0.4;

export interface MarcaItem {
  src: string;
  alt: string;
  /** Opcional: si se define, el logo es un enlace */
  href?: string;
}

interface MarcasCarouselProps {
  items: MarcaItem[];
}

function getSetWidth(count: number) {
  return count * SLIDE_WIDTH + (count - 1) * GAP;
}

export function MarcasCarousel({ items }: MarcasCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const translateX = useRef(0);
  const paused = useRef(false);
  const dragStartX = useRef(0);
  const dragStartTranslate = useRef(0);
  const setWidth = useRef(0);
  const rafId = useRef<number>(0);
  const reduceMotion = useRef(false);

  const applyTransform = useCallback((x: number) => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mq.matches;
    const handler = () => {
      reduceMotion.current = mq.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    setWidth.current = getSetWidth(items.length);

    const tick = () => {
      if (!paused.current && !reduceMotion.current) {
        translateX.current -= SPEED;
        if (translateX.current <= -setWidth.current) {
          translateX.current += setWidth.current;
        }
        applyTransform(translateX.current);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [items.length, applyTransform]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (items.length === 0) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      paused.current = true;
      dragStartX.current = e.clientX;
      dragStartTranslate.current = translateX.current;
    },
    [items.length]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!paused.current || items.length === 0) return;
      let x = dragStartTranslate.current + (dragStartX.current - e.clientX);
      const sw = setWidth.current;
      while (x > 0) x -= sw;
      while (x < -sw) x += sw;
      translateX.current = x;
      applyTransform(x);
    },
    [items.length, applyTransform]
  );

  const handlePointerUp = useCallback(() => {
    paused.current = false;
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex h-28 w-full items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        Agregá logos en <code className="mx-1 rounded bg-zinc-200 px-1.5 py-0.5 text-sm">public/marcas/</code> y referenciálos en la página.
      </div>
    );
  }

  const duplicated = [...items, ...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label="Marcas que confían en nosotros — carrusel de logos"
    >
      <div
        ref={trackRef}
        className="flex cursor-grab active:cursor-grabbing touch-pan-x select-none gap-8 py-4 will-change-transform"
        style={{ width: "max-content" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {duplicated.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200/80 bg-white px-4 py-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
            style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
          >
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full w-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 rounded"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={SLIDE_WIDTH - 24}
                  height={SLIDE_HEIGHT - 24}
                  className="max-h-full w-auto object-contain"
                  sizes={`${SLIDE_WIDTH}px`}
                  unoptimized
                  draggable={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </a>
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                width={SLIDE_WIDTH - 24}
                height={SLIDE_HEIGHT - 24}
                className="max-h-full w-auto object-contain"
                sizes={`${SLIDE_WIDTH}px`}
                unoptimized
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
