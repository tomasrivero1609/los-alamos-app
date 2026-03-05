const getWhatsAppNumber = (): string =>
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";

/** Una línea de venta: número y etiqueta para el botón flotante */
export interface WhatsAppLine {
  number: string;
  label: string;
}

/** Devuelve las líneas de WhatsApp (1 a 3) desde env. Compatible con el viejo NEXT_PUBLIC_WHATSAPP_NUMBER. */
export function getWhatsAppLines(): WhatsAppLine[] {
  const n1 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_1?.replace(/\D/g, "") ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ||
    "";
  const n2 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2?.replace(/\D/g, "") || "";
  const n3 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_3?.replace(/\D/g, "") || "";

  const labels = [
    process.env.NEXT_PUBLIC_WHATSAPP_LABEL_1 || "Línea 1",
    process.env.NEXT_PUBLIC_WHATSAPP_LABEL_2 || "Línea 2",
    process.env.NEXT_PUBLIC_WHATSAPP_LABEL_3 || "Línea 3",
  ];

  const lines: WhatsAppLine[] = [];
  if (n1) lines.push({ number: n1, label: labels[0] });
  if (n2) lines.push({ number: n2, label: labels[1] });
  if (n3) lines.push({ number: n3, label: labels[2] });
  return lines;
}

/** Arma la URL de WhatsApp para un número y mensaje opcional */
export function whatsappUrl(number: string, message?: string): string {
  const num = number.replace(/\D/g, "");
  if (!num) return "#";
  const text = encodeURIComponent(message || "Hola, me gustaría hacer una consulta.");
  return `https://wa.me/${num}?text=${text}`;
}

/** Enlace para consulta general (sin producto) — usa la primera línea si existe */
export function whatsappContactUrl(message?: string): string {
  const number = getWhatsAppNumber();
  if (!number) {
    const lines = getWhatsAppLines();
    if (lines.length > 0) return whatsappUrl(lines[0].number, message);
    return "#";
  }
  return whatsappUrl(number, message);
}

/** Enlace con mensaje prellenado por producto — usa la primera línea si existe */
export function whatsappProductUrl(productName: string): string {
  const number = getWhatsAppNumber();
  const msg = `Hola, me interesa el producto: ${productName}`;
  if (!number) {
    const lines = getWhatsAppLines();
    if (lines.length > 0) return whatsappUrl(lines[0].number, msg);
    return "#";
  }
  return whatsappUrl(number, msg);
}
