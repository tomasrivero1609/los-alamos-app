"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";

const SLIDE_WIDTH = 360;
const SLIDE_HEIGHT = 380;
const GAP = 20;
const SPEED = 0.6; // px por frame

interface IndumentariaCarouselProps {
  images: { src: string; alt: string }[];
}

function getSetWidth(count: number) {
  return count * SLIDE_WIDTH + (count - 1) * GAP;
}

export function IndumentariaCarousel({ images }: IndumentariaCarouselProps) {
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
    if (images.length === 0) return;
    setWidth.current = getSetWidth(images.length);

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
  }, [images.length, applyTransform]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (images.length === 0) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      paused.current = true;
      dragStartX.current = e.clientX;
      dragStartTranslate.current = translateX.current;
    },
    [images.length]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!paused.current || images.length === 0) return;
      let x = dragStartTranslate.current + (dragStartX.current - e.clientX);
      const sw = setWidth.current;
      while (x > 0) x -= sw;
      while (x < -sw) x += sw;
      translateX.current = x;
      applyTransform(x);
    },
    [images.length, applyTransform]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      paused.current = false;
    },
    []
  );

  if (images.length === 0) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        Agregá fotos en la configuración del carrusel.
      </div>
    );
  }

  // Tres copias para que la banda se vea larga de punta a punta y el loop sea fluido
  const duplicated = [...images, ...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label="Carrusel de fotos de indumentaria — se desplaza solo; arrastrá para explorar"
    >
      <div
        ref={trackRef}
        className="flex cursor-grab active:cursor-grabbing touch-pan-x select-none gap-5 py-2 will-change-transform"
        style={{ width: "max-content" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        {duplicated.map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden rounded-lg bg-zinc-100 shadow-md"
            style={{ width: SLIDE_WIDTH, height: SLIDE_HEIGHT }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={SLIDE_WIDTH}
              height={SLIDE_HEIGHT}
              className="pointer-events-none select-none object-cover"
              sizes={`${SLIDE_WIDTH}px`}
              unoptimized
              draggable={false}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
