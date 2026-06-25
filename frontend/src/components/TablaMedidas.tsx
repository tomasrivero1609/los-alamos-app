export interface TablaMedidasData {
  columnas?: string[];
  filas?: string[][];
}

/** Tabla de talles estilada (colores de marca). Devuelve null si no hay datos válidos. */
export function TablaMedidas({ data }: { data: TablaMedidasData }) {
  const columnas = Array.isArray(data?.columnas) ? data.columnas : [];
  const filas = Array.isArray(data?.filas) ? data.filas : [];
  if (columnas.length === 0 || filas.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-brand-tint">
            {columnas.map((col, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-brand"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, r) => (
            <tr key={r} className="border-t border-line even:bg-surface">
              {fila.map((celda, c) => (
                <td
                  key={c}
                  className={`whitespace-nowrap px-3 py-2 ${
                    c === 0 ? "font-semibold text-ink" : "text-ink-soft"
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
