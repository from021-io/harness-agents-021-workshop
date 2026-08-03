---
name: crear-agente
description: Flujo completo del taller para crear el agente personal del usuario. Entrevista de producto (ai-pm), construcción y personalización (ai-engineer), y prueba en vivo. Usar cuando el usuario escribe /crear-agente o dice que quiere crear/empezar su agente.
---

# /crear-agente: el flujo del taller

Orquestá el taller de punta a punta. El usuario no es técnico; las reglas del CLAUDE.md raíz aplican siempre.

## Pasos

1. **Apertura** (2 oraciones máximo): arrancá con "¡Hola!" (nunca "bienvenido/bienvenida" ni nada con género, todavía no sabés quién es) y contá qué va a pasar: "te hago unas preguntas, después armo yo todo lo técnico, y en unos minutos estás probando tu agente por Telegram".
2. **Arrancá la pre-instalación en background AHORA** para ganar tiempo: `npm install` en los tres templates (`agente-a-agenda`, `agente-b-noticias`, `herramienta-interna`), si no tienen `node_modules` ya. Corre mientras dura la entrevista.
3. **TODO el taller lo hacés VOS, en este mismo hilo. NO delegues nada a subagentes.** Los `.claude/agents/*.md` son playbooks para que los leas y los sigas, no agentes para lanzar. Motivo: cuando delegás, al usuario le aparece una caja "Message from ai-pm / ai-engineer" con el monólogo interno adentro, y después vos se lo repetís abajo. Eso destruye la ilusión de una sola voz (regla 3 del CLAUDE.md raíz), muestra jerga interna y duplica todo.
4. **La conversación de descubrimiento**: leé `.claude/agents/ai-pm.md` y seguí ese playbook acá mismo. La primera pregunta bifurca el taller entre los dos agentes y la herramienta para su trabajo. Salida: `mi-agente/PRODUCTO.md`.
5. **La construcción**: leé `.claude/agents/ai-engineer.md` y seguí ese playbook acá mismo, narrando y enseñando en vivo como dice ahí.
6. **La sorpresa**: con el agente probado, seguí el skill `pitch`. Una pregunta divertida (fruta favorita, destino soñado…) y armás su mini deck HTML de 5 slides tematizado con la respuesta. Se lo mostrás en el navegador.
7. **Preguntá por los permisos** (solo si conectó Google Calendar; en el camino herramienta no aplica): "¿querés que tu agente siga con acceso a tu calendario, o preferís que se lo saque ahora?". Neutral, sin empujar para ningún lado: hay gente que lo probó por curiosidad y no quiere dejar permisos dados sobre su cuenta, y otra que lo va a seguir usando. Si dice que sí, seguí el skill `desconectar`. Si dice que no, contale en una línea que puede hacerlo cuando quiera con `/desconectar`.
8. **Cierre**: contale al usuario en 3 líneas qué tiene ahora, mostrá el contenido de `DECISIONES.md`, guardá su avance en su GitHub, deck incluido (commit de `mi-agente/` + push a su fork, verificando antes que ningún secreto entre al commit; explicalo como "guardé tu agente en tu GitHub"), y decile que cuando quiera lo publica con `/publicar` para que funcione solo todos los días.

## Si algo ya existe

- Si `mi-agente/PRODUCTO.md` ya existe, preguntale si quiere seguir con ese agente (retomar donde quedó) o empezar de nuevo (borrar `mi-agente/` y arrancar limpio).
- Si el server de un intento anterior quedó corriendo en el puerto 3000, matalo antes de levantar el nuevo.
