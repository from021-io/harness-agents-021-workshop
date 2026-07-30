---
name: crear-agente
description: Flujo completo del taller para crear el agente personal del usuario. Entrevista de producto (ai-pm), construcción y personalización (ai-engineer), y prueba en vivo. Usar cuando el usuario escribe /crear-agente o dice que quiere crear/empezar su agente.
---

# /crear-agente: el flujo del taller

Orquestá el taller de punta a punta. El usuario no es técnico; las reglas del CLAUDE.md raíz aplican siempre.

## Pasos

1. **Apertura** (2 oraciones máximo): arrancá con "¡Hola!" (nunca "bienvenido/bienvenida" ni nada con género, todavía no sabés quién es) y contá qué va a pasar: "te hago unas preguntas, después armo yo todo lo técnico, y en unos minutos estás probando tu agente por Telegram".
2. **Arrancá la pre-instalación en background AHORA** para ganar tiempo: `npm install` en `templates/agente-a-agenda` y `templates/agente-b-noticias` (si no tienen `node_modules` ya). Corre mientras dura la entrevista.
3. **Lanzá el subagente `ai-pm`** para la conversación de descubrimiento. Esperá su salida: `mi-agente/PRODUCTO.md`. OJO: los subagentes son maquinaria interna: para el usuario todo esto es UNA misma persona hablándole; jamás anuncies "ahora te paso con..." ni nombres roles.
4. **La construcción la hacés VOS, en este mismo hilo. NO la delegues a un subagente.** Leé `.claude/agents/ai-engineer.md` y seguí ese playbook al pie de la letra. Motivo: la construcción tarda varios minutos y lo que escribe un subagente no le llega al usuario, así que delegarla lo deja mirando una pantalla muda. Trabajando acá, cada cosa que contás le llega en vivo.
5. **La sorpresa**: con el agente probado, corré el skill `pitch`. Una pregunta divertida (fruta favorita, destino soñado…) y armás su mini deck HTML de 5 slides tematizado con la respuesta. Se lo mostrás en el navegador.
6. **Cierre**: contale al usuario en 3 líneas qué tiene ahora, mostrá el contenido de `DECISIONES.md`, guardá su avance en su GitHub, deck incluido (commit de `mi-agente/` + push a su fork, verificando antes que ningún secreto entre al commit; explicalo como "guardé tu agente en tu GitHub"), y decile que cuando quiera lo publica con `/publicar` para que funcione solo todos los días.

## Si algo ya existe

- Si `mi-agente/PRODUCTO.md` ya existe, preguntale si quiere seguir con ese agente (retomar donde quedó) o empezar de nuevo (borrar `mi-agente/` y arrancar limpio).
- Si el server de un intento anterior quedó corriendo en el puerto 3000, matalo antes de levantar el nuevo.
