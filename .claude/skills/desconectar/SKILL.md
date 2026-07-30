---
name: desconectar
description: Corta los permisos que el agente tiene sobre las cuentas del usuario (Google Calendar, bot de Telegram) y le explica cómo quedarse tranquilo. Usar en el cierre del taller si el usuario no quiere seguir usando su agente, o cuando pida desconectar, revocar, sacar permisos o borrar sus datos.
---

# /desconectar: sacarle los permisos al agente

Se usa cuando la persona quiere cortar el acceso a sus cuentas, típicamente al terminar el taller si no va a seguir usando el agente. Reglas del CLAUDE.md raíz aplican: lenguaje simple, lo hacés vos, nada de errores crudos.

Preguntale primero qué quiere cortar (a texto abierto, no listes tecnicismos): el calendario, el bot de Telegram, o todo.

## Google Calendar

1. Corré `npm run desconectar-google` en `mi-agente/`. Le avisa a Google que revoque el permiso y lo borra del `.env`.
2. Contale qué pasó: "listo, tu agente ya no puede ver ni tocar tu calendario".
3. Si quiere verlo con sus ojos, pasale el link donde Google lista los permisos dados: [myaccount.google.com/permissions](https://myaccount.google.com/permissions). Ahí puede confirmar que la app del taller ya no figura.

## Bot de Telegram

El bot es suyo y solo le habla a él, así que no hay riesgo real, pero si lo quiere borrar: en Telegram, @BotFather → `/deletebot` → elegir su bot → confirmar escribiendo el nombre. Explicale que después de eso el bot deja de existir para siempre.

## Cerrar el resto

- Frená lo que quedó corriendo en su compu: el servidor y el puente de Telegram.
- Si publicó el agente en internet y ya no lo quiere: contale que puede borrar el proyecto desde su cuenta de Vercel, o dejalo (no gasta nada). Si prefiere que lo hagas vos, borralo con `npx vercel remove <nombre> --yes`.
- Sus archivos (incluido el `.env`) quedan en su compu y en su GitHub. Recordale que el `.env` nunca se subió: los secretos quedaron solo en su máquina.

## Si quiere seguir usándolo

No insistas con desconectar. Recordale en una línea que puede hacerlo cuando quiera escribiendo `/desconectar`, y que el permiso de Google también se corta desde su cuenta de Google.
