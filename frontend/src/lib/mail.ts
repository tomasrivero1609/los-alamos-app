import nodemailer from "nodemailer";

interface CotizacionData {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string | null;
  productos_interes?: string | null;
  cantidad_aprox?: string | null;
  plazo_deseado?: string | null;
  comentarios?: string | null;
  como_nos_conocio?: string | null;
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendCotizacionEmail(data: CotizacionData) {
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.SMTP_USER;

  if (!to || !from) {
    console.warn("SMTP_USER o NOTIFY_EMAIL no configurados; email no enviado.");
    return;
  }

  const rows = [
    ["Nombre", data.nombre],
    ["Email", data.email],
    ["Teléfono", data.telefono],
    ["Empresa", data.empresa],
    ["Productos de interés", data.productos_interes],
    ["Cantidad aprox.", data.cantidad_aprox],
    ["Plazo deseado", data.plazo_deseado],
    ["¿Cómo nos conoció?", data.como_nos_conocio],
    ["Comentarios", data.comentarios],
  ];

  const textBody = rows
    .filter(([, v]) => v)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const htmlRows = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb">${label}</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #e5e7eb">${value}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#4a6741;margin-bottom:16px">Nueva solicitud de cotización</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px">
        ${htmlRows}
      </table>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        Podés responder directamente a <a href="mailto:${data.email}">${data.email}</a> o llamar al ${data.telefono}.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Los Álamos - Cotizaciones" <${from}>`,
    to,
    replyTo: data.email,
    subject: `Nueva cotización de ${data.nombre}${data.empresa ? ` (${data.empresa})` : ""}`,
    text: textBody,
    html,
  });
}
