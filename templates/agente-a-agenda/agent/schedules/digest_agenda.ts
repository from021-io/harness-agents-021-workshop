import { defineSchedule } from "eve/schedules";

import telegram from "../channels/telegram";

// El horario está en UTC (en Vercel el cron corre en UTC), así que hay que
// convertir desde la hora local del dueño (ver ZONA_HORARIA en .env).
// Ejemplos de las 08:00 locales: Argentina (UTC-3) = "0 11 * * 1-5",
// México (UTC-6) = "0 14 * * 1-5", España (UTC+2 en verano) = "0 6 * * 1-5".
export default defineSchedule({
  cron: "0 11 * * 1-5",
  async run({ receive, waitUntil, appAuth }) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) {
      console.warn("[digest_agenda] Falta TELEGRAM_CHAT_ID en .env, no se envía la propuesta.");
      return;
    }

    const hoy = new Date().toISOString().slice(0, 10);

    waitUntil(
      receive(telegram, {
        message:
          `Es la propuesta diaria. Hoy es ${hoy}. ` +
          "Leé el backlog con leer_backlog, leé la agenda de hoy con leer_agenda, " +
          "y armá la propuesta de bloque de trabajo siguiendo tus instrucciones. " +
          "Enviala y esperá la confirmación antes de agendar nada.",
        target: { chatId: Number(chatId) },
        auth: appAuth,
      }),
    );
  },
});
