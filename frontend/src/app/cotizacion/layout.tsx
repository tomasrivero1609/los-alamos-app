import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedir cotización — LOS ÁLAMOS",
  description: "Solicitá una cotización a medida para indumentaria laboral. Completá el formulario y te respondemos a la brevedad.",
};

export default function CotizacionLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
