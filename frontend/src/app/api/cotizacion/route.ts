import { NextResponse } from "next/server";
import { sendCotizacionEmails, type CotizacionData } from "@/lib/mail";

export const runtime = "nodejs";

const MAX_LENGTHS = {
  nombre: 120,
  email: 254,
  telefono: 80,
  empresa: 160,
  productos_interes: 2000,
  cantidad_aprox: 120,
  plazo_deseado: 120,
  comentarios: 4000,
  como_nos_conocio: 120,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getDirectusUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_DIRECTUS_URL no está definida");
  return url.replace(/\/$/, "");
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(
  body: Record<string, unknown>,
  field: keyof typeof MAX_LENGTHS
): string {
  const value = body[field];
  if (value == null) return "";
  return String(value).trim().slice(0, MAX_LENGTHS[field]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "El cuerpo de la solicitud no es válido." },
        { status: 400 }
      );
    }

    const cleaned: CotizacionData = {
      nombre: cleanText(body, "nombre"),
      email: cleanText(body, "email").toLowerCase(),
      telefono: cleanText(body, "telefono"),
      empresa: cleanText(body, "empresa") || null,
      productos_interes: cleanText(body, "productos_interes") || null,
      cantidad_aprox: cleanText(body, "cantidad_aprox") || null,
      plazo_deseado: cleanText(body, "plazo_deseado") || null,
      comentarios: cleanText(body, "comentarios") || null,
      como_nos_conocio: cleanText(body, "como_nos_conocio") || null,
    };

    if (!cleaned.nombre || !cleaned.email || !cleaned.telefono) {
      return NextResponse.json(
        { error: "Nombre, email y teléfono son obligatorios." },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(cleaned.email)) {
      return NextResponse.json(
        { error: "Ingresá un email válido." },
        { status: 400 }
      );
    }

    const directusUrl = getDirectusUrl();
    const res = await fetch(`${directusUrl}/items/cotizaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...cleaned, estado: "nueva" }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Directus cotizacion error:", res.status, err);
      return NextResponse.json(
        { error: "No se pudo enviar la cotización. Intentá de nuevo." },
        { status: 502 }
      );
    }

    const emailResult = await sendCotizacionEmails(cleaned);

    if (!emailResult.sent) {
      console.warn(
        "Cotización guardada, pero uno o más emails no se enviaron:",
        emailResult
      );
      return NextResponse.json({
        ok: true,
        warning:
          "Recibimos la cotización, pero no se pudo enviar uno de los emails de confirmación.",
        emails: emailResult,
      });
    }

    return NextResponse.json({ ok: true, emails: emailResult });
  } catch (e) {
    console.error("Cotizacion API error:", e);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
