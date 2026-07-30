---
name: crear-agente
description: Flujo completo del taller para crear el agente personal del usuario. Entrevista de producto (ai-pm), construcción y personalización (ai-engineer), y prueba en vivo. Usar cuando el usuario escribe /crear-agente o dice que quiere crear/empezar su agente.
---

# /crear-agente — el flujo del taller

Orquestá el taller de punta a punta. El usuario no es técnico; las reglas del CLAUDE.md raíz aplican siempre.

## Pasos

1. **Bienvenida** (2 oraciones máximo): qué va a pasar — "te hago unas preguntas, después lo armo yo, y en unos minutos lo estás probando".
2. **Arrancá la pre-instalación en background AHORA** para ganar tiempo: `npm install` en `templates/agente-a-agenda` y `templates/agente-b-noticias` (si no tienen `node_modules` ya). Corre mientras dura la entrevista.
3. **Lanzá el subagente `ai-pm`** para la entrevista. Esperá su salida: `mi-agente/PRODUCTO.md`.
4. **Lanzá el subagente `ai-engineer`** con el brief. Él copia el template, personaliza, pide las credenciales (llave del modelo, bot de Telegram, y Google solo si es el agente de agenda), verifica todo y abre el preview.
5. **Cierre**: contale al usuario en 3 líneas qué tiene ahora, mostrá el contenido de `DECISIONES.md`, y deciles que cuando quiera lo publica con `/publicar` para que funcione solo todos los días.

## Si algo ya existe

- Si `mi-agente/PRODUCTO.md` ya existe, preguntale si quiere seguir con ese agente (retomar donde quedó) o empezar de nuevo (borrar `mi-agente/` y arrancar limpio).
- Si el server de un intento anterior quedó corriendo en el puerto 3000, matalo antes de levantar el nuevo.
