# Guía del organizador

Qué preparar antes del taller. Tiempo estimado de setup: 30-45 minutos, una sola vez.

## 1. Llave del modelo de IA (obligatorio)

Cada participante necesita una llave para que su agente piense. Opciones:

**Recomendado: Vercel AI Gateway.**
1. Creá una cuenta/equipo en [vercel.com](https://vercel.com) → AI Gateway.
2. Generá una API key (`AI_GATEWAY_API_KEY`) por participante, o una compartida para todo el taller.
3. Poné un límite de gasto (Budgets) — para un taller de 20 personas, USD 10-20 alcanza de sobra.

Alternativa: repartir `ANTHROPIC_API_KEY` de [console.anthropic.com](https://console.anthropic.com). En ese caso el AI Engineer adapta la configuración del modelo solo (los templates usan el Gateway por defecto).

Repartí la llave en papel, pizarra o chat privado al inicio del taller.

## 2. OAuth de Google Calendar (solo si ofrecés el agente de agenda)

Los participantes del agente de agenda autorizan su calendario con 1 click contra **un OAuth client tuyo compartido**:

1. Entrá a [console.cloud.google.com](https://console.cloud.google.com) → creá un proyecto (ej: `taller-agentes`).
2. **APIs y servicios → Biblioteca** → habilitá **Google Calendar API**.
3. **Pantalla de consentimiento OAuth** → tipo **Externo** → completá nombre y mails de contacto. Scopes: agregá `.../auth/calendar.readonly` y `.../auth/calendar.events`.
4. **Credenciales → Crear credenciales → ID de cliente OAuth** → tipo **Aplicación web** → en "URIs de redireccionamiento autorizados" agregá exactamente: `http://localhost:8756/callback`
5. Guardá el **Client ID** y el **Client Secret**: son los `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` que repartís.

**Importante — modo de publicación de la app:**
- En modo **Prueba** (default): tenés que agregar el mail de Google de cada participante en "Usuarios de prueba" (máximo 100). Pedí los mails al inscribirse.
- Alternativa: publicá la app ("En producción") sin verificación de Google: los participantes ven una pantalla de advertencia ("app no verificada") y pueden continuar por "Configuración avanzada". Menos prolijo, cero carga de mails.

## 3. Checklist para mandar a los participantes (antes del taller)

```
Para venir con todo listo:
1. Instalá Node.js 24: https://nodejs.org
2. Instalá Claude Code: https://claude.com/claude-code (necesitás una cuenta de Claude)
3. Tené Telegram en tu celular
4. Hacé fork de este repo en GitHub y clonalo en tu compu
5. En la carpeta del repo, corré:  bash scripts/preparar.sh
   (descarga todo lo pesado; tarda unos minutos, dejalo correr)
6. Solo agente de agenda: mandanos tu mail de Google (para habilitarte el calendario)
```

## 4. El día del taller

- Wifi decente (el paso de instalación ya vino hecho de casa; el taller usa poca red).
- Tené a mano: la llave del modelo, y Client ID/Secret de Google.
- Timing sugerido: 5' intro y reparto de llaves → 25' hands-on siguiendo [GUIA-TALLER.md](GUIA-TALLER.md).
- Cierre sugerido: que 2-3 personas muestren el mensaje que les llegó al Telegram.

## Costos de referencia

- Modelo: centavos por participante en un taller de 30 min.
- Vercel: el plan gratuito (Hobby) alcanza para publicar el agente de cada participante en su propia cuenta.
- Telegram y feeds RSS: gratis.
