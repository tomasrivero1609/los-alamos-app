export interface MedidaFila {
  /** Nombre de la medida, ej. "Cintura" */
  medida?: string;
  /** Valores separados por espacio, en el orden de los talles. Ej. "54 55 56" */
  valores?: string;
}

/**
 * Tabla de talles estilada (colores de marca).
 * Las columnas salen de `talles`; cada fila es una medida con sus valores.
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

  const thClass =
    "whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-brand";

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-tint">
            <th className={thClass}>Medida</th>
            {talles.map((t, i) => (
              <th key={i} className={thClass}>
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
                <td className="whitespace-nowrap px-3 py-2 font-semibold text-ink">
                  {fila.medida}
                </td>
                {talles.map((_, c) => (
                  <td key={c} className="whitespace-nowrap px-3 py-2 text-ink-soft">
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
