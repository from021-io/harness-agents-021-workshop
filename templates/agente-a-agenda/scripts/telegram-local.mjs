#!/usr/bin/env node
// Puente local de Telegram: hace que tu bot conteste mensajes SIN estar
// publicado en internet. Escucha los mensajes nuevos del bot (polling) y
// se los pasa al agente que corre en tu compu (localhost:3000).
//
// Uso: npm run telegram-local   (dejalo corriendo junto con npm run dev)
// Nota: al publicar (/publicar) este puente ya no hace falta: el webhook
// real lo reemplaza.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENV_PATH = join(process.cwd(), ".env");
const LOCAL_WEBHOOK = process.env.EVE_LOCAL_URL ?? "http://localhost:3000/eve/v1/telegram";

function leerEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const linea of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = leerEnv();
const token = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;
const secreto = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN || env.TELEGRAM_WEBHOOK_SECRET_TOKEN;

if (!token || !secreto) {
  console.error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_WEBHOOK_SECRET_TOKEN en .env.");
  process.exit(1);
}

const api = (metodo, params) =>
  fetch(`https://api.telegram.org/bot${token}/${metodo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? {}),
  }).then((r) => r.json());

// getUpdates no funciona si hay un webhook registrado: en modo local lo sacamos.
await api("deleteWebhook");

const me = await api("getMe");
console.log(`🔌 Puente local activo para @${me.result?.username}.`);
console.log(`   Los mensajes que le mandes al bot llegan a ${LOCAL_WEBHOOK}`);
console.log("   Dejá esta ventana corriendo. Ctrl+C para frenar.\n");

let offset = 0;
while (true) {
  let updates;
  try {
    updates = await api("getUpdates", {
      offset,
      timeout: 25,
      allowed_updates: ["message", "callback_query"],
    });
  } catch {
    await new Promise((r) => setTimeout(r, 3000));
    continue;
  }

  if (!updates?.ok) {
    await new Promise((r) => setTimeout(r, 3000));
    continue;
  }

  for (const update of updates.result) {
    offset = update.update_id + 1;
    try {
      const res = await fetch(LOCAL_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Bot-Api-Secret-Token": secreto,
        },
        body: JSON.stringify(update),
      });
      const quien = update.message?.chat?.first_name ?? "callback";
      console.log(`→ mensaje de ${quien} entregado al agente (${res.status})`);
    } catch {
      console.log("⚠️ El agente local no responde (¿está corriendo npm run dev?). Reintento con el próximo mensaje.");
    }
  }
}
