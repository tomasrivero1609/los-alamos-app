import { NextResponse } from "next/server";

const getDirectusUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_DIRECTUS_URL no está definida");
  return url.replace(/\/$/, "");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      email,
      telefono,
      empresa = "",
      productos_interes = "",
      cantidad_aprox = "",
      plazo_deseado = "",
      comentarios = "",
      como_nos_conocio = "",
    } = body;

    if (!nombre?.trim() || !email?.trim() || !telefono?.trim()) {
      return NextResponse.json(
        { error: "Nombre, email y teléfono son obligatorios." },
        { status: 400 }
      );
    }

    const directusUrl = getDirectusUrl();
    const res = await fetch(`${directusUrl}/items/cotizaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: String(nombre).trim(),
        email: String(email).trim(),
        telefono: String(telefono).trim(),
        empresa: String(empresa).trim() || null,
        productos_interes: String(productos_interes).trim() || null,
        cantidad_aprox: String(cantidad_aprox).trim() || null,
        plazo_deseado: String(plazo_deseado).trim() || null,
        comentarios: String(comentarios).trim() || null,
        como_nos_conocio: String(como_nos_conocio).trim() || null,
        estado: "nueva",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Directus cotizacion error:", res.status, err);
      return NextResponse.json(
        { error: "No se pudo enviar la cotización. Intentá de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Cotizacion API error:", e);
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
