---
name: modificar-agente
description: Modifica un agente o herramienta existente sin reconstruirlo desde cero. Usar cuando la persona pide cambiar comportamiento, horario, tono, fuentes, campos, etapas, instrucciones, herramientas o cualquier capacidad de `mi-agente/`, y cuando escribe `/modificar-agente`. Descubre primero el cambio, conserva lo que funciona, implementa el delta mínimo y lo verifica con criterios de aceptación.
---

# /modificar-agente

Aplicá un cambio seguro y verificable sobre `mi-agente/`. Las reglas del `CLAUDE.md` raíz siguen vigentes.

## 1. Comprobar que existe un producto

Verificá que existan `mi-agente/` y `mi-agente/PRODUCTO.md`.

- Si no existen, explicá que todavía no hay algo que modificar y seguí `/crear-agente`.
- Si el pedido reemplaza por completo el producto, proponé crear uno nuevo en vez de deformar el existente.

## 2. Definir el cambio

Seguí la skill `descubrir-producto` en modo modificación. Debe inspeccionar el estado actual antes de preguntar y crear un archivo pendiente bajo `mi-agente/cambios/`.

No empieces a editar mientras el resultado buscado o los criterios de aceptación sean ambiguos.

## 3. Implementar el delta

Leé `.claude/agents/ai-engineer.md` y seguí solamente su sección "Modo modificación".

Reglas:

- No copies nuevamente un template.
- No reemplaces `.env`, credenciales, datos ni decisiones existentes.
- Tocá la menor cantidad de archivos que permita cumplir el cambio.
- Conservá explícitamente todo lo listado en "Se conserva".
- Si el pedido excede el motor de la V1, implementá el recorte acordado y dejá el resto fuera de alcance.

## 4. Verificar

Probá primero los criterios de aceptación del cambio. Después ejecutá las verificaciones base del tipo de producto:

- Agentes: typecheck, health, prueba interna y Telegram si el cambio afecta el canal.
- Agenda: además, lectura real de Calendar si el cambio la toca.
- Noticias: además, noticias reales si el cambio toca tema o fuentes.
- Herramienta: validar especificación, typecheck, carga, persistencia y asistente si fue afectado.

No uses un mensaje del usuario en Telegram como prueba técnica inicial.

## 5. Consolidar

Solo después de verificar:

1. Actualizá `PRODUCTO.md` para que describa el comportamiento vigente.
2. Cambiá el estado del archivo de cambio de `Pendiente` a `Aplicado`.
3. Agregá a `DECISIONES.md` qué cambió y por qué, sin jerga.
4. Guardá el avance en el GitHub del participante sin incluir `.env`.

## Cierre

Contá en tres líneas qué cambió, qué se conservó y cómo se comprobó. Si quedó algo fuera de alcance, nombralo sin presentarlo como un fallo.
