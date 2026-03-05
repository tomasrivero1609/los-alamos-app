"use client";

const phrases = [
  "Calidad que se nota en cada costura.",
  "Ropa pensada para el trabajo de todos los días.",
  "Equipá a tu equipo con lo mejor.",
  "Indumentaria laboral para invierno y verano.",
  "Durabilidad y confort en una sola prenda.",
];

export function TextCarousel() {
  const repeated = [...phrases, ...phrases];

  return (
    <section
      id="carousel"
      className="relative w-full overflow-hidden bg-[var(--brand)] py-2.5"
      aria-label="Mensajes destacados"
    >
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-xs font-normal text-white/85 tracking-wide sm:text-sm"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
}
