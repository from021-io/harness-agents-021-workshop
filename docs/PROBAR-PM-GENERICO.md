# Cómo probar el PM genérico

Estas pruebas permiten validar el descubrimiento sin necesitar credenciales reales.

## Prueba 1: creación dentro del catálogo

1. Abrí Claude Code en la raíz de este repositorio.
2. Escribí `/crear-agente`.
3. Elegí un producto y respondé de forma incompleta a propósito.
4. Confirmá que pregunta solo por los huecos relevantes y que lee una única referencia.
5. Frená antes de pegar credenciales si solo querés revisar el brief.
6. Revisá `mi-agente/PRODUCTO.md`.

El brief debe explicar problema, resultado, flujo, acciones, límites, preferencias, alcance y criterios de aceptación. También debe conservar el identificador de template bajo `Elección`.

## Prueba 2: descubrimiento genérico

Invocá `/descubrir-producto` y pedí definir un agente que no sea agenda ni noticias ni herramienta interna.

Debe descubrir el problema con el mapa genérico, sin cargar una referencia incorrecta ni prometer que el constructor actual puede implementarlo.

## Prueba 3: modificación

Con un `mi-agente/` ya creado:

1. Escribí `/modificar-agente`.
2. Pedí un cambio pequeño, por ejemplo cambiar horario o tono.
3. Confirmá que primero resume el comportamiento actual.
4. Confirmá que no vuelve a preguntar quién sos ni rehace el producto.
5. Revisá el archivo nuevo bajo `mi-agente/cambios/`.

El cambio debe tener estado, comportamiento actual, resultado buscado, cosas que se conservan, cambios observables, criterios de aceptación y fuera de alcance.

## Prueba 4: protección contra reconstrucción

Pedí modificar un agente que ya tenga `.env` y datos personalizados. El flujo no debe copiar el template, reemplazar secretos ni borrar datos. Después de verificar debe actualizar `PRODUCTO.md`, marcar el cambio como aplicado y registrar la decisión.
