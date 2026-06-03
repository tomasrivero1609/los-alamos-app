import { Eyebrow } from "@/components/ui/Eyebrow";

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
      className="border-b border-line bg-white px-4 py-24"
      aria-label="Lo que dicen nuestros clientes"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <Eyebrow>Testimonios</Eyebrow>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            Empresas y equipos que confían en nuestra indumentaria laboral.
          </p>
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonios.map((t, i) => (
            <li key={i}>
              <blockquote className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition hover:shadow-md">
                <span className="mb-3 block text-3xl leading-none text-brand/40" aria-hidden>
                  &ldquo;
                </span>
                <p className="flex-1 text-base leading-relaxed text-ink">
                  {t.quote}
                </p>
                <footer className="mt-4 border-t border-line pt-4">
                  <cite className="not-italic">
                    <span className="font-semibold text-ink">{t.author}</span>
                    {t.role && (
                      <span className="mt-0.5 block text-sm text-ink-soft">{t.role}</span>
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
