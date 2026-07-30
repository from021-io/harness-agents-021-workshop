# harness-agents-021 · Creá tu agente de IA en 30 minutos

Este repositorio es el material de un **taller hands-on**: cualquier persona —sin saber programar— sale con su propio agente de IA funcionando y comunicándose con ella por Telegram.

No escribís código. Un equipo de IA lo hace por vos:

- Un **AI Product Manager** te entrevista para entender quién sos y qué querés.
- Un **AI Engineer** construye tu agente, toma todas las decisiones técnicas solo (y te las anota en criollo), lo prueba y te lo muestra andando.

## Los dos agentes para elegir

| | 🗓️ Agente de agenda | 📰 Agente de noticias |
|---|---|---|
| Qué hace | Cada mañana mira tus pendientes y tu Google Calendar, te propone por Telegram un bloque de trabajo concreto y, si aceptás, te lo agenda. | Una vez por día te manda por Telegram las noticias más relevantes de un tema que elijas (economía, tecnología, IA, deportes…). |
| Conexiones | Telegram + Google Calendar | Telegram + fuentes de noticias ya configuradas |

## Qué necesitás antes de empezar

Tres cuentas tuyas y una app. Sin terminal, sin pasos técnicos:

1. **Cuenta de Claude** (plan Pro) y la app [Claude Code](https://claude.com/claude-code) instalada con sesión iniciada.
2. **Cuenta gratuita de GitHub** (tu copia del taller vive ahí).
3. **Telegram** en tu celular (tu cuenta de siempre: tu agente te escribe ahí).
4. **Cuenta gratuita de Vercel** (para que tu agente viva en internet al final).
5. Solo agente de agenda: tu cuenta de Google de siempre (se usa TU calendario).

La llave del modelo y los permisos de Google los reparte el organizador el día del taller.

La preparación completa de tu compu la hace Claude Code solo (instala lo que falte y descarga este material): los pasos exactos y el mensaje para pegarle están en [docs/GUIA-TALLER.md](docs/GUIA-TALLER.md).

## Cómo arranca el taller

Abrís Claude Code en la carpeta `taller-agentes` que quedó preparada y escribís:

```
/crear-agente
```

Nada más. Te va a hacer unas preguntas sobre vos y tus preferencias, y en unos minutos estás chateando con tu agente. Cuando quieras que funcione solo todos los días (aunque tu compu esté apagada), escribís `/publicar`.

## Comandos del taller

| Comando | Qué hace |
|---|---|
| `/crear-agente` | El flujo completo: entrevista → construcción → prueba |
| `/probar` | Levanta tu agente y dispara el envío del día para verlo ya |
| `/publicar` | Pone tu agente a vivir en internet |

## Cómo está armado (para curiosos)

- Los agentes corren sobre [eve](https://eve.dev), un framework para agentes de IA durables, con chat web incluido y deploy a Vercel.
- `templates/` tiene los dos agentes ya construidos y probados; tu versión personalizada se crea en `mi-agente/`.
- `.claude/` tiene el equipo de IA (PM + Engineer) y los comandos del taller.
- Más detalle en [docs/COMO-FUNCIONA.md](docs/COMO-FUNCIONA.md).

**¿Organizás un taller?** Leé [docs/ORGANIZADOR.md](docs/ORGANIZADOR.md) — hay que preparar un par de llaves antes.
**¿Participás de uno?** Tu guion está en [docs/GUIA-TALLER.md](docs/GUIA-TALLER.md).
