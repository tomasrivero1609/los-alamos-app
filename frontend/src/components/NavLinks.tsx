"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { Category } from "@/types/directus";

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  whatsapp: string;
}

interface NavLinksProps {
  categories: Category[];
  socialLinks: SocialLinks;
}

export function NavLinks({ categories, socialLinks }: NavLinksProps) {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [redesOpen, setRedesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass =
    "cursor-pointer text-white font-medium transition hover:text-white/90 hover:underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand)]";

  const redesItemClass =
    "block cursor-pointer px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]";

  const closeAll = useCallback(() => {
    setCategoriesOpen(false);
    setRedesOpen(false);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeAll]);
  const firstLetterClass = "text-lg font-semibold tracking-tight";

  const redesDropdown = (
    <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
      <p className="border-b border-zinc-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Redes sociales
      </p>
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={redesItemClass}
        onClick={() => setRedesOpen(false)}
      >
        <span className={`${firstLetterClass} text-pink-500`}>I</span>nstagram
      </a>
      <a
        href={socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={redesItemClass}
        onClick={() => setRedesOpen(false)}
      >
        <span className={`${firstLetterClass} text-[#0A66C2]`}>L</span>inkedIn
      </a>
      <a
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={redesItemClass}
        onClick={() => setRedesOpen(false)}
      >
        <span className={`${firstLetterClass} text-[#25D366]`}>W</span>hatsApp
      </a>
    </div>
  );

  return (
    <>
      {/* Desktop: Categorías + Redes sociales (dropdown) */}
      <nav className="hidden items-center gap-6 md:flex">
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoriesOpen((v) => !v)}
            onBlur={() => setTimeout(() => setCategoriesOpen(false), 150)}
            className={`flex items-center gap-1 ${linkClass}`}
            aria-expanded={categoriesOpen}
            aria-haspopup="true"
            aria-label="Ver categorías de productos"
          >
            Categorías
            <svg
              className={`h-4 w-4 transition ${categoriesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {categoriesOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[200px] rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
              <p className="border-b border-zinc-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Ver por categoría
              </p>
              <Link
                href="/productos"
                className="block cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]"
                onClick={() => setCategoriesOpen(false)}
              >
                Todos los productos
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}`}
                  className="block cursor-pointer px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus-visible:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]"
                  onClick={() => setCategoriesOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setRedesOpen((v) => !v)}
            onBlur={() => setTimeout(() => setRedesOpen(false), 150)}
            className={`flex items-center gap-1 ${linkClass}`}
            aria-expanded={redesOpen}
            aria-haspopup="true"
            aria-label="Ver redes sociales"
          >
            Redes sociales
            <svg
              className={`h-4 w-4 transition ${redesOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {redesOpen && redesDropdown}
        </div>
      </nav>

      {/* Móvil: Redes dropdown + hamburger */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="relative">
          <button
            type="button"
            onClick={() => setRedesOpen((v) => !v)}
            className={linkClass}
            aria-expanded={redesOpen}
            aria-haspopup="true"
            aria-label="Ver redes sociales"
          >
            Redes sociales
          </button>
          {redesOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
              <p className="border-b border-zinc-100 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Redes sociales
              </p>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={redesItemClass}
                onClick={() => setRedesOpen(false)}
              >
                <span className={`${firstLetterClass} text-pink-500`}>I</span>nstagram
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={redesItemClass}
                onClick={() => setRedesOpen(false)}
              >
                <span className={`${firstLetterClass} text-[#0A66C2]`}>L</span>inkedIn
              </a>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={redesItemClass}
                onClick={() => setRedesOpen(false)}
              >
                <span className={`${firstLetterClass} text-[#25D366]`}>W</span>hatsApp
              </a>
            </div>
          )}
        </div>
<button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="cursor-pointer rounded p-2 text-white hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand)]"
        aria-expanded={mobileOpen}
        aria-label="Abrir menú"
      >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Panel móvil (categorías) */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-20 border-b border-zinc-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Categorías</p>
          <Link
            href="/productos"
            className="block cursor-pointer py-2 text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)] focus-visible:rounded"
            onClick={() => setMobileOpen(false)}
          >
            Todos los productos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/productos?categoria=${cat.slug}`}
              className="block cursor-pointer py-2 text-zinc-700 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)] focus-visible:rounded"
              onClick={() => setMobileOpen(false)}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
