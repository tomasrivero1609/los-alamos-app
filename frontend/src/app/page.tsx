import Image from "next/image";
import Link from "next/link";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { fetchFeaturedProducts } from "@/lib/directus";
import { TextCarousel } from "@/components/TextCarousel";
import { ProductCard } from "@/components/ProductCard";
import { IndumentariaCarousel } from "@/components/IndumentariaCarousel";
import { MarcasCarousel } from "@/components/MarcasCarousel";
import { HeroTypewriter } from "@/components/HeroTypewriter";
import { HeroVideo } from "@/components/HeroVideo";
import { TestimoniosSection } from "@/components/TestimoniosSection";

/** Testimonios: editá texto, autor y role en page.tsx (o después cargarlos desde CMS) */
const TESTIMONIOS = [
  {
    quote: "Hacemos pedidos de uniformes dos veces al año. La calidad es consistente y la atención por WhatsApp es muy rápida.",
    author: "María G.",
    role: "Logística, empresa de servicios",
  },
  {
    quote: "Necesitábamos talles especiales y nos asesoraron bien. Los buzos llegaron en tiempo y la gente los usa todos los días.",
    author: "Pablo R.",
    role: "Compras, construcción",
  },
  {
    quote: "Buen precio y buena tela. Ya llevamos tres años comprando en Los Álamos para todo el equipo.",
    author: "Laura S.",
    role: "Gerencia, transporte",
  },
];

/** Logos de marcas: colocá las imágenes en public/marcas/ y referenciálas aquí (ej. /marcas/logo-1.png) */
const MARCAS_CAROUSEL_ITEMS = [
  { src: "/marcas/logo-1.png", alt: "Marca 1" },
  { src: "/marcas/logo-2.png", alt: "Marca 2" },
  { src: "/marcas/logo-3.png", alt: "Marca 3" },
  { src: "/marcas/logo-4.png", alt: "Marca 4" },
  { src: "/marcas/logo-5.png", alt: "Marca 5" },
];

export default async function Home() {
  const featuredProducts = await fetchFeaturedProducts(6);
  return (
    <main className="min-h-screen">
      {/* Hero: video de fondo + Bienvenidos a Los Álamos */}
      <section id="hero" className="relative min-h-screen overflow-hidden">
        {/* Video de fondo — subí tu archivo a public/hero-video.mp4 o reemplazá la ruta */}
        <HeroVideo />
        {/* Overlay oscuro para que se lea el texto */}
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
            Bienvenidos a Los Álamos
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 drop-shadow">
            Indumentaria laboral para tu equipo
          </p>
          <HeroTypewriter />
          <Link
            href="/productos"
            className="mt-8 inline-block cursor-pointer rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
          >
            Ver indumentaria
          </Link>
        </div>
      </section>

      {/* Carrusel de texto — mensajes sobre la ropa */}
      <TextCarousel />

      {/* Nuestros productos destacados */}
      <section id="productos-destacados" className="border-b border-zinc-200 bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
            Nuestros productos destacados
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-base text-zinc-600 sm:text-lg">
            Una selección de lo mejor de nuestra línea de indumentaria laboral.
          </p>
          {featuredProducts.length > 0 ? (
            <ul className="mt-12 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <li key={product.id} className="w-full max-w-[260px]">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 text-center text-base text-zinc-500">
              Pronto agregaremos productos destacados. Revisá el catálogo completo en Indumentaria.
            </p>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/productos"
              className="inline-block rounded-lg bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-hover)]"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? — Opción A: foto + título fuerte + beneficios en mini-cards */}
      <section id="por-que-elegirnos" className="border-b border-zinc-200 bg-zinc-50 px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-16">
          {/* Foto a la izquierda — reemplazá por tu imagen (public/por-que-elegirnos.jpg o .jpeg) */}
          <div className="relative w-full flex-1 overflow-hidden rounded-2xl shadow-md lg:max-w-md">
            <div className="relative aspect-[4/5]">
              <Image
                src="/por-que-elegirnos.jpeg"
                alt="Los Álamos — indumentaria laboral de calidad"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
          {/* Texto y beneficios a la derecha */}
          <div className="flex flex-1 flex-col justify-center lg:max-w-xl">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-5 text-base text-zinc-600 sm:text-lg">
              En Los Álamos nos especializamos en indumentaria laboral que combine resistencia, confort y precios accesibles. Trabajamos con empresas de todo el país para equipar a sus equipos con ropa que rinda en el día a día.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--brand)]" aria-hidden>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Calidad durable</h3>
                  <p className="mt-0.5 text-base text-zinc-600">Telas y costuras pensadas para el uso intensivo.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--brand)]" aria-hidden>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Atención personalizada</h3>
                  <p className="mt-0.5 text-base text-zinc-600">Asesoramos en talles, modelos y pedidos por cantidad.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--brand)]" aria-hidden>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-1.607-1.464-2.894-3.2-2.894s-3.2 1.287-3.2 2.894v.958h6.4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Entrega a todo el país</h3>
                  <p className="mt-0.5 text-base text-zinc-600">Coordinamos envíos para que recibas tu pedido a tiempo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles de nuestra indumentaria — carrusel de fotos */}
      <section id="detalles-indumentaria" className="overflow-x-hidden border-b border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl lg:text-5xl">
            Detalles de nuestra indumentaria pensada para trabajadores
          </h2>
        </div>
        <div className="mt-12 px-4 md:px-6">
            {/* Reemplazá las rutas por tus fotos en public/carousel/ (ej. detalle-1.jpg, detalle-2.jpg, …) */}
            <IndumentariaCarousel
              images={[
                { src: "/carousel/detalle-1.jpg", alt: "Detalle de indumentaria laboral" },
                { src: "/carousel/detalle-2.jpg", alt: "Detalle de indumentaria laboral" },
                { src: "/carousel/detalle-3.jpg", alt: "Detalle de indumentaria laboral" },
                { src: "/carousel/detalle-4.jpg", alt: "Detalle de indumentaria laboral" },
                { src: "/carousel/detalle-5.jpg", alt: "Detalle de indumentaria laboral" },
                { src: "/carousel/detalle-6.jpg", alt: "Detalle de indumentaria laboral" },
              ]}
            />
        </div>
      </section>

      {/* Sección — ¿Cómo trabajamos en Álamos? (estilo referencia: icono + título + texto, dividers) */}
      <section id="como-trabajamos" className="border-b border-zinc-200 bg-zinc-100/60 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
            ¿Cómo trabajamos en Álamos?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-zinc-600 sm:text-lg">
            Un proceso simple para que tu equipo tenga la indumentaria que necesita.
          </p>
          <div className="mt-14 flex flex-col divide-y divide-sky-200/80 sm:flex-row sm:divide-x sm:divide-y-0">
            {/* Card 1 — Consultá */}
            <article className="flex flex-1 flex-col items-center rounded-lg px-6 py-10 text-center transition-colors hover:bg-white/70 hover:shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center text-[var(--brand)]" aria-hidden>
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--brand)]">Consultá</h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-600">
                Contanos qué necesitás por WhatsApp o por nuestro canal. Te asesoramos en modelos, talles y cantidades.
              </p>
            </article>

            {/* Card 2 — Elegí del catálogo */}
            <article className="flex flex-1 flex-col items-center rounded-lg px-6 py-10 text-center transition-colors hover:bg-white/70 hover:shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center text-[var(--brand)]" aria-hidden>
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--brand)]">Elegí del catálogo</h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-600">
                Revisá nuestra línea de productos: camperas, pantalones, buzos y más. Te enviamos muestras o fichas si lo necesitás.
              </p>
            </article>

            {/* Card 3 — Confirmamos tu pedido */}
            <article className="flex flex-1 flex-col items-center rounded-lg px-6 py-10 text-center transition-colors hover:bg-white/70 hover:shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center text-[var(--brand)]" aria-hidden>
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--brand)]">Confirmamos tu pedido</h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-600">
                Cerramos detalles de talles, colores y plazos. Te pasamos presupuesto y coordinamos la producción o el stock.
              </p>
            </article>

            {/* Card 4 — Entrega */}
            <article className="flex flex-1 flex-col items-center rounded-lg px-6 py-10 text-center transition-colors hover:bg-white/70 hover:shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center text-[var(--brand)]" aria-hidden>
                <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.25}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-1.607-1.464-2.894-3.2-2.894s-3.2 1.287-3.2 2.894v.958h6.4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--brand)]">Entrega</h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-600">
                Despachamos a todo el país. Te avisamos cuando sale y seguimos el envío para que llegue en tiempo y forma.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <TestimoniosSection testimonios={TESTIMONIOS} />

      {/* CTA cotización */}
      <section id="cotizacion-cta" className="border-b border-zinc-200 bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
            ¿Necesitás una cotización a medida?
          </h2>
          <p className="mt-4 text-base text-zinc-600 sm:text-lg">
            Contanos qué productos y cantidades necesitás y te enviamos un presupuesto sin compromiso.
          </p>
          <Link
            href="/cotizacion"
            className="mt-8 inline-block rounded-lg bg-[var(--brand)] px-8 py-4 text-base font-semibold text-white transition hover:bg-[var(--brand-hover)]"
          >
            Pedir cotización
          </Link>
        </div>
      </section>

      {/* Marcas que confían en nosotros — carrusel de logos (fotos en public/marcas/) */}
      <section id="marcas" className="border-b border-zinc-200 bg-zinc-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
            Marcas que confían en nosotros
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-base text-zinc-600 sm:text-lg">
            Empresas de todo el país que eligen nuestra indumentaria laboral.
          </p>
          <div className="mt-10">
            <MarcasCarousel items={MARCAS_CAROUSEL_ITEMS} />
          </div>
        </div>
      </section>

      {/* Sección contacto / CTA */}
      <section id="contacto" className="border-t border-zinc-200 bg-zinc-100 px-4 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href={whatsappContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#20bd5a]"
              aria-label="Contactar por WhatsApp"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Link>
            <span className="flex items-center gap-3 text-zinc-600" aria-hidden>
              <a href="#" className="cursor-pointer rounded-full p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2" aria-label="Instagram">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" className="cursor-pointer rounded-full p-2 text-zinc-600 transition hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2" aria-label="LinkedIn">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </span>
          </div>
          <p className="text-sm text-zinc-600">
            © 2026 Los Álamos
          </p>
        </div>
      </section>
    </main>
  );
}
