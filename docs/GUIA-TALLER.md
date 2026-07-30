# Guion del taller (30 minutos)

Este es tu mapa. No hay que memorizar nada: Claude Code te va llevando. Esto es solo para que sepas qué viene después.

## Antes de empezar (en tu casa, 15 min)

Solo 3 cuentas y 1 mensaje. Nada de terminal, nada técnico: Claude Code prepara tu compu solo.

**Cuentas (creá las que te falten):**

- [ ] **Cuenta de Claude** con plan pago (Pro): entrá a [claude.ai](https://claude.ai), registrate y elegí el plan. Es el cerebro de todo el taller.
- [ ] **Telegram** en tu celular, con tu cuenta de siempre. Tu agente te va a escribir ahí.
- [ ] **Cuenta de Vercel** (gratis): entrá a [vercel.com/signup](https://vercel.com/signup), tocá **Continue with Google** y listo. Sirve para que al final tu agente viva en internet.
- [ ] Solo agente de agenda: usás **tu cuenta de Google de siempre** (tu calendario personal). Mandale tu Gmail al organizador cuando te inscribís, para habilitarte.

**Instalá Claude Code y dejá que prepare todo:**

- [ ] Descargá la app de Claude Code desde [claude.com/claude-code](https://claude.com/claude-code), abrila e iniciá sesión con tu cuenta de Claude.
- [ ] Copiá y pegá este mensaje en Claude Code, tal cual (el organizador te pasa el link del repo si acá no está completo):

```
Preparame la computadora para el taller de agentes. Hacé todo vos, no me
hagas ninguna pregunta técnica y resolvé lo que falte:
1. Fijate si están instalados Git y Node.js versión 24 o más nueva.
   Si falta alguno, instalalo vos.
2. Descargá el material del taller desde <URL-DEL-REPO> a una carpeta
   "taller-agentes" en mi carpeta personal.
3. Entrá a esa carpeta y corré: bash scripts/preparar.sh
4. Verificá que todo haya quedado bien y terminá diciéndome
   "✅ Listo para el taller" con la ubicación de la carpeta.
```

- [ ] Esperá el "✅ Listo para el taller". Puede tardar unos minutos (descarga cosas pesadas). Si algo falla, Claude lo intenta arreglar solo; si se traba, mandale la pantalla al organizador.

**Qué es de quién** (para que no haya sorpresas):

- **Tuyo**: tu Telegram, tu calendario de Google, tu cuenta de Claude y tu cuenta de Vercel. Tu agente trabaja con TUS cosas.
- **Del organizador**: la "llave del modelo" (lo que le da inteligencia al agente) y los permisos de Google del taller. Te los dan el día del evento, no necesitás nada de eso antes.

## Minuto a minuto

**0-3 · Arranque.** Abrís Claude Code en la carpeta `taller-agentes` (la que se preparó en tu casa) y escribís `/crear-agente`.

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
