"use client";

import { useRef, useEffect } from "react";

/**
 * Video de fondo del hero.
 * - aria-label para lectores de pantalla
 * - poster: agregá hero-poster.jpg en public y descomentá la prop abajo para una imagen mientras carga
 * - Con prefers-reduced-motion el video no se reproduce (queda pausado)
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = videoRef.current;
    if (video) {
      if (mq.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }
    const handler = () => {
      if (videoRef.current) {
        if (mq.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {});
        }
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover"
      aria-label="Video de fondo: indumentaria laboral Los Álamos"
      // poster="/hero-poster.jpg"
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>
  );
}
