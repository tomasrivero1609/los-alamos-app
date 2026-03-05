export interface Testimonio {
  quote: string;
  author: string;
  role?: string;
}

interface TestimoniosSectionProps {
  testimonios: Testimonio[];
}

export function TestimoniosSection({ testimonios }: TestimoniosSectionProps) {
  if (testimonios.length === 0) return null;

  return (
    <section
      id="testimonios"
      className="border-b border-zinc-200 bg-white px-4 py-16"
      aria-label="Lo que dicen nuestros clientes"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-[var(--brand)] sm:text-3xl md:text-4xl">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-base text-zinc-600 sm:text-lg">
          Empresas y equipos que confían en nuestra indumentaria laboral.
        </p>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((t, i) => (
            <li key={i}>
              <blockquote className="flex h-full flex-col rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-6 shadow-sm transition hover:border-zinc-300 hover:shadow-md">
                <span className="mb-3 block text-3xl leading-none text-[var(--brand)]/40" aria-hidden>
                  "
                </span>
                <p className="flex-1 text-base leading-relaxed text-zinc-700">
                  {t.quote}
                </p>
                <footer className="mt-4 border-t border-zinc-200/80 pt-4">
                  <cite className="not-italic">
                    <span className="font-semibold text-zinc-900">{t.author}</span>
                    {t.role && (
                      <span className="mt-0.5 block text-sm text-zinc-600">{t.role}</span>
                    )}
                  </cite>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
