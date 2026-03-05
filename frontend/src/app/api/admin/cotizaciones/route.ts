import { NextResponse } from "next/server";

const getDirectusUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) throw new Error("NEXT_PUBLIC_DIRECTUS_URL no está definida");
  return url.replace(/\/$/, "");
};

export async function GET(request: Request) {
  const adminKey = request.headers.get("x-admin-key");
  const secret = process.env.ADMIN_SECRET;
  const token = process.env.DIRECTUS_READ_TOKEN;

  if (!secret || adminKey !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!token) {
    return NextResponse.json(
      { error: "Configuración del servidor incompleta" },
      { status: 500 }
    );
  }

  try {
    const directusUrl = getDirectusUrl();
    const res = await fetch(`${directusUrl}/items/cotizaciones?sort=-date_created`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Directus admin cotizaciones error:", res.status, err);
      return NextResponse.json(
        { error: "Error al obtener las cotizaciones" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const items = Array.isArray(data.data) ? data.data : [];
    return NextResponse.json({ data: items });
  } catch (e) {
    console.error("Admin cotizaciones API error:", e);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
