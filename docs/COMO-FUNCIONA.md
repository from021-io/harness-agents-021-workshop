# Cómo funciona este repo (para curiosos y técnicos)

## Las dos capas

**1. El harness de Claude Code** (`.claude/` + `CLAUDE.md`): un workflow AI PM → AI Engineer pensado para usuarios no técnicos.

- `CLAUDE.md`: las reglas del juego. Las importantes: el usuario nunca responde preguntas técnicas; la V1 jamás incluye auth ni base de datos; todo en español simple; nada se muestra sin estar verificado; toda decisión técnica queda logueada en `mi-agente/DECISIONES.md`.
- `.claude/agents/ai-pm.md`: playbook de la entrevista (producto + perfil de la persona) que produce `mi-agente/PRODUCTO.md`.
- `.claude/agents/ai-engineer.md`: playbook de construcción: copia el template, lo personaliza con el brief, resuelve credenciales con el usuario (lo único humano: pegar la llave, hablar con @BotFather, tocar "Permitir" en Google), verifica y abre el preview.
- Los dos viven en `.claude/agents/` (formato de subagente) pero **se leen y se siguen en el hilo principal**. Delegarlos rompe la experiencia: la salida de un subagente le llega al usuario dentro de una caja "Message from ai-engineer", con las instrucciones internas a la vista y duplicada por el relato del hilo principal.
- `.claude/skills/`: los comandos `/crear-agente`, `/probar`, `/publicar`.

**2. Los templates eve** (`templates/`): dos agentes completos sobre [eve](https://eve.dev) (v0.28), cada uno un proyecto Next.js con el agente embebido vía `withEve`, lo que da chat web en `localhost:3000` y API en `/eve/v1/*`.

## Anatomía de un template

```
agent/
  agent.ts              # modelo (anthropic/claude-sonnet-5 vía AI Gateway)
  instructions.md       # system prompt con placeholders {{...}} que completa el Engineer
  channels/telegram.ts  # canal Telegram oficial de eve
  channels/eve.ts       # canal del chat web / TUI
  tools/                # defineTool + Zod; el nombre del archivo es el nombre de la tool
  schedules/            # defineSchedule con cron (UTC); en dev se dispara con
                        # POST /eve/v1/dev/schedules/<nombre>
  lib/                  # código compartido (ej: google.ts para Calendar)
scripts/                # onboarding no técnico:
                        #  conectar-telegram.mjs → getUpdates hasta recibir un "hola",
                        #    guarda TELEGRAM_CHAT_ID en .env
                        #  conectar-google.mjs → OAuth loopback en localhost:8756,
                        #    guarda GOOGLE_REFRESH_TOKEN en .env
```

Decisiones de diseño relevantes:

- **Telegram funciona completo en local**: lo saliente (el digest al celular) es una llamada directa a la API de Bot, y lo entrante (que el bot conteste) lo resuelve `scripts/telegram-local.mjs`, un puente que hace long-polling a `getUpdates` y reenvía cada update como POST al endpoint local del canal (`/eve/v1/telegram`, con el secret header). Al publicar, el webhook real reemplaza al puente.
- **Google Calendar sin integración oficial de eve**: se resuelve con tools propias contra la REST API v3, con refresh token obtenido una vez por el script de onboarding y client compartido del organizador.
- **Los schedules no corren solos en dev** (comportamiento de eve): por eso `/probar` los dispara a mano por el endpoint de dev. Al publicar en Vercel se convierten en Vercel Cron (en UTC).
- **La documentación de eve viaja con el paquete** (`node_modules/eve/docs/`): el AI Engineer la lee antes de tocar código eve, así el harness no depende de docs online ni se desactualiza con la versión instalada.

## El flujo de datos del taller

```
/crear-agente
   └─ ai-pm  ──entrevista──▶  mi-agente/PRODUCTO.md
   └─ ai-engineer
        ├─ copia templates/<elegido>/ → mi-agente/
        ├─ personaliza instructions.md, cron, fuentes/backlog
        ├─ credenciales → .env   (modelo, Telegram, Google)
        ├─ npm run dev  →  health + prueba de chat + dispara schedule
        └─ mi-agente/DECISIONES.md (log de todo lo que decidió)
/publicar
   └─ vercel login/link/env/deploy → setWebhook de Telegram → prueba en vivo
```

## El camino avanzado (post-taller)

`templates/base/avanzado/supabase/` tiene el pre-set de Supabase (base de datos + auth) **desactivado a propósito**: la regla del harness es que la V1 nunca lo incluye. Después del taller, pedirle a Claude Code "quiero que mi agente guarde historial" activa ese camino siguiendo el README de esa carpeta.
