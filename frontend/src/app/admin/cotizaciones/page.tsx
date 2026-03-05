"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "admin_cotizaciones_key";

interface Cotizacion {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string | null;
  productos_interes?: string | null;
  cantidad_aprox?: string | null;
  plazo_deseado?: string | null;
  comentarios?: string | null;
  como_nos_conocio?: string | null;
  estado?: string | null;
  date_created?: string | null;
}

export default function AdminCotizacionesPage() {
  const [key, setKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Cotizacion[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (stored) setInputKey(stored);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cotizaciones", {
        headers: { "X-Admin-Key": inputKey },
      });
      if (res.status === 401) {
        setError("Clave incorrecta.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Error al cargar. Revisá la configuración del servidor.");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setItems(json.data ?? []);
      setKey(inputKey);
      if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, inputKey);
    } catch {
      setError("Error de conexión.");
    }
    setLoading(false);
  }

  async function refresh() {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cotizaciones", {
        headers: { "X-Admin-Key": key },
      });
      if (res.status === 401) {
        setKey("");
        if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
        setError("Sesión expirada. Volvé a ingresar la clave.");
        setItems([]);
      } else if (res.ok) {
        const json = await res.json();
        setItems(json.data ?? []);
      }
    } catch {
      setError("Error al actualizar.");
    }
    setLoading(false);
  }

  function handleSalir() {
    setKey("");
    setItems([]);
    setError(null);
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
  }

  if (!key) {
    return (
      <main className="mx-auto max-w-md px-4 pt-24 pb-20">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-zinc-900">Acceso administrador</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ingresá la clave para ver las cotizaciones.
          </p>
          <form onSubmit={handleSubmit} className="mt-6">
            <label htmlFor="clave" className="sr-only">
              Clave
            </label>
            <input
              id="clave"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Clave"
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-zinc-900 focus:border-[var(--brand)] focus:outline-none focus:ring-1 focus:ring-[var(--brand)]"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-[var(--brand)] px-4 py-2.5 font-medium text-white hover:bg-[var(--brand-hover)] disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-zinc-600 hover:underline">
            ← Volver al inicio
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pt-24 pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-[var(--brand)]">
          Cotizaciones recibidas
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={handleSalir}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Salir
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {items.length === 0 && !loading ? (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center text-zinc-600">
          No hay cotizaciones aún.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 font-semibold text-zinc-800">Fecha</th>
                <th className="px-4 py-3 font-semibold text-zinc-800">Nombre</th>
                <th className="px-4 py-3 font-semibold text-zinc-800">Email</th>
                <th className="px-4 py-3 font-semibold text-zinc-800">Teléfono</th>
                <th className="px-4 py-3 font-semibold text-zinc-800">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 text-zinc-600">
                    {row.date_created
                      ? new Date(row.date_created).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.nombre}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-[var(--brand)] hover:underline">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">{row.telefono}</td>
                  <td className="px-4 py-3 capitalize text-zinc-600">{row.estado ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length > 0 && (
        <details className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50/50">
          <summary className="cursor-pointer px-4 py-3 font-medium text-zinc-800">
            Ver detalle completo (expandir por cotización)
          </summary>
          <div className="divide-y border-t border-zinc-200 p-4">
            {items.map((row) => (
              <div key={row.id} className="py-4 first:pt-0">
                <p className="font-semibold text-zinc-900">
                  #{row.id} — {row.nombre}
                  {row.empresa ? ` (${row.empresa})` : ""}
                </p>
                <p className="mt-1 text-zinc-600">
                  {row.email} · {row.telefono}
                </p>
                {row.productos_interes && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium text-zinc-700">Productos:</span>{" "}
                    {row.productos_interes}
                  </p>
                )}
                {(row.cantidad_aprox || row.plazo_deseado) && (
                  <p className="mt-1 text-sm text-zinc-600">
                    Cantidad: {row.cantidad_aprox || "—"} · Plazo: {row.plazo_deseado || "—"}
                  </p>
                )}
                {row.como_nos_conocio && (
                  <p className="mt-1 text-sm text-zinc-600">
                    Nos conoció por: {row.como_nos_conocio}
                  </p>
                )}
                {row.comentarios && (
                  <p className="mt-2 text-sm text-zinc-600">
                    <span className="font-medium text-zinc-700">Comentarios:</span>{" "}
                    {row.comentarios}
                  </p>
                )}
              </div>
            ))}
          </div>
        </details>
      )}

      <p className="mt-8">
        <Link href="/" className="text-sm text-zinc-600 hover:underline">
          ← Volver al inicio
        </Link>
      </p>
    </main>
  );
}
