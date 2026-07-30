# Guion del taller (30 minutos)

Este es tu mapa. No hay que memorizar nada: Claude Code te va llevando. Esto es solo para que sepas qué viene después.

## Antes de empezar (en tu casa, 15 min)

Solo 3 cuentas y 1 mensaje. Nada de terminal, nada técnico: Claude Code prepara tu compu solo.

**Cuentas (creá las que te falten):**

- [ ] **Cuenta de Claude** con plan pago (Pro): entrá a [claude.ai](https://claude.ai), registrate y elegí el plan. Es el cerebro de todo el taller.
- [ ] **Cuenta de GitHub** (gratis): entrá a [github.com/signup](https://github.com/signup) y creala. Ahí va a vivir tu copia del taller y lo que construyas.
- [ ] **Telegram** en tu celular, con tu cuenta de siempre. Tu agente te va a escribir ahí.
- [ ] **Cuenta de Vercel** (gratis): entrá a [vercel.com/signup](https://vercel.com/signup), tocá **Continue with GitHub** y listo. Sirve para que al final tu agente viva en internet.
- [ ] Solo agente de agenda: usás **tu cuenta de Google de siempre** (tu calendario personal). Mandale tu Gmail al organizador cuando te inscribís, para habilitarte.

**Instalá Claude Code y dejá que prepare todo:**

- [ ] Descargá la app de Claude Code desde [claude.com/claude-code](https://claude.com/claude-code), abrila e iniciá sesión con tu cuenta de Claude.
- [ ] Copiá y pegá este mensaje en Claude Code, tal cual:

```
Preparame la computadora para el taller de agentes. Hacé todo vos, no me
hagas ninguna pregunta técnica y resolvé lo que falte:
1. Fijate si están instalados Git, Node.js versión 24 o más nueva, la
   herramienta de GitHub (gh) y el comando de terminal "claude" (Claude
   Code). Si falta algo, instalalo vos.
2. Conectá mi cuenta de GitHub (gh auth login): avisame cuándo tocar
   "Autorizar" en el navegador.
3. Hacé un fork a mi cuenta del repo
   https://github.com/from021-io/harness-agents-021-workshop
   y descargá mi copia a una carpeta "taller-agentes" en mi carpeta
   personal.
4. Entrá a esa carpeta y corré: bash scripts/preparar.sh
5. Dejame en el Escritorio un acceso directo llamado "Taller-Agentes"
   que al hacerle doble click abra una terminal parada en esa carpeta
   con el comando claude ya corriendo (en Mac un archivo .command
   ejecutable; en Windows un .bat). Probá que el archivo quedó bien.
6. Verificá que todo haya quedado bien y terminá diciéndome
   "✅ Listo para el taller", la ubicación de la carpeta, y esta
   instrucción: el día del taller hago doble click en Taller-Agentes
   (en el Escritorio) y escribo /crear-agente.
```

Lo único que hacés vos en el medio: tocar **Autorizar** cuando se abra el navegador (es Claude Code conectándose a tu GitHub).

> 💡 **Regla de oro con Claude Code**: cada vez que te pida permiso para hacer algo ("Allow?" / "¿Permitir?"), elegí **Allow** — y si te da la opción, **Always allow** (permitir siempre), así no te vuelve a preguntar. Vale para toda la preparación y todo el taller.
>
> Mejor todavía: abajo del cuadro donde escribís hay un selector de permisos — elegí **Bypass permissions** y Claude no te interrumpe más con pedidos de permiso durante el taller.

- [ ] Esperá el "✅ Listo para el taller". Puede tardar unos minutos (descarga cosas pesadas). Si algo falla, Claude lo intenta arreglar solo; si se traba, mandale la pantalla al organizador.

**Qué es de quién** (para que no haya sorpresas):

- **Tuyo**: tu Telegram, tu calendario de Google, tu cuenta de Claude, tu GitHub (con tu copia del taller) y tu cuenta de Vercel. Tu agente trabaja con TUS cosas y tu trabajo se guarda en TU GitHub.
- **Del organizador**: la "llave del modelo" (lo que le da inteligencia al agente) y los permisos de Google del taller. Te los dan el día del evento, no necesitás nada de eso antes.

## Minuto a minuto

**0-3 · Arranque.** Doble click en **Taller-Agentes** (el acceso directo que quedó en tu Escritorio en la preparación): se abre una ventana con Claude Code ya parado en la carpeta correcta. Escribí `/crear-agente`.

¿No tenés el acceso directo o dice "Unknown command"? Plan B: abrí una conversación nueva de Claude Code eligiendo la carpeta `taller-agentes` como carpeta de trabajo (en la app), o en la terminal: `cd ~/taller-agentes` y después `claude`. También podés escribir "quiero crear mi agente", hace lo mismo. Acordate: si pide permiso, **Allow / Always allow**.

**3-10 · La entrevista.** El AI PM te pregunta qué agente querés (agenda o noticias), quién sos y tus preferencias. Respondé como en una charla; acá se define tu agente.

**10-20 · La construcción.** El AI Engineer arma todo. Te va a pedir solo 2 o 3 cosas que únicamente vos podés hacer:
1. Pegar la **llave del modelo** que te dio el organizador.
2. Crear tu **bot de Telegram** hablando con @BotFather (te guía paso a paso) y mandarle "hola".
3. Solo agenda: tocar **Permitir** cuando se abra Google en el navegador.

Mientras tanto, él decide todo lo técnico y te lo anota en `mi-agente/DECISIONES.md`, en criollo.

**20-27 · La prueba.** Llega el momento: te avisa "ya está listo, probalo". Agarrás el celular y le escribís a TU bot por Telegram — "mandame el resumen de hoy", o lo que quieras. Te contesta ahí mismo: eso que le pediste a mano es exactamente lo que te va a llegar solo cada mañana cuando lo publiques. También se abre un chat en el navegador por si preferís probarlo desde la compu.

**Sorpresa antes de publicar.** Te va a hacer una pregunta rara (tipo cuál es tu fruta favorita). Seguile el juego: hay un regalo — tu agente termina con su propia mini presentación de 5 pantallas, tematizada con tu respuesta, lista para mostrar al grupo.

**27-30 · Publicar (o dejarlo para después).** `/publicar` muda tu agente a internet para que trabaje solo todos los días. Necesitás una cuenta gratuita de Vercel (se crea en 1 minuto). Si no llegás, no pasa nada: tu agente ya funciona en tu compu y podés publicarlo en tu casa con el mismo comando.

## Preguntas frecuentes

**¿Tengo que entender el código?** No. Podés mirarlo si te da curiosidad (`mi-agente/`), pero nada del taller lo requiere.

**¿Qué pasa si algo falla?** El AI Engineer lo arregla solo. Si se traba, avisale al organizador.

**¿Mi agente funciona cuando apago la compu?** Después de `/publicar`, sí: vive en internet y te escribe solo todos los días.

**¿Puedo pedirle más cosas después?** Sí. Volvé a abrir `claude` en la carpeta y pedile cambios en tus palabras ("quiero el digest a las 7", "agregá noticias de cine"). Para cosas más grandes (guardar historial, usuarios, conectar Notion) hay un camino avanzado: preguntale a Claude Code por `templates/base/avanzado/`.
