import { defineSchedule } from "eve/schedules";

import telegram from "../channels/telegram";

// El horario está en UTC (en Vercel el cron corre en UTC).
// "0 11 * * 1-5" = 11:00 UTC = 08:00 en Argentina (UTC-3), lunes a viernes.
export default defineSchedule({
  cron: "0 11 * * 1-5",
  async run({ receive, waitUntil, appAuth }) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) {
      console.warn("[digest_agenda] Falta TELEGRAM_CHAT_ID en .env — no se envía la propuesta.");
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
