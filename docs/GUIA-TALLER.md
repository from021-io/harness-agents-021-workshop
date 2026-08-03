# Guion del taller (30 minutos)

Este es tu mapa. No hay que memorizar nada: Claude Code te va llevando. Esto es solo para que sepas qué viene después.

## Si estás leyendo esto, ya tenés todo listo

La preparación (instalar Claude Code, crear tus cuentas y descargar este material) va antes del taller y te la mandan por mail o mensaje al inscribirte. Si llegaste hasta acá, esa parte ya está hecha.

> 💡 **Regla de oro con Claude Code**: cada vez que te pida permiso para hacer algo ("Allow?" / "¿Permitir?"), elegí **Allow**, y si te da la opción, **Always allow**. Mejor todavía: abajo del cuadro donde escribís hay un selector de permisos, elegí **Bypass permissions** y no te interrumpe más durante el taller.

**Qué es de quién** (para que no haya sorpresas):

- **Tuyo**: tu Telegram, tu calendario de Google, tu cuenta de Claude, tu GitHub (con tu copia del taller) y tu cuenta de Vercel. Tu agente trabaja con TUS cosas y tu trabajo se guarda en TU GitHub.
- **De quien da el taller**: la "llave del modelo" (lo que le da inteligencia al agente) y los permisos de Google. Te los dan el día del evento.

## Minuto a minuto

**0-3 · Arranque.** Abrí la app de Claude Code y empezá una conversación **nueva** eligiendo la carpeta **`taller-agentes`** como carpeta de trabajo (la ruta te la dio la preparación). Escribí `/crear-agente`.

¿Dice "Unknown command"? Es que la conversación no está parada en esa carpeta: cerrala y abrí otra eligiéndola bien. (También podés escribir "quiero crear mi agente", hace lo mismo.) Acordate: si pide permiso, **Allow / Always allow**.

**3-10 · La entrevista.** El AI PM te pregunta qué agente querés (agenda o noticias), quién sos y tus preferencias. Respondé como en una charla; acá se define tu agente.

**10-20 · La construcción.** El AI Engineer arma todo. Te va a pedir solo 2 o 3 cosas que únicamente vos podés hacer:
1. Pegar la **llave del modelo** que te dieron en el taller.
2. Crear tu **bot de Telegram**: en Telegram Web buscás **@BotFather**, le escribís `/newbot`, elegís un nombre, y copiás el código que te da. Te guía paso a paso. Después le mandás "hola" a tu bot.
3. Solo agenda: tocar **Permitir** cuando se abra Google en el navegador.

Mientras tanto, él decide todo lo técnico y te lo anota en `mi-agente/DECISIONES.md`, en criollo.

**20-27 · La prueba.** Llega el momento: te avisa "ya está listo, probalo". Agarrás el celular y le escribís a TU bot por Telegram: "mandame el resumen de hoy", o lo que quieras. Te contesta ahí mismo: eso que le pediste a mano es exactamente lo que te va a llegar solo cada mañana cuando lo publiques. También se abre un chat en el navegador por si preferís probarlo desde la compu.

**Sorpresa antes de publicar.** Te va a hacer una pregunta rara (tipo cuál es tu fruta favorita). Seguile el juego: hay un regalo: tu agente termina con su propia mini presentación de 5 pantallas, tematizada con tu respuesta, lista para mostrar al grupo.

**27-30 · Publicar (o dejarlo para después).** `/publicar` muda tu agente a internet para que trabaje solo todos los días. Necesitás una cuenta gratuita de Vercel (se crea en 1 minuto). Si no llegás, no pasa nada: tu agente ya funciona en tu compu y podés publicarlo en tu casa con el mismo comando.

## Preguntas frecuentes

**¿Tengo que entender el código?** No. Podés mirarlo si te da curiosidad (`mi-agente/`), pero nada del taller lo requiere.

**¿Qué pasa si algo falla?** Se arregla solo. Si tu agente deja de contestarte por Telegram, escribí `/arreglar` en Claude Code: lo despierta en unos segundos. Si sigue trabado, levantá la mano y avisá.

**¿Mi agente funciona cuando apago la compu?** Después de `/publicar`, sí: vive en internet y te escribe solo todos los días.

**¿Y si no quiero dejarle acceso a mi calendario?** Al final te lo pregunta. Podés cortar el permiso ahí mismo, o cuando quieras escribiendo `/desconectar` en Claude Code: le avisa a Google que lo revoque y lo borra de tu compu. También podés verlo y sacarlo vos desde [tu cuenta de Google](https://myaccount.google.com/permissions).

**¿Puedo pedirle más cosas después?** Sí. Volvé a abrir `claude` en la carpeta y pedile cambios en tus palabras ("quiero el digest a las 7", "agregá noticias de cine"). Para cosas más grandes (guardar historial, usuarios, conectar Notion) hay un camino avanzado: preguntale a Claude Code por `templates/base/avanzado/`.
