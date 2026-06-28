import { Resend } from "resend";

export interface CotizacionData {
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

interface CotizacionEmailResult {
  sent: boolean;
  id?: string;
  skipped?: boolean;
  error?: string;
}

export interface CotizacionEmailsResult {
  sent: boolean;
  notification: CotizacionEmailResult;
  confirmation: CotizacionEmailResult;
}

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  resendClient ??= new Resend(apiKey);
  return resendClient;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function formatFromAddress(from: string): string {
  const cleanFrom = sanitizeHeader(from);
  return cleanFrom.includes("<")
    ? cleanFrom
    : `Los Álamos - Cotizaciones <${cleanFrom}>`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "No se pudo enviar el email de cotización.";
}

function getRows(data: CotizacionData): Array<[string, string | null | undefined]> {
  return [
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
}

function buildTextBody(rows: Array<[string, string | null | undefined]>): string {
  return rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function buildHtmlRows(rows: Array<[string, string | null | undefined]>): string {
  return rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join("");
}

function missingConfigResult(error: string): CotizacionEmailResult {
  return { sent: false, skipped: true, error };
}

export async function sendCotizacionEmails(
  data: CotizacionData
): Promise<CotizacionEmailsResult> {
  const resend = getResendClient();
  const notifyEmail = process.env.RESEND_NOTIFY_EMAIL || process.env.NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resend || !notifyEmail || !from) {
    const skipped = missingConfigResult("Configuración de Resend incompleta.");
    console.warn(
      "RESEND_API_KEY, RESEND_FROM_EMAIL o RESEND_NOTIFY_EMAIL no configurados; emails no enviados."
    );
    return { sent: false, notification: skipped, confirmation: skipped };
  }

  const rows = getRows(data);
  const textBody = buildTextBody(rows);
  const htmlRows = buildHtmlRows(rows);
  const safeEmail = escapeHtml(data.email);
  const safeTelefono = escapeHtml(data.telefono);
  const formattedFrom = formatFromAddress(from);

  const notificationSubject = sanitizeHeader(
    `Nueva cotización de ${data.nombre}${data.empresa ? ` (${data.empresa})` : ""}`
  );
  const notificationHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#4a6741;margin-bottom:16px">Nueva solicitud de cotización</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px">
        ${htmlRows}
      </table>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        Podés responder directamente a <a href="mailto:${safeEmail}">${safeEmail}</a> o llamar al ${safeTelefono}.
      </p>
    </div>
  `;

  const confirmationSubject = sanitizeHeader(
    "Recibimos tu solicitud de cotización - Los Álamos"
  );
  const confirmationText = [
    `Hola ${data.nombre},`,
    "",
    "Recibimos tu solicitud de cotización. Nuestro equipo la va a revisar y te va a responder a la brevedad.",
    "",
    "Resumen de tu solicitud:",
    textBody,
    "",
    "Los Álamos",
  ].join("\n");
  const confirmationHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
      <h2 style="color:#4a6741;margin-bottom:16px">Recibimos tu solicitud</h2>
      <p>Hola ${escapeHtml(data.nombre)},</p>
      <p>Gracias por contactar a Los Álamos. Recibimos tu solicitud de cotización y nuestro equipo la va a revisar para responderte a la brevedad.</p>
      <h3 style="margin-top:24px;color:#374151;font-size:16px">Resumen de tu solicitud</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px">
        ${htmlRows}
      </table>
      <p style="margin-top:16px;font-size:13px;color:#6b7280">
        Este es un email automático de confirmación. Si necesitás agregar información, podés responder este correo.
      </p>
    </div>
  `;

  const notification = await resend.emails.send({
    from: formattedFrom,
    to: [notifyEmail],
    replyTo: data.email,
    subject: notificationSubject,
    text: textBody,
    html: notificationHtml,
  });

  const confirmation = await resend.emails.send({
    from: formattedFrom,
    to: [data.email],
    replyTo: notifyEmail,
    subject: confirmationSubject,
    text: confirmationText,
    html: confirmationHtml,
  });

  const notificationResult: CotizacionEmailResult = notification.error
    ? { sent: false, error: getErrorMessage(notification.error) }
    : { sent: true, id: notification.data?.id };
  const confirmationResult: CotizacionEmailResult = confirmation.error
    ? { sent: false, error: getErrorMessage(confirmation.error) }
    : { sent: true, id: confirmation.data?.id };

  if (notification.error) console.error("Resend notification error:", notification.error);
  if (confirmation.error) console.error("Resend confirmation error:", confirmation.error);

  return {
    sent: notificationResult.sent && confirmationResult.sent,
    notification: notificationResult,
    confirmation: confirmationResult,
  };
}
