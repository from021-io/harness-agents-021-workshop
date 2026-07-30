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

Principio: **el participante no toca la terminal ni "forkea" nada**. Instala Claude Code, pega un mensaje, y Claude Code le prepara la compu (instala Git y Node si faltan, descarga el repo, corre la pre-instalación). El repo es público: se descarga directo, sin cuenta de GitHub.

Texto listo para copiar y mandar (completá `<URL-DEL-REPO>` con la URL https de tu repo):

```
¡Hola! Para venir con todo listo al taller (15 minutos, una sola vez):

CUENTAS — creá las que no tengas:
1. Cuenta de Claude con plan Pro → https://claude.ai
   (es la herramienta con la que vas a crear tu agente)
2. Telegram en tu celular, tu cuenta de siempre
   (tu agente te va a escribir ahí)
3. Cuenta gratuita de Vercel → https://vercel.com/signup
   → tocá "Continue with Google" y ya está
   (para que tu agente viva en internet al final)
4. Solo si elegís el agente de agenda: respondé este mensaje con tu
   mail de Google (Gmail) — usamos TU calendario de siempre y
   necesitamos habilitarte

PREPARÁ TU COMPU (sin pasos técnicos):
5. Descargá e instalá la app Claude Code → https://claude.com/claude-code
   e iniciá sesión con tu cuenta de Claude
6. Abrí Claude Code y pegale este mensaje tal cual:

   Preparame la computadora para el taller de agentes. Hacé todo vos,
   no me hagas ninguna pregunta técnica y resolvé lo que falte:
   1. Fijate si están instalados Git y Node.js versión 24 o más nueva.
      Si falta alguno, instalalo vos.
   2. Descargá el material del taller desde <URL-DEL-REPO> a una
      carpeta "taller-agentes" en mi carpeta personal.
   3. Entrá a esa carpeta y corré: bash scripts/preparar.sh
   4. Verificá que todo haya quedado bien y terminá diciéndome
      "✅ Listo para el taller" con la ubicación de la carpeta.

7. Esperá el "✅ Listo para el taller" (tarda unos minutos).
   Si se traba, mandanos una captura y lo vemos.
```

**Qué es de quién** (aclaralo en la intro del taller):
- **Del participante**: su Telegram, su calendario de Google, su cuenta de Claude y su cuenta de Vercel. El agente trabaja con las cosas de él.
- **Tuyo (organizador)**: la llave del modelo (AI Gateway) y el OAuth client de Google. Se reparten el día del evento.
- Lo que se crea **durante** el taller, guiado y en 1-2 min: el bot de @BotFather, la conexión del chat de Telegram, el permiso de Google Calendar y el login de Vercel (`vercel login`, con la cuenta que ya trajeron).

## 4. El día del taller

- Wifi decente (el paso de instalación ya vino hecho de casa; el taller usa poca red).
- Tené a mano: la llave del modelo, y Client ID/Secret de Google.
- Timing sugerido: 5' intro y reparto de llaves → 25' hands-on siguiendo [GUIA-TALLER.md](GUIA-TALLER.md).
- Cierre sugerido: que 2-3 personas muestren el mensaje que les llegó al Telegram.

## Costos de referencia

- Modelo: centavos por participante en un taller de 30 min.
- Vercel: el plan gratuito (Hobby) alcanza para publicar el agente de cada participante en su propia cuenta.
- Telegram y feeds RSS: gratis.
