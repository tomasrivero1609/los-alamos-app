import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { getWhatsAppLines } from "@/lib/whatsapp";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Los Álamos · Indumentaria y ropa de trabajo",
    template: "%s · Los Álamos",
  },
  description:
    "Indumentaria laboral y ropa de trabajo para empresas y equipos: camperas, pantalones, buzos y más. Calidad durable, envíos a todo el país. Consultá por WhatsApp.",
  openGraph: {
    type: "website",
    siteName: "Los Álamos",
    title: "Los Álamos · Indumentaria y ropa de trabajo",
    description:
      "Indumentaria laboral y ropa de trabajo para empresas y equipos: camperas, pantalones, buzos y más. Calidad durable, envíos a todo el país. Consultá por WhatsApp.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappLines = getWhatsAppLines();

  return (
    <html lang="es" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <a
          href="#productos-destacados"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-20 focus:z-50 focus:rounded-lg focus:bg-[var(--brand)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--brand)]"
        >
          Saltar al contenido
        </a>
        <Header />
        {children}
        <FloatingWhatsApp lines={whatsappLines} />
      </body>
    </html>
  );
}
