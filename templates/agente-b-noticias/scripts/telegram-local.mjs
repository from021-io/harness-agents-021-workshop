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
// El servidor puede arrancar en 3000 o, si ese puerto está ocupado, en el
// siguiente libre. Buscamos dónde está en vez de asumirlo.
const PUERTOS = [3000, 3001, 3002, 3003, 3004, 3005];
let baseUrl = process.env.EVE_LOCAL_URL ?? null;

async function buscarServidor({ avisar = true } = {}) {
  if (process.env.EVE_LOCAL_URL) return process.env.EVE_LOCAL_URL;
  for (const puerto of PUERTOS) {
    try {
      const res = await fetch(`http://localhost:${puerto}/eve/v1/health`, {
        signal: AbortSignal.timeout(1500),
      });
      if (res.ok) {
        const url = `http://localhost:${puerto}`;
        if (avisar && url !== baseUrl) console.log(`🔗 Agente encontrado en ${url}`);
        return url;
      }
    } catch {
      // seguimos probando
    }
  }
  return null;
}

async function esperarServidor() {
  for (let intento = 0; intento < 60; intento++) {
    const url = await buscarServidor();
    if (url) return url;
    if (intento === 0) console.log("⏳ Esperando a que el agente esté listo...");
    await new Promise((r) => setTimeout(r, 2000));
  }
  return null;
}

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
baseUrl = await esperarServidor();
if (!baseUrl) {
  console.error("No encuentro el agente corriendo. Arrancá `npm run dev` y volvé a intentar.");
  process.exit(1);
}

console.log(`🔌 Puente local activo para @${me.result?.username}.`);
console.log(`   Los mensajes que le mandes al bot llegan a ${baseUrl}/eve/v1/telegram`);
console.log("   Dejá esta ventana corriendo. Ctrl+C para frenar.\n");

// Entrega un mensaje al agente. Si el servidor se reinició (y quizás cambió de
// puerto), lo vuelve a buscar y reintenta en vez de perder el mensaje.
async function entregar(update) {
  for (let intento = 0; intento < 3; intento++) {
    try {
      const res = await fetch(`${baseUrl}/eve/v1/telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Bot-Api-Secret-Token": secreto,
        },
        body: JSON.stringify(update),
      });
      if (res.ok) return res.status;
    } catch {
      // el servidor no responde: puede estar reiniciando
    }
    const url = await esperarServidor();
    if (url) baseUrl = url;
  }
  return null;
}

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
    const quien = update.message?.chat?.first_name ?? "callback";
    const estado = await entregar(update);
    if (estado) {
      console.log(`→ mensaje de ${quien} entregado al agente (${estado})`);
    } else {
      console.log(`⚠️ No pude entregar el mensaje de ${quien}: el agente no responde en ningún puerto.`);
    }
  }
}
