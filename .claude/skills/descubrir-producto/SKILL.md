---
name: descubrir-producto
description: Descubre y define un producto con IA antes de construirlo o modificarlo. Usar cuando alguien quiere crear un agente, cambiar un agente existente, aclarar alcance, convertir una necesidad en un brief, definir una V1 o acordar criterios de aceptación. Inspecciona primero el producto existente cuando lo haya y carga referencias específicas solo para el tipo de solución elegido.
---

# Descubrir producto

Convertí una necesidad expresada en palabras comunes en un contrato de producto claro. No escribas código ni tomes decisiones de implementación durante esta etapa.

## Principios

- Hablá como una sola persona que acompaña al usuario. No menciones roles internos ni delegues la conversación.
- Preguntá por el trabajo, el resultado y los límites. Nunca preguntes por frameworks, APIs, puertos o formatos técnicos.
- Conversá. Hacé una o dos preguntas por vez y proponé opciones concretas cuando ayuden a decidir rápido.
- No recorras una lista fija. Preguntá únicamente por la información que todavía falte.
- Proponé una V1 pequeña y verificable. Lo demás va a mejoras futuras.
- No prometas capacidades que el constructor disponible no pueda entregar.
- Cerrá con criterios observables. Evitá criterios vagos como "que funcione bien".

## 1. Determinar el modo

Usá el modo indicado por el comando que invocó esta skill. Si se invocó directamente:

- **Creación**: no existe un producto y la persona quiere definir uno nuevo.
- **Modificación**: ya existe un producto y la persona quiere cambiar su comportamiento, información, interfaz o alcance.

Si no está claro, preguntá solamente eso. No empieces todavía la entrevista de producto.

## 2. Construir contexto antes de preguntar

### Creación

Leé las restricciones y capacidades que haya provisto el flujo que llamó esta skill. Si el flujo ofrece un catálogo cerrado, presentalo en beneficios y dejá que la persona elija. Si no hay catálogo, descubrí el problema sin forzarlo a una categoría anticipadamente.

### Modificación

Antes de hacer preguntas, inspeccioná el producto existente:

1. `mi-agente/PRODUCTO.md`.
2. `mi-agente/DECISIONES.md`.
3. Las instrucciones, herramientas, schedules y configuración relevantes.
4. El último cambio pendiente bajo `mi-agente/cambios/`, si existiera.

Resumí en dos o tres líneas qué hace hoy. Después preguntá qué resultado quiere cambiar. No le pidas que vuelva a explicar información que ya está escrita.

## 3. Descubrir las decisiones necesarias

Completá solamente los huecos relevantes de este mapa:

- **Persona y contexto**: quién usa el producto y en qué situación.
- **Problema actual**: qué sucede hoy y por qué importa.
- **Resultado esperado**: qué debería ser diferente cuando el producto funcione.
- **Flujo principal**: qué dispara la experiencia y qué recibe la persona.
- **Entradas**: datos o contexto que el agente necesita.
- **Acciones**: qué puede consultar, proponer o ejecutar.
- **Autonomía y confirmación**: qué puede hacer solo y qué exige aprobación humana.
- **Límites y cuidados**: datos sensibles, errores costosos y comportamientos prohibidos.
- **Preferencias**: horario, tono, volumen, estilo o formato cuando cambien la experiencia.
- **Criterios de aceptación**: ejemplos concretos que demuestren que quedó bien.

Máximo orientativo: seis decisiones de producto. Agrupá opciones compatibles para no convertir la charla en un formulario.

## 4. Cargar conocimiento específico solo cuando corresponda

Cuando el tipo de producto ya esté claro, leé una sola referencia:

- Agenda: [references/agenda.md](references/agenda.md)
- Noticias: [references/noticias.md](references/noticias.md)
- Herramienta interna: [references/herramienta-interna.md](references/herramienta-interna.md)

Las referencias describen información necesaria, alcance y ejemplos de aceptación. No son cuestionarios. Si el producto no coincide con ninguna, seguí con el mapa genérico y respetá las capacidades reales del constructor.

## 5. Proponer y cerrar alcance

Cuando haya información suficiente:

1. Resumí en tres líneas el problema, la experiencia principal y el resultado.
2. Proponé qué entra en la V1 y qué queda afuera.
3. Corregí cualquier expectativa que el constructor no pueda cumplir.
4. Escribí el artefacto correspondiente sin pedir una confirmación ceremonial adicional si la conversación ya lo dejó claro.

## Salida para creación

Escribí `mi-agente/PRODUCTO.md`:

```markdown
# Mi agente

## Modo
Creación

## Elección
[identificador del tipo o template]

## Persona y contexto
[quién lo usa y en qué situación]

## Problema actual
[problema concreto]

## Resultado esperado
[cambio observable]

## Flujo principal
[disparador, comportamiento y entrega]

## Entradas y contexto
- [...]

## Acciones y autonomía
- [...]

## Límites y cuidados
- [...]

## Preferencias del producto
- [...]

## Criterios de aceptación
- Dado [...], cuando [...], entonces [...].

## Alcance de la V1
- [...]

## Mejoras futuras
- [...]
```

Conservá en `Preferencias del producto` cualquier dato requerido por el adaptador elegido para que el constructor pueda actuar sin volver a entrevistar.

## Salida para modificación

No reescribas todavía `PRODUCTO.md`. Creá `mi-agente/cambios/YYYY-MM-DD-HHMM-<tema>.md`:

```markdown
# Cambio: [nombre breve]

## Estado
Pendiente

## Comportamiento actual
[qué hace hoy, verificado en los archivos]

## Resultado buscado
[qué quiere lograr la persona]

## Se conserva
- [...]

## Cambios de comportamiento
- [...]

## Criterios de aceptación
- Dado [...], cuando [...], entonces [...].

## Fuera de alcance
- [...]
```

El cambio debe expresar comportamiento, no archivos ni una solución técnica. El constructor decide después cómo implementarlo.

## Cierre

Mostrá un resumen breve del artefacto creado y seguí con el flujo que invocó la skill. No anuncies que el producto está listo: solo quedó definido.
