"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

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

/** Clases del badge según el estado de la cotización */
function estadoBadgeClass(estado?: string | null): string {
  const e = (estado ?? "nueva").toLowerCase();
  if (e === "nueva") return "border-brand/30 bg-brand-tint text-brand";
  if (e === "vista" || e === "en_proceso") return "border-amber-200 bg-amber-50 text-amber-700";
  if (e === "respondida" || e === "cerrada") return "border-line bg-surface text-ink-soft";
  return "border-line bg-surface text-ink-soft";
}

function formatFecha(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminCotizacionesPage() {
  const [key, setKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Cotizacion[]>([]);

  // Sincroniza la clave guardada al montar (sessionStorage es solo de cliente).
  // Es el patrón SSR-safe: setear en efecto evita un hydration mismatch del input controlado.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync desde sessionStorage al montar
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

  // --- Pantalla de acceso ---
  if (!key) {
    return (
      <main className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-2xl border border-line bg-white p-8 shadow-sm">
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">Acceso administrador</h1>
          <p className="mt-2 text-sm text-ink-soft">
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
              className="w-full rounded-lg border border-line px-4 py-2.5 text-ink placeholder:text-ink-soft/60 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-brand px-4 py-2.5 font-semibold text-white transition hover:bg-brand-hover disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center">
          <Link href="/" className="text-sm text-ink-soft hover:text-ink">
            ← Volver al inicio
          </Link>
        </p>
      </main>
    );
  }

  // --- Panel ---
  const now = new Date();
  const nuevas = items.filter((i) => (i.estado ?? "nueva").toLowerCase() === "nueva").length;
  const esteMes = items.filter((i) => {
    if (!i.date_created) return false;
    const d = new Date(i.date_created);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total", value: items.length },
    { label: "Nuevas", value: nuevas },
    { label: "Este mes", value: esteMes },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      {/* Encabezado */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Panel de cotizaciones
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface disabled:opacity-60"
          >
            {loading ? "Actualizando…" : "Actualizar"}
          </button>
          <button
            type="button"
            onClick={handleSalir}
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Mini-stats */}
      <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white px-4 py-3">
            <p className="text-2xl font-extrabold tracking-tight text-ink">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Listado */}
      {items.length === 0 && !loading ? (
        <p className="mt-8 rounded-xl border border-line bg-surface p-10 text-center text-ink-soft">
          No hay cotizaciones aún.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex flex-col rounded-2xl border border-line bg-white p-5 transition hover:shadow-md"
            >
              {/* Encabezado de la card */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{row.nombre}</p>
                  {row.empresa && (
                    <p className="truncate text-sm text-ink-soft">{row.empresa}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${estadoBadgeClass(
                    row.estado
                  )}`}
                >
                  {row.estado ?? "nueva"}
                </span>
              </div>

              <p className="mt-1 text-xs text-ink-soft">{formatFecha(row.date_created)}</p>

              {/* Contacto */}
              <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
                <a href={`mailto:${row.email}`} className="truncate text-brand hover:underline">
                  {row.email}
                </a>
                <a href={`tel:${row.telefono}`} className="text-ink-soft hover:text-ink">
                  {row.telefono}
                </a>
              </div>

              {/* Detalle */}
              {(row.productos_interes ||
                row.cantidad_aprox ||
                row.plazo_deseado ||
                row.como_nos_conocio ||
                row.comentarios) && (
                <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm">
                  {row.productos_interes && (
                    <div>
                      <dt className="inline font-medium text-ink">Productos: </dt>
                      <dd className="inline text-ink-soft">{row.productos_interes}</dd>
                    </div>
                  )}
                  {(row.cantidad_aprox || row.plazo_deseado) && (
                    <div className="text-ink-soft">
                      Cantidad: {row.cantidad_aprox || "—"} · Plazo: {row.plazo_deseado || "—"}
                    </div>
                  )}
                  {row.como_nos_conocio && (
                    <div className="text-ink-soft">Nos conoció por: {row.como_nos_conocio}</div>
                  )}
                  {row.comentarios && (
                    <div>
                      <dt className="inline font-medium text-ink">Comentarios: </dt>
                      <dd className="inline text-ink-soft">{row.comentarios}</dd>
                    </div>
                  )}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10">
        <Link href="/" className="text-sm text-ink-soft hover:text-ink">
          ← Volver al inicio
        </Link>
      </p>
    </main>
  );
}
