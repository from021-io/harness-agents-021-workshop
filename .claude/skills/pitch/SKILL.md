---
name: pitch
description: Genera el mini deck de presentación (HTML, máx 5 slides) del agente que el usuario construyó, tematizado con un dato personal sorpresa (su fruta favorita, destino soñado, etc.). Usar en el cierre de /crear-agente antes de /publicar, o cuando el usuario pida su deck/presentación/pitch.
---

# /pitch — el deck sorpresa del agente

Regalo de cierre del taller: una mini presentación del agente que la persona acaba de crear, para mostrarla en el evento o compartirla. Reglas del CLAUDE.md raíz aplican (una sola voz, español simple, cero preguntas técnicas).

## Pasos

1. **La sorpresa**: anunciale que hay un regalo antes de publicar, y hacele UNA pregunta rara y divertida para tematizarlo, sin explicar todavía para qué es. Elegí vos una (o inventá del mismo estilo): "¿cuál es tu fruta favorita?", "¿tu destino soñado de vacaciones?", "¿tu comida de domingo?", "¿un animal que te represente?". Una sola, respuesta libre, chat normal.
2. **Armá el deck** en `mi-agente/pitch/index.html`, un solo archivo autocontenido (CSS y JS inline, sin librerías externas, funciona abierto con doble click):
   - **Máximo 5 slides**, navegación con flechas del teclado, click/tap y puntitos de progreso. Tipografía grande, una idea por slide.
   - **Tema visual = su respuesta**: paleta de colores, emojis y algún detalle gracioso derivados de la fruta/destino/lo que haya dicho (frutilla → rojos y rosas con semillas de fondo; Japón → rojo/blanco con un torii). Que se note el guiño sin ser un chiste largo.
   - **Contenido desde `PRODUCTO.md` y `DECISIONES.md`** (nunca inventes capacidades que el agente no tiene):
     1. Portada: nombre del agente (inventale uno con gracia si no tiene), "el asistente de [nombre]", fecha del taller.
     2. El problema: su día a día, en sus palabras (del brief).
     3. Qué hace: las 2-3 capacidades reales, en beneficios ("te propone el mejor hueco del día", no "usa la API de Calendar").
     4. Cómo funciona, simple: le hablás por Telegram · trabaja solo todos los días a las [hora] · decide con IA usando tus [tareas/fuentes].
     5. Lo que viene: publicarlo hoy + las mejoras futuras del brief.
3. **Mostralo**: abrilo vos en el navegador (herramientas de browser, `file://` o servido) y contale la sorpresa: "tu agente ya tiene su propia presentación — pasá los slides con las flechas". Es SU deck para mostrar al grupo.
4. **Guardalo**: el deck entra en el commit/push a su GitHub junto con el resto (regla 8 del CLAUDE.md).

## Cuándo corre

- En el cierre de `/crear-agente`: después del momento "probalo" y ANTES de guardar en GitHub y ofrecer `/publicar`.
- Suelto, si el usuario pide "mi deck / presentación / pitch". Si no existe `mi-agente/PRODUCTO.md`, decile que primero hay que crear el agente.
- Es rápido: no más de 2-3 minutos de armado. Si el tiempo del taller no da, se ofrece como paso post-publicación, no se sacrifica la publicación por el deck.
