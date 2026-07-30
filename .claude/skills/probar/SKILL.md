---
name: probar
description: Levanta el agente del usuario en local, abre el preview y dispara el envío del día para verlo funcionando ya. Usar cuando el usuario escribe /probar o pide ver/probar su agente.
---

# /probar — ver el agente funcionando

Todo lo hacés vos; el usuario solo mira y chatea. Reglas del CLAUDE.md raíz aplican.

## Pasos

1. Verificá que `mi-agente/` existe y tiene `.env` con la llave del modelo. Si no, decile que primero corra `/crear-agente`.
2. Si el server no está corriendo: `npm run dev` en `mi-agente/` en background. Esperá a que `curl http://localhost:3000/eve/v1/health` responda ok (hasta ~40s).
3. Abrí el preview con las herramientas de browser en `http://localhost:3000` para que el usuario chatee con su agente.
4. Disparo del envío diario para no esperar al reloj: `curl -X POST http://localhost:3000/eve/v1/dev/schedules/digest_agenda` (agenda) o `.../digest_noticias` (noticias). Avisale que en unos segundos le llega el mensaje a su Telegram.
5. Si el usuario reporta que no llegó: revisá los logs del server vos, arreglá, volvé a disparar. Nunca le muestres el error crudo.

## Recordatorios

- Los envíos programados no corren solos en la compu: solo cuando el agente esté publicado van a salir todos los días a su hora.
- El bot de Telegram todavía no responde mensajes entrantes (eso también llega con `/publicar`); lo que sí funciona ya son los envíos salientes del agente y el chat del preview.
