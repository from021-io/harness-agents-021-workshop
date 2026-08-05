# Cómo funciona este repo (para curiosos y técnicos)

## Las dos capas

**1. El harness de Claude Code** (`.claude/` + `CLAUDE.md`): descubrimiento genérico seguido por construcción o modificación, pensado para usuarios no técnicos.

- `CLAUDE.md`: las reglas del juego. Las importantes: el usuario nunca responde preguntas técnicas; la V1 jamás incluye auth ni base de datos; todo en español simple; nada se muestra sin estar verificado; toda decisión técnica queda logueada en `mi-agente/DECISIONES.md`.
- `.claude/skills/descubrir-producto/SKILL.md`: proceso genérico para definir una creación o una modificación. Produce `PRODUCTO.md` al crear y un cambio bajo `mi-agente/cambios/` al modificar.
- `.claude/skills/descubrir-producto/references/`: conocimiento específico de agenda, noticias y herramienta. Se lee una sola referencia después de elegir el producto; no forma parte del cuestionario central.
- `.claude/agents/ai-pm.md`: punto de entrada para ejecutar el descubrimiento genérico en el hilo principal.
- `.claude/agents/ai-engineer.md`: playbook de construcción: copia el template, lo personaliza con el brief, resuelve credenciales con el usuario (lo único humano: pegar la llave, hablar con @BotFather, tocar "Permitir" en Google), verifica y abre el preview.
- Los playbooks bajo `.claude/agents/` se leen y se siguen en el hilo principal. Delegarlos rompe la experiencia: la salida llega dentro de una caja con instrucciones internas y duplica el relato.
- `.claude/skills/`: los comandos `/crear-agente`, `/modificar-agente`, `/probar` y `/publicar`, además del descubrimiento reutilizable.

**2. Los templates eve** (`templates/`): tres proyectos completos sobre [eve](https://eve.dev) (v0.28), cada uno Next.js con el agente embebido vía `withEve`, lo que da chat web en `localhost:3000` y API en `/eve/v1/*`. Dos son agentes que hablan por Telegram; el tercero es una herramienta interna con la IA adentro de la pantalla.

## La herramienta interna: un motor manejado por especificación

En vez de un template por dominio, hay **un motor genérico** que se arma leyendo `config/espec.json`. Sumar un tipo de herramienta nuevo es escribir un JSON, no tocar código.

- `lib/espec.ts`: el contrato, validado con Zod. Tipos de campo y fórmulas son catálogos **cerrados**, y hay reglas cruzadas que atrapan lo que un schema plano deja pasar (un campo título que no existe, un calculado que apunta a la nada, una semilla con un estado inválido). `npm run validar-espec` corre esa misma validación desde la terminal, así el error aparece antes de levantar la app.
- `lib/datos.ts`: CRUD sobre localStorage, con semilla, huella de esquema (si cambia la estructura, resiembra en vez de romper), campos calculados e indicadores. Las fechas sin hora se leen como día local: si no, en América se muestran un día antes.
- `app/_components/`: tablero con arrastre, lista con búsqueda, ficha con sub-lista, formulario armado desde los campos. Todo compuesto con shadcn/ui, que ya viene en el scaffold. El color se cambia en las variables de `app/globals.css`, nunca componente por componente.
- `recetas/`: cinco especificaciones ya probadas (ventas, pedidos, inventario, soporte, candidatos) que sirven de punto de partida. El motor no depende de ellas: una especificación escrita de cero funciona igual.

**El asistente** sigue la lógica de Notion AI: preset fijo de cinco capacidades (preguntar, cargar al dictado, actualizar o mover, redactar, resumir) y atajos que salen de las `accionesIA` de cada especificación. Los datos viven en el navegador, así que viajan como `clientContext` de eve: alcanzan al modelo pero no quedan en el historial. Solo dos herramientas: `proponer_cambios`, que valida cada acción contra la especificación y deja una propuesta que la persona aplica con un click, y `redactar`, que solo devuelve texto. **La IA nunca escribe sola**, y por eso un registro con texto malicioso no puede ejecutar nada: toda escritura pasa por validación y por un click humano.

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
   └─ descubrir-producto (modo creación) → mi-agente/PRODUCTO.md
   └─ ai-engineer
        ├─ copia templates/<elegido>/ → mi-agente/
        ├─ personaliza instructions.md, cron, fuentes/backlog
        ├─ credenciales → .env   (modelo, Telegram, Google)
        ├─ npm run dev  →  health + prueba de chat + dispara schedule
        └─ mi-agente/DECISIONES.md (log de todo lo que decidió)
/publicar
   └─ vercel login/link/env/deploy → setWebhook de Telegram → prueba en vivo

/modificar-agente
   └─ descubrir-producto (modo modificación)
        ├─ inspecciona PRODUCTO.md + DECISIONES.md + comportamiento actual
        ├─ acuerda resultado, cosas que se conservan y criterios de aceptación
        └─ escribe mi-agente/cambios/<fecha>-<tema>.md
   └─ ai-engineer (modo modificación)
        ├─ aplica el delta mínimo, sin copiar el template
        ├─ verifica criterios + regresión básica
        └─ actualiza PRODUCTO.md, DECISIONES.md y estado del cambio
```

## El camino avanzado (post-taller)

`templates/base/avanzado/supabase/` tiene el pre-set de Supabase (base de datos + auth) **desactivado a propósito**: la regla del harness es que la V1 nunca lo incluye. Después del taller, pedirle a Claude Code "quiero que mi agente guarde historial" activa ese camino siguiendo el README de esa carpeta.
