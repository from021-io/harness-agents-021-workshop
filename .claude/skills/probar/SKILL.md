---
name: probar
description: Levanta el agente del usuario en local, abre el preview y dispara el envío del día para verlo funcionando ya. Usar cuando el usuario escribe /probar o pide ver/probar su agente.
---

# /probar — ver el agente funcionando

Todo lo hacés vos; el usuario solo mira y chatea. Reglas del CLAUDE.md raíz aplican.

## Pasos

1. Verificá que `mi-agente/` existe y tiene `.env` con la llave del modelo. Si no, decile que primero corra `/crear-agente`.
2. Si el server no está corriendo: `npm run dev` en `mi-agente/` en background. Esperá a que `curl http://localhost:3000/eve/v1/health` responda ok (hasta ~40s).
3. Si el puente de Telegram no está corriendo: `npm run telegram-local` en background (hace que el bot conteste por Telegram sin estar publicado).
4. Abrí el preview con las herramientas de browser en `http://localhost:3000`.
5. **Decile explícito cómo probar**: "agarrá el celular y escribile a tu bot — pedile *mandame el resumen de hoy* o preguntale lo que quieras; también podés chatear acá en el navegador". Avisá que por Telegram tarda unos segundos en contestar. NO dispares vos el envío a su Telegram: la gracia es que él le pida a su bot.
6. Si algo no llega o no contesta: revisá los logs del server y del puente vos, arreglá, volvé a probar. El disparo manual del schedule (`curl -X POST http://localhost:3000/eve/v1/dev/schedules/<nombre>`) es solo para debuggear el envío automático, no para la demo. Nunca le muestres el error crudo.

## Recordatorios

- Los envíos programados no corren solos en la compu: solo cuando el agente esté publicado van a salir todos los días a su hora.
- El bot contesta por Telegram gracias al puente local; si la compu se cierra, deja de contestar. Para que viva solo, 24/7: `/publicar`.
