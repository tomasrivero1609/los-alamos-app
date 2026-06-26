export interface MedidaFila {
  /** Nombre de la medida, ej. "Cintura" */
  medida?: string;
  /** Valores separados por espacio, en el orden de los talles. Ej. "54 55 56" */
  valores?: string;
}

/**
 * Tabla de talles estilada (colores de marca).
 * Las columnas salen de `talles`; cada fila es una medida con sus valores.
 * Compacta para entrar completa en desktop; en pantallas chicas hace scroll horizontal.
 * Devuelve null si no hay datos suficientes.
 */
export function TablaMedidas({
  talles,
  filas,
}: {
  talles: string[];
  filas: MedidaFila[];
}) {
  const rows = Array.isArray(filas)
    ? filas.filter((f) => f && (f.medida || f.valores))
    : [];
  if (talles.length === 0 || rows.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-brand-tint">
            <th className="whitespace-nowrap px-2 py-2 text-left font-semibold uppercase tracking-wide text-brand">
              Medida
            </th>
            {talles.map((t, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-1.5 py-2 text-center font-semibold uppercase tracking-wide text-brand"
              >
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((fila, r) => {
            const valores = (fila.valores ?? "").trim().split(/\s+/).filter(Boolean);
            return (
              <tr key={r} className="border-t border-line even:bg-surface">
                <td className="px-2 py-1.5 font-semibold leading-tight text-ink">
                  {fila.medida}
                </td>
                {talles.map((_, c) => (
                  <td
                    key={c}
                    className="whitespace-nowrap px-1.5 py-1.5 text-center tabular-nums text-ink-soft"
                  >
                    {valores[c] ?? ""}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
