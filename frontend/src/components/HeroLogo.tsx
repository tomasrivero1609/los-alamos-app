import Image from "next/image";

/**
 * Imagen de fondo del hero (logo grande). Ocupa todo el ancho y alto del hero.
 */
export function HeroLogo() {
  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden>
      <Image
        src="/logo-los-alamos.jpeg"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority
      />
    </div>
  );
}
