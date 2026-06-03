import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "whatsapp";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "rounded-lg bg-brand px-6 py-3 text-sm text-white hover:bg-brand-hover focus-visible:ring-brand",
  secondary:
    "rounded-lg border border-ink px-6 py-3 text-sm text-ink hover:bg-ink hover:text-white focus-visible:ring-ink",
  whatsapp:
    "rounded-full bg-[#25D366] px-5 py-2.5 text-sm text-white hover:bg-[#20bd5a] focus-visible:ring-[#25D366]",
};

interface BaseProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

type ButtonProps =
  | (BaseProps & { href: string; external?: boolean; onClick?: never; type?: never })
  | (BaseProps & { href?: never; onClick?: () => void; type?: "button" | "submit" });

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const ext = props.external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <Link href={props.href} className={cls} {...ext}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={("type" in props && props.type) || "button"}
      onClick={"onClick" in props ? props.onClick : undefined}
      className={cls}
    >
      {children}
    </button>
  );
}
