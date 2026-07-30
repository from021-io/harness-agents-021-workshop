---
name: arreglar
description: Rescate rápido cuando el agente del usuario dejó de responder por Telegram o algo quedó colgado. Reinicia el servidor y el puente en limpio y verifica que todo vuelva a andar. Usar cuando el usuario dice que no le contesta, que se colgó, o que no pasa nada.
---

# /arreglar: destrabar el agente

Cuando el usuario dice "no me responde", "se colgó" o "no pasa nada", no investigues delante suyo: reiniciá todo en limpio, que resuelve casi todos los casos del taller. Reglas del CLAUDE.md raíz aplican (nada de errores crudos, una sola voz).

Decile una línea tipo "dame diez segundos que lo despierto" y hacé esto:

## Pasos

1. **Matá todo lo viejo**: el servidor (`lsof -ti:3000 -ti:3001 | xargs kill`) y el puente (`pkill -f telegram-local`). Esperá a que los puertos queden libres de verdad; si no, Next arranca en otro puerto y el puente le habla al vacío.
2. **Levantá el servidor**: `npm run dev` en `mi-agente/` en background. Esperá health ok (hasta ~40s).
3. **Levantá el puente**: `npm run telegram-local` en background. Confirmá en su salida que encontró el agente.
4. **Probá vos primero** por la API interna (`POST /eve/v1/session`) que el agente responde y que sus herramientas andan. No le pidas al usuario que pruebe algo que no probaste.
5. **Avisale**: "listo, ya está de nuevo en línea. Escribile por Telegram". Si venía de una conversación trabada, pedile que le mande un mensaje nuevo en vez de responder al viejo.

## Causas conocidas (revisalas vos, no las narres)

- El servidor se reinició y quedó en el puerto 3001 mientras el puente apuntaba al 3000.
- Se agregó algo al `.env` sin reiniciar el servidor: el agente actúa como si esa credencial no existiera.
- Quedó una conversación esperando el toque de un botón que ya no existe (por eso los agentes preguntan a texto abierto).
- El puente murió o nunca arrancó: sin él, el bot no contesta lo que le escriben.
