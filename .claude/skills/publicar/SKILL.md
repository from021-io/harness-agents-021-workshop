---
name: publicar
description: Pone el agente del usuario a vivir en internet (Vercel) para que funcione solo todos los días, y deja el bot de Telegram respondiendo. Usar cuando el usuario escribe /publicar o pide publicar/activar su agente.
---

# /publicar: poner el agente en internet

Explicáselo así: "hasta ahora tu agente vive en tu compu; con esto lo mudamos a internet para que trabaje solo todos los días, aunque tu compu esté apagada". Reglas del CLAUDE.md raíz aplican: cero jerga, errores los resolvés vos.

## Requisito humano (el único)

Cuenta gratuita de Vercel: debería haberla creado en la preparación previa al taller. Confirmá que la tiene; si no, mandalo a vercel.com/signup, que toque "Continue with Google", y esperá a que la tenga (1 minuto).

## Pasos (los hacés vos, en `mi-agente/`)

1. `npm run typecheck` y verificación local rápida antes de publicar. Si algo se rompió, arreglalo primero.
2. `npx vercel login`: se abre el navegador, el usuario toca confirmar. Explicale solo eso.
3. `npx vercel link --yes` para vincular el proyecto (aceptá defaults, nombre = su agente).
4. Subí las variables del `.env` al proyecto con `npx vercel env add <NOMBRE> production` para cada una (leé los valores del `.env` local, no se los pidas de nuevo, no los muestres).
5. Deploy a producción: `npx vercel --prod`. Guardá la URL final.
6. Verificá: `curl https://<url>/eve/v1/health` responde ok.
7. **Si es una herramienta** (existe `mi-agente/config/espec.json`), saltá los dos pasos de Telegram y andá directo a "Proteger la herramienta publicada". Si es un agente, seguí normal.
8. **Frená el puente local**: si `npm run telegram-local` sigue corriendo, matalo AHORA (pelea con el webhook: Telegram no permite polling y webhook a la vez).
9. **Activá el bot de Telegram** registrando el webhook (leé token y secreto del `.env`):
   ```
   curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url":"https://<url>/eve/v1/telegram","secret_token":"<TELEGRAM_WEBHOOK_SECRET_TOKEN>","allowed_updates":["message","callback_query"]}'
   ```
   Confirmá que devuelve `"ok":true`.
10. **Prueba final en vivo**: decile que le escriba a su bot por Telegram ("preguntale qué sabe hacer"). Confirmá que respondió. Después contale que el envío diario va a llegar solo a la hora que eligió (los relojes de internet corren en hora universal: el horario ya quedó convertido).
11. Anotá en `DECISIONES.md`: la dirección donde vive el agente o la herramienta, y la fecha de publicación.

## Proteger la herramienta publicada (camino herramienta)

La URL de producción de Vercel es pública por defecto. La herramienta usa el asistente desde el navegador, así que **si la dejás abierta, cualquiera que encuentre la dirección puede usar la IA con la llave del modelo**. No se publica sin resolver esto. En orden:

1. **Protección de Vercel**: en el panel del proyecto, Settings → Deployment Protection → activar **Vercel Authentication** para producción. Cero código y solo entra quien tenga sesión en esa cuenta. Es lo ideal para una herramienta interna. Si el plan gratuito no lo permite para producción, pasá a la opción 2.
2. **Clave de acceso**: generá una contraseña, cargala como `CLAVE_ACCESO` en las variables del proyecto y protegé la ruta del agente siguiendo `mi-agente/node_modules/eve/docs/guides/auth-and-route-protection.md`. Decile la clave al usuario una vez y que la guarde.
3. **Publicar con el asistente apagado**: si ninguna de las dos sale en dos intentos, sacá el panel del asistente y publicá igual. La herramienta sigue siendo útil (los datos son del navegador) y el usuario se lleva algo funcionando. Anotalo en `DECISIONES.md` como pendiente.

Verificá que quedó cerrado: un `curl -s -o /dev/null -w "%{http_code}" https://<url>/eve/v1/session -X POST` desde afuera no debe devolver 200.

Explicáselo en una línea: "tu herramienta ya está en internet y solo entrás vos".

## Si algo falla

- Deploy falla 2 veces: revisá logs con `npx vercel logs`, arreglá y reintentá. Al usuario: "estoy ajustando un detalle de la mudanza a internet".
- El webhook no registra: revisá que la URL sea la de producción y el secreto coincida con el `.env`.
- Nunca dejes al usuario sin cierre: si no sale hoy, dejá el agente local funcionando y explicá qué falta con una oración.
