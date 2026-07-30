import { defineTool } from "eve/tools";
import { z } from "zod";

import { calendarApi } from "../lib/google";

type EventoGoogle = {
  id?: string;
  summary?: string;
  status?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

export default defineTool({
  description:
    "Lee los eventos del Google Calendar del dueño para un día dado. " +
    "Devuelve cada evento con horario de inicio y fin, para detectar huecos libres.",
  inputSchema: z.object({
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Día a consultar en formato YYYY-MM-DD"),
    zonaHoraria: z
      .string()
      .default("America/Argentina/Buenos_Aires")
      .describe("Zona horaria IANA del dueño, ej: America/Argentina/Buenos_Aires"),
  }),
  async execute({ fecha, zonaHoraria }) {
    const data = (await calendarApi("/calendars/primary/events", {
      query: {
        timeMin: `${fecha}T00:00:00Z`,
        timeMax: `${fecha}T23:59:59Z`,
        singleEvents: "true",
        orderBy: "startTime",
        timeZone: zonaHoraria,
        maxResults: "50",
      },
    })) as { items?: EventoGoogle[] };

    const eventos = (data.items ?? [])
      .filter((e) => e.status !== "cancelled")
      .map((e) => ({
        titulo: e.summary ?? "(sin título)",
        inicio: e.start?.dateTime ?? e.start?.date ?? null,
        fin: e.end?.dateTime ?? e.end?.date ?? null,
        diaCompleto: Boolean(e.start?.date),
      }));

    return { fecha, zonaHoraria, eventos };
  },
});
