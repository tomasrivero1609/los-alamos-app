interface LogoProps {
  variant?: "mark" | "full";
  className?: string;
}

/** Símbolo de los tres álamos (hereda color con currentColor) */
function AlamosMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} fill="none" aria-hidden="true">
      <g fill="currentColor">
        <path d="M35 30 Q46 51 35 72 Q24 51 35 30 Z" />
        <path d="M60 16 Q73 44 60 72 Q47 44 60 16 Z" />
        <path d="M85 32 Q96 52 85 72 Q74 52 85 32 Z" />
      </g>
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M35 72 V80" />
        <path d="M60 72 V83" />
        <path d="M85 72 V80" />
      </g>
    </svg>
  );
}

export function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "mark") {
    return <AlamosMark className={className || "h-7 w-auto text-brand"} />;
  }
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AlamosMark className="h-7 w-auto text-brand" />
      <span className="leading-none">
        <span className="block text-lg font-extrabold tracking-tight text-ink">
          los álamos<span className="text-brand">.</span>
        </span>
        <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.2em] text-brand">
          Indumentaria laboral
        </span>
      </span>
    </span>
  );
}
