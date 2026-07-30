#!/usr/bin/env node
// Desconecta tu Google Calendar de este agente.
// 1. Le avisa a Google que revoque el permiso (queda sin efecto al instante)
// 2. Borra el permiso guardado en .env
//
// Uso: npm run desconectar-google

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

const env = leerEnv();
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || env.GOOGLE_REFRESH_TOKEN;

if (!refreshToken) {
  console.log("✅ No hay ningún permiso de Google guardado. No hay nada que desconectar.");
  process.exit(0);
}

let revocado = false;
try {
  const res = await fetch("https://oauth2.googleapis.com/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token: refreshToken }),
  });
  revocado = res.ok;
} catch {
  revocado = false;
}

// Borramos el permiso del .env pase lo que pase: acá ya no sirve de nada.
const contenido = readFileSync(ENV_PATH, "utf8").replace(
  /^GOOGLE_REFRESH_TOKEN=.*$/m,
  "GOOGLE_REFRESH_TOKEN=",
);
writeFileSync(ENV_PATH, contenido);

if (revocado) {
  console.log("✅ Listo: tu agente ya no tiene acceso a tu Google Calendar.");
  console.log("   El permiso quedó revocado en Google y borrado de tu computadora.");
} else {
  console.log("✅ Borré el permiso de tu computadora: tu agente ya no puede entrar a tu calendario.");
  console.log("   Google no confirmó la revocación (puede que ya estuviera vencido).");
  console.log("   Para asegurarte, revisá: https://myaccount.google.com/permissions");
}
console.log("\n   Si más adelante querés volver a conectarlo: npm run conectar-google\n");
