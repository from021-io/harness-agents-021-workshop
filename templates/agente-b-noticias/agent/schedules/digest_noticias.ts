import { defineSchedule } from "eve/schedules";

import telegram from "../channels/telegram";

// El horario está en UTC (en Vercel el cron corre en UTC).
// "0 11 * * *" = 11:00 UTC = 08:00 en Argentina (UTC-3).
export default defineSchedule({
  cron: "0 11 * * *",
  async run({ receive, waitUntil, appAuth }) {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) {
      console.warn("[digest_noticias] Falta TELEGRAM_CHAT_ID en .env — no se envía el digest.");
      return;
    }

    waitUntil(
      receive(telegram, {
        message:
          "Es la hora del digest diario. Buscá las noticias de las últimas 24 horas " +
          "sobre tu tema configurado con la herramienta buscar_noticias y armá el digest " +
          "siguiendo tus instrucciones. Envialo como respuesta.",
        target: { chatId: Number(chatId) },
        auth: appAuth,
      }),
    );
  },
});
