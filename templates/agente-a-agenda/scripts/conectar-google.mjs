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

// Página que ve el usuario en el navegador al volver de Google.
function pagina({ icono, titulo, mensaje, nota, tono }) {
  const acento = tono === "error" ? "#e8663d" : tono === "aviso" ? "#e0a13a" : "#22a06b";
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titulo}</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
    font-family: ui-sans-serif, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: #f4f5f7; color: #16181d;
  }
  .card {
    width: min(480px, 100%); background: #fff; border-radius: 20px; padding: 44px 36px 38px;
    text-align: center; box-shadow: 0 1px 2px rgba(16,18,29,.06), 0 12px 40px rgba(16,18,29,.10);
    animation: entrar .45s cubic-bezier(.2,.8,.3,1) both;
  }
  .icono {
    width: 76px; height: 76px; margin: 0 auto 22px; border-radius: 50%;
    display: grid; place-items: center; font-size: 36px; line-height: 1;
    background: color-mix(in srgb, ${acento} 14%, transparent);
    animation: latir .5s .15s cubic-bezier(.2,.8,.3,1) both;
  }
  h1 { margin: 0 0 10px; font-size: 25px; letter-spacing: -.02em; }
  p { margin: 0; font-size: 16px; line-height: 1.55; color: #5a6072; }
  .nota {
    margin-top: 26px; padding-top: 20px; border-top: 1px solid #e8eaef;
    font-size: 14px; color: #7a8194;
  }
  @keyframes entrar { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
  @keyframes latir { from { transform: scale(.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @media (prefers-reduced-motion: reduce) { .card, .icono { animation: none } }
  @media (prefers-color-scheme: dark) {
    body { background: #0e1014; color: #edeef2; }
    .card { background: #191c22; box-shadow: 0 12px 40px rgba(0,0,0,.45); }
    p { color: #a2a9ba; }
    .nota { border-top-color: #272b34; color: #868da0; }
  }
</style></head>
<body><main class="card">
  <div class="icono">${icono}</div>
  <h1>${titulo}</h1>
  <p>${mensaje}</p>
  ${nota ? `<p class="nota">${nota}</p>` : ""}
</main></body></html>`;
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
      pagina({
        icono: "🔒",
        titulo: "Google todavía no habilitó tu cuenta",
        mensaje:
          "La app del taller está en modo prueba, así que Google solo deja entrar a las cuentas cargadas de antemano.",
        nota: "Pedile a quien da el taller que agregue tu correo, y volvemos a intentar. Ya podés cerrar esta pestaña.",
        tono: "aviso",
      }),
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
    res.end(
      pagina({
        icono: "🤔",
        titulo: "Algo se cruzó en el camino",
        mensaje: "La respuesta de Google no llegó completa, así que no pudimos conectar tu calendario.",
        nota: "Cerrá esta pestaña y avisale al asistente del taller: lo intenta de nuevo en un segundo.",
        tono: "error",
      }),
    );
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
    res.end(
      pagina({
        icono: "🔁",
        titulo: "Casi, pero falta un permiso",
        mensaje: "Google no nos dio el permiso duradero que tu agente necesita para mirar tu agenda cada mañana.",
        nota: "Cerrá esta pestaña y avisale al asistente del taller: lo intenta de nuevo.",
        tono: "aviso",
      }),
    );
    console.error("Google no devolvió refresh_token:", JSON.stringify(tokens).slice(0, 300));
    server.close();
    process.exit(1);
  }

  guardarEnEnv("GOOGLE_REFRESH_TOKEN", tokens.refresh_token);
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(
    pagina({
      icono: "📅",
      titulo: "¡Tu calendario quedó conectado!",
      mensaje:
        "Tu agente ya puede mirar tu agenda para encontrarte huecos libres y anotarte los bloques de trabajo.",
      nota: "Podés cerrar esta pestaña y volver al taller. Te esperamos ahí.",
      tono: "ok",
    }),
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
