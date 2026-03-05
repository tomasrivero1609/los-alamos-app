"use client";

import Link from "next/link";
import { useState } from "react";

export default function CotizacionPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      nombre: formData.get("nombre") ?? "",
      email: formData.get("email") ?? "",
      telefono: formData.get("telefono") ?? "",
      empresa: formData.get("empresa") ?? "",
      productos_interes: formData.get("productos_interes") ?? "",
      cantidad_aprox: formData.get("cantidad_aprox") ?? "",
      plazo_deseado: formData.get("plazo_deseado") ?? "",
      comentarios: formData.get("comentarios") ?? "",
      como_nos_conocio: formData.get("como_nos_conocio") ?? "",
    };

    try {
      const res = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Error al enviar. Intentá de nuevo.");
        setSending(false);
        return;
      }
      setSent(true);
      form.reset();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }
    setSending(false);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-20">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-600 hover:underline"
      >
        ← Volver al inicio
      </Link>

      <header className="mb-12">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
          Pedir cotización
        </h1>
        <p className="mt-4 text-base text-zinc-600 sm:text-lg">
          Contanos qué necesitás y te respondemos con una cotización a medida. No te olvides de indicar productos de interés, cantidades aproximadas y plazos si los tenés.
        </p>
      </header>

      {sent ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-800">
          <p className="font-semibold">Cotización enviada</p>
          <p className="mt-2 text-base">
            Recibimos tu solicitud. Te vamos a contactar a la brevedad por email o teléfono.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-sm font-medium text-green-700 underline hover:no-underline"
          >
            Enviar otra cotización
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-zinc-800">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-zinc-800">
              Teléfono *
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="empresa" className="block text-sm font-medium text-zinc-800">
              Empresa / Razón social
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="productos_interes" className="block text-sm font-medium text-zinc-800">
              Productos de interés
            </label>
            <textarea
              id="productos_interes"
              name="productos_interes"
              rows={3}
              placeholder="Ej.: camperas, pantalones, buzos..."
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="cantidad_aprox" className="block text-sm font-medium text-zinc-800">
              Cantidad aproximada
            </label>
            <input
              id="cantidad_aprox"
              name="cantidad_aprox"
              type="text"
              placeholder="Ej.: 50 unidades, 100-200"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="plazo_deseado" className="block text-sm font-medium text-zinc-800">
              Plazo deseado
            </label>
            <input
              id="plazo_deseado"
              name="plazo_deseado"
              type="text"
              placeholder="Ej.: marzo 2026, urgente"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <div>
            <label htmlFor="como_nos_conocio" className="block text-sm font-medium text-zinc-800">
              ¿Cómo nos conoció?
            </label>
            <select
              id="como_nos_conocio"
              name="como_nos_conocio"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            >
              <option value="">Seleccionar</option>
              <option value="Web">Web</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referido">Referido</option>
            </select>
          </div>

          <div>
            <label htmlFor="comentarios" className="block text-sm font-medium text-zinc-800">
              Comentarios / Requisitos especiales
            </label>
            <textarea
              id="comentarios"
              name="comentarios"
              rows={4}
              placeholder="Talles especiales, colores, logística, etc."
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-lg bg-[var(--brand)] px-6 py-3 font-medium text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-60"
          >
            {sending ? "Enviando…" : "Enviar solicitud de cotización"}
          </button>
        </form>
      )}
    </main>
  );
}
