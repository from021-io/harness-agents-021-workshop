#!/usr/bin/env node
// Conecta tu bot de Telegram con este agente.
// 1. Lee el token del bot desde .env
// 2. Espera a que le mandes un mensaje al bot
// 3. Guarda tu chat en .env (TELEGRAM_CHAT_ID) y te responde para confirmar
//
// Uso: npm run conectar-telegram

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ENV_PATH = join(process.cwd(), ".env");

function leerEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const linea of readFileSync(ENV_PATH, "utf8").split("\n")) {
    const m = linea.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

function guardarEnEnv(clave, valor) {
  let contenido = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  const regex = new RegExp(`^${clave}=.*$`, "m");
  if (regex.test(contenido)) {
    contenido = contenido.replace(regex, `${clave}=${valor}`);
  } else {
    contenido += (contenido.endsWith("\n") || contenido === "" ? "" : "\n") + `${clave}=${valor}\n`;
  }
  writeFileSync(ENV_PATH, contenido);
}

const env = leerEnv();
const token = process.env.TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("Falta TELEGRAM_BOT_TOKEN en el archivo .env. Completalo primero.");
  process.exit(1);
}

const api = (metodo, params) =>
  fetch(`https://api.telegram.org/bot${token}/${metodo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? {}),
  }).then((r) => r.json());

const me = await api("getMe");
if (!me.ok) {
  console.error("El token del bot no funciona. Revisá que esté bien copiado en .env.");
  process.exit(1);
}

// Si había un webhook registrado, getUpdates no funciona. Lo sacamos en modo local.
await api("deleteWebhook");

console.log(`\nBot encontrado: @${me.result.username}`);
guardarEnEnv("TELEGRAM_BOT_USERNAME", me.result.username);
console.log(`\n➡️  Abrí Telegram y mandale cualquier mensaje a @${me.result.username} (por ejemplo "hola").`);
console.log("   Esperando tu mensaje...\n");

let offset = 0;
const inicio = Date.now();
while (Date.now() - inicio < 5 * 60 * 1000) {
  const updates = await api("getUpdates", { offset, timeout: 20 });
  if (updates.ok) {
    for (const u of updates.result) {
      offset = u.update_id + 1;
      const msg = u.message;
      if (msg?.chat?.type === "private") {
        const chatId = msg.chat.id;
        const nombre = msg.chat.first_name ?? "";
        guardarEnEnv("TELEGRAM_CHAT_ID", String(chatId));
        await api("sendMessage", {
          chat_id: chatId,
          text: `¡Listo ${nombre}! Ya quedamos conectados. Por acá te voy a escribir cuando esté funcionando.`,
        });
        console.log(`✅ Conectado con ${nombre} (chat ${chatId}). Guardado en .env.`);
        console.log("   Revisá Telegram: el bot te acaba de responder.\n");
        process.exit(0);
      }
    }
  }
}

console.error("No llegó ningún mensaje en 5 minutos. Volvé a correr el comando e intentá de nuevo.");
process.exit(1);
