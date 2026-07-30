# Guion del taller (30 minutos)

Este es tu mapa. No hay que memorizar nada: Claude Code te va llevando. Esto es solo para que sepas qué viene después.

## Antes de empezar (en tu casa o al llegar, 5 min)

- [ ] Instalaste [Node.js 24](https://nodejs.org) y [Claude Code](https://claude.com/claude-code).
- [ ] Tenés Telegram en el celular.
- [ ] Hiciste fork y clone de este repositorio (el organizador te pasa el link con los pasos).
- [ ] Corriste `bash scripts/preparar.sh` (descarga todo lo pesado antes, para no esperar durante el taller).

## Minuto a minuto

**0-3 · Arranque.** Abrís la terminal en la carpeta del repo, escribís `claude`, y adentro `/crear-agente`.

**3-10 · La entrevista.** El AI PM te pregunta qué agente querés (agenda o noticias), quién sos y tus preferencias. Respondé como en una charla; acá se define tu agente.

**10-20 · La construcción.** El AI Engineer arma todo. Te va a pedir solo 2 o 3 cosas que únicamente vos podés hacer:
1. Pegar la **llave del modelo** que te dio el organizador.
2. Crear tu **bot de Telegram** hablando con @BotFather (te guía paso a paso) y mandarle "hola".
3. Solo agenda: tocar **Permitir** cuando se abra Google en el navegador.

Mientras tanto, él decide todo lo técnico y te lo anota en `mi-agente/DECISIONES.md`, en criollo.

**20-27 · La prueba.** Se abre un chat en tu navegador con tu agente. Habale. Además dispara el envío del día: te llega el primer mensaje de tu agente al Telegram, en vivo.

**27-30 · Publicar (o dejarlo para después).** `/publicar` muda tu agente a internet para que trabaje solo todos los días. Necesitás una cuenta gratuita de Vercel (se crea en 1 minuto). Si no llegás, no pasa nada: tu agente ya funciona en tu compu y podés publicarlo en tu casa con el mismo comando.

## Preguntas frecuentes

**¿Tengo que entender el código?** No. Podés mirarlo si te da curiosidad (`mi-agente/`), pero nada del taller lo requiere.

**¿Qué pasa si algo falla?** El AI Engineer lo arregla solo. Si se traba, avisale al organizador.

**¿Mi agente funciona cuando apago la compu?** Después de `/publicar`, sí: vive en internet y te escribe solo todos los días.

**¿Puedo pedirle más cosas después?** Sí. Volvé a abrir `claude` en la carpeta y pedile cambios en tus palabras ("quiero el digest a las 7", "agregá noticias de cine"). Para cosas más grandes (guardar historial, usuarios, conectar Notion) hay un camino avanzado: preguntale a Claude Code por `templates/base/avanzado/`.
