#!/usr/bin/env node
// Conecta tu Google Calendar con este agente.
// 1. Lee las credenciales del taller (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) desde .env
// 2. Abre el navegador para que autorices el acceso a tu calendario
// 3. Guarda el permiso (GOOGLE_REFRESH_TOKEN) en .env
//
// Uso: npm run conectar-google

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";

const ENV_PATH = join(process.cwd(), ".env");
const PUERTO = 8756;
const REDIRECT_URI = `http://localhost:${PUERTO}/callback`;
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly";

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
const clientId = process.env.GOOGLE_CLIENT_ID || env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || env.GOOGLE_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Faltan GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env (los entrega el organizador del taller).");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");
const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");
authUrl.searchParams.set("state", state);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  const stateRecibido = url.searchParams.get("state");
  const errorGoogle = url.searchParams.get("error");

  if (errorGoogle === "access_denied") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      "<div style='font-family:sans-serif;text-align:center;margin-top:80px'>" +
        "<h1>🔒 Google todavía no habilitó tu cuenta</h1>" +
        "<p>La app del taller está en modo prueba. Pedile a quien da el taller que agregue tu correo (o que publique la app) y probamos de nuevo.</p></div>",
    );
    console.error(
      "\n🔒 Google bloqueó el acceso (access_denied).\n" +
        "   Tu cuenta no está habilitada en la app del taller.\n" +
        "   Pedile a quien da el taller que agregue tu correo como usuario de prueba,\n" +
        "   o que publique la app. Después volvé a correr: npm run conectar-google\n",
    );
    server.close();
    process.exit(2);
  }

  if (!code || stateRecibido !== state) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h2>Algo salió mal. Cerrá esta pestaña y volvé a correr el comando.</h2>");
    return;
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
    res.end("<h2>No se recibió el permiso completo. Cerrá esta pestaña y volvé a correr el comando.</h2>");
    console.error("Google no devolvió refresh_token:", JSON.stringify(tokens).slice(0, 300));
    server.close();
    process.exit(1);
  }

  guardarEnEnv("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    "<div style='font-family:sans-serif;text-align:center;margin-top:80px'>" +
      "<h1>✅ ¡Listo!</h1><p>Tu calendario quedó conectado. Ya podés cerrar esta pestaña y volver al taller.</p></div>",
  );
  console.log("✅ Google Calendar conectado. Permiso guardado en .env.");
  server.close();
  process.exit(0);
});

server.listen(PUERTO, () => {
  console.log("\n➡️  Se va a abrir el navegador para que autorices el acceso a tu Google Calendar.");
  console.log("   Elegí tu cuenta y tocá «Permitir».");
  console.log("   Si aparece «Google no verificó esta app»: tocá «Configuración avanzada» y después «Ir a ... (no seguro)».");
  console.log("   Es la app del taller.\n");
  console.log(`   Si no se abre solo, entrá acá: ${authUrl.toString()}\n`);
  const abrir = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  exec(`${abrir} "${authUrl.toString()}"`);
});

setTimeout(() => {
  console.error("Pasaron 5 minutos sin autorización. Volvé a correr el comando.");
  process.exit(1);
}, 5 * 60 * 1000);
