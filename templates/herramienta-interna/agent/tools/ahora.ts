import { defineTool } from "eve/tools";
import { z } from "zod";

const ZONA = process.env.ZONA_HORARIA ?? "America/Argentina/Buenos_Aires";

export default defineTool({
  description:
    "Devuelve la fecha y hora actuales en la zona horaria del dueño. " +
    "Usala SIEMPRE antes de razonar sobre horarios, huecos libres o fechas de vencimiento: " +
    "nunca supongas qué día u hora es.",
  inputSchema: z.object({}),
  async execute() {
    const ahora = new Date();
    const partes = new Intl.DateTimeFormat("es-AR", {
      timeZone: ZONA,
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(ahora);

    const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));

    return {
      zonaHoraria: ZONA,
      fecha: `${p.year}-${p.month}-${p.day}`,
      hora: `${p.hour}:${p.minute}`,
      diaSemana: p.weekday,
      iso: ahora.toISOString(),
    };
  },
});
