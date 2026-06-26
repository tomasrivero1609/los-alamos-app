"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from "framer-motion";

const SLIDE_WIDTH = 360;
const SLIDE_HEIGHT = 380;
const GAP = 20;
const SPEED = 42; // px por segundo (independiente del frame-rate)

interface IndumentariaCarouselProps {
  images: { src: string; alt: string }[];
}

export function IndumentariaCarousel({ images }: IndumentariaCarouselProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const dragging = useRef(false);
  const pause = useRef(0); // segundos a saltar el auto-scroll (deja correr la inercia tras soltar)

  const n = images.length;
  // ancho de un set completo (incluye el gap entre copias para que el loop sea seamless)
  const setWidth = n > 0 ? n * (SLIDE_WIDTH + GAP) : 0;

  useAnimationFrame((_t, delta) => {
    if (n === 0 || reduce || setWidth === 0) return;
    const dt = delta / 1000;
    if (dragging.current) return;
    if (pause.current > 0) {
      pause.current -= dt;
      return;
    }
    let v = x.get() - SPEED * dt;
    while (v <= -setWidth) v += setWidth;
    while (v > 0) v -= setWidth;
    x.set(v);
  });

  if (n === 0) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-xl bg-surface text-ink-soft">
        Agregá fotos en la configuración del carrusel.
      </div>
    );
  }

  // Tres copias para que la banda se vea larga y el loop sea fluido
  const duplicated = [...images, ...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label="Carrusel de fotos de indumentaria — se desplaza solo; arrastrá para explorar"
    >
      <motion.div
        className="flex w-max cursor-grab select-none gap-5 py-2 active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -setWidth * 2, right: 0 }}
        dragElastic={0.08}
        onDragStart={() => {
          dragging.current = true;
        }}
        onDragEnd={() => {
          dragging.current = false;
          pause.current = 0.7; // deja que la inercia de framer-motion termine antes de retomar
        }}
      >
        {duplicated.map((img, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden rounded-lg bg-surface shadow-md"
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
      </motion.div>
    </div>
  );
}
