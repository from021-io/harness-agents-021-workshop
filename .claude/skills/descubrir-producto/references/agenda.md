# Referencia de producto: agente de agenda

Leé esta referencia únicamente cuando el producto elegido sea un agente de agenda.

## Promesa disponible

Cada día el agente combina una lista de pendientes con Google Calendar, propone un bloque de foco que no pisa eventos y crea el evento solo después de que la persona acepta.

## Información que el brief debe resolver

- Nombre, actividad y contexto cotidiano de la persona.
- Dos o tres pendientes reales que permitan personalizar la primera experiencia.
- Horario del mensaje diario.
- Franja preferida y duración habitual de un bloque de foco.
- Ubicación declarada y zona horaria detectada por la computadora.
- Tono del agente.
- Qué necesita confirmar la persona antes de crear un evento.

No conviertas estos puntos en preguntas obligatorias. Inferí lo posible, proponé valores razonables y preguntá solo por los huecos que cambian el resultado.

## Alcance de la V1

Incluye leer el backlog, consultar eventos, proponer un bloque y crear un evento confirmado. No incluye administrar equipos, coordinar múltiples asistentes, mover eventos existentes ni gestionar varios calendarios.

## Cuidados

- Nunca crear un evento sin confirmación.
- Nunca proponer un horario que pise un evento existente.
- Si Calendar no conecta, ofrecer una propuesta y un enlace para agregarla manualmente.

## Criterios de aceptación útiles

- Con pendientes y eventos para hoy, propone una tarea prioritaria dentro de un hueco real.
- Ante una confirmación, crea un evento con título, horario y detalle correctos.
- Ante un rechazo, no modifica el calendario y ofrece una alternativa.
