import { defineTool } from "eve/tools";
import { z } from "zod";

import { calendarApi } from "../lib/google";

export default defineTool({
  description:
    "Crea un evento en el Google Calendar del dueño: un bloque de trabajo con las tareas " +
    "a resolver en la descripción. Usar solo después de que el dueño confirmó la propuesta.",
  inputSchema: z.object({
    titulo: z.string().min(1).describe("Título corto del evento, ej: 'Bloque de foco: propuesta nueva'"),
    tareas: z.array(z.string()).min(1).describe("Tareas concretas a resolver en este bloque"),
    inicio: z
      .string()
      .describe("Inicio en formato ISO local sin zona, ej: 2026-07-30T15:00:00"),
    fin: z.string().describe("Fin en formato ISO local sin zona, ej: 2026-07-30T16:00:00"),
    zonaHoraria: z
      .string()
      .default("America/Argentina/Buenos_Aires")
      .describe("Zona horaria IANA del dueño"),
  }),
  async execute({ titulo, tareas, inicio, fin, zonaHoraria }) {
    const evento = (await calendarApi("/calendars/primary/events", {
      method: "POST",
      body: {
        summary: titulo,
        description:
          "Tareas de este bloque:\n" +
          tareas.map((t) => `• ${t}`).join("\n") +
          "\n\nAgendado por tu asistente de agenda 🤖",
        start: { dateTime: inicio, timeZone: zonaHoraria },
        end: { dateTime: fin, timeZone: zonaHoraria },
        reminders: { useDefault: true },
      },
    })) as { id?: string; htmlLink?: string; summary?: string };

    return {
      creado: true,
      titulo: evento.summary,
      link: evento.htmlLink ?? null,
    };
  },
});
