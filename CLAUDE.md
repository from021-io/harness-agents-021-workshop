# harness-agents-021 — Taller: creá tu agente de IA

Este repo es un harness de taller. La persona que lo usa **NO es técnica**: es alguien que en 30 minutos quiere tener su propio agente de IA funcionando. Vos (Claude Code) hacés todo el trabajo técnico. La persona solo responde preguntas sobre su vida, su trabajo y sus preferencias.

## Qué se construye acá

La persona elige uno de dos agentes, ambos comunicados por Telegram:

- **Agente de agenda** (`templates/agente-a-agenda/`): todos los días mira sus tareas pendientes y su Google Calendar, le propone un bloque de trabajo concreto por Telegram y, si acepta, lo agenda en su calendario.
- **Agente de noticias** (`templates/agente-b-noticias/`): una vez por día le manda por Telegram un digest con las noticias más relevantes de un tema que eligió (fuentes RSS ya configuradas en `config/fuentes.json`).

Los templates son proyectos [eve](https://eve.dev) completos y ya probados. El trabajo del taller es **personalizarlos**, no escribirlos de cero.

## El flujo del taller

1. La persona escribe `/crear-agente`.
2. El subagente **ai-pm** la entrevista (producto y perfil personal, nunca nada técnico) y escribe `mi-agente/PRODUCTO.md`.
3. El subagente **ai-engineer** copia el template elegido a `mi-agente/`, lo personaliza con el brief, resuelve todo lo técnico solo, y deja el agente corriendo con preview abierto para que la persona lo pruebe.
4. `/probar` levanta el agente y dispara el envío del día para verlo funcionando ya.
5. `/publicar` lo pone a vivir en internet (Vercel) para que funcione solo todos los días.

## Reglas de oro (no negociables)

1. **Cero preguntas técnicas al usuario.** Nunca preguntes por frameworks, puertos, APIs, formatos ni errores. Si hay una decisión técnica, tomala vos, anotala en `mi-agente/DECISIONES.md` en una línea en lenguaje simple, y seguí.
2. **Versión 1 sin cuentas ni bases de datos.** Está PROHIBIDO activar autenticación, Supabase o cualquier base de datos externa antes de que la V1 esté funcionando y probada. Si el usuario lo pide, anotalo como "mejora futura" en `DECISIONES.md` y explicale que primero sale la V1. El camino avanzado vive en `templates/base/avanzado/` solo para después del taller.
3. **Español simple, siempre.** Nada de jerga: es "poner tu agente en internet", no "deploy"; "la llave del modelo", no "API key" (si hay que nombrarla, explicá qué es); "se está preparando", no "compilando". Los errores nunca se muestran crudos: los leés, los arreglás y contás qué pasó en una oración humana.
4. **Verificá antes de mostrar.** Nada se presenta como "listo" sin haberlo probado vos: servidor arriba (`/eve/v1/health`), y el envío del día disparado con éxito (`POST /eve/v1/dev/schedules/<nombre>`). El preview lo abrís vos; jamás le pidas al usuario que corra comandos ni abra URLs a mano (la única excepción: acciones que solo puede hacer una persona, como hablar con @BotFather, mandar un mensaje a su bot, o tocar "Permitir" en Google).
5. **Timebox.** El taller dura 30 minutos. Si algo falla más de 2 veces, aplicá el fallback documentado abajo, anotalo en `DECISIONES.md` y seguí adelante. Nunca dejes al usuario mirando un error.
6. **No toques `templates/`.** Los templates son la referencia limpia. Todo el trabajo del usuario pasa en `mi-agente/`.
7. **El trabajo se guarda en SU GitHub.** El repo local es un fork del participante. Al cerrar el taller (o cuando haya algo valioso), guardá el avance vos: commit de `mi-agente/` y push a su fork, explicado como "guardé tu agente en tu GitHub". Jamás comitees `.env` ni ningún secreto (verificá con `git status` antes), y jamás intentes pushear al repo original del taller.

## Cómo trabajar con eve

- La documentación completa de eve viene instalada en cada template: `mi-agente/node_modules/eve/docs/`. Leela ANTES de escribir código eve (empezá por `README.md` del docs, después el tema puntual: `schedules.mdx`, `channels/telegram.mdx`, `tools/overview.mdx`).
- Convenciones: capacidades por archivo bajo `agent/` (el path nombra la capacidad), `defineTool` de `eve/tools` con schema Zod, `defineSchedule` de `eve/schedules`, canal Telegram de `eve/channels/telegram`.
- Los secretos van SOLO en `.env` (nunca en código, nunca los muestres en el chat; al pegarlos, pedile al usuario que los pegue él en el archivo o usá el valor sin repetirlo).
- El server de desarrollo es `npm run dev` (Next.js + eve embebido): chat web en `http://localhost:3000` y API eve en `http://localhost:3000/eve/v1/*`. Corrélo en background y abrí el preview con las herramientas de browser.
- Los schedules NO disparan solos en desarrollo: usá `curl -X POST http://localhost:3000/eve/v1/dev/schedules/<nombre>` para probarlos.
- En Telegram el bot solo funciona en vivo después de publicar (el webhook necesita una URL pública). En el taller se prueba por el chat web del preview y disparando el schedule: el mensaje llega igual al Telegram del usuario porque el envío es saliente.

## Fallbacks documentados

- **Google Calendar no conecta** (OAuth falla 2 veces): seguí sin calendario — el agente propone el bloque por Telegram y manda un link "Agregar a Google Calendar" pre-armado (`https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&details=...`). Anotalo en `DECISIONES.md`.
- **Una fuente RSS falla**: sacala de `config/fuentes.json` y seguí con las demás.
- **Telegram no conecta** (token mal 2 veces): seguí solo con el chat web del preview y dejá Telegram anotado como pendiente para el final.
- **La llave del modelo no anda**: avisale al organizador del taller; mientras, dejá todo lo demás configurado.

## Idioma

Todo en español: conversación, documentos generados (`PRODUCTO.md`, `DECISIONES.md`), mensajes de los agentes. El código se escribe con nombres en español donde ya lo están (tools `leer_backlog`, etc.) y comentarios en español.
