# Camino avanzado: Supabase (base de datos + cuentas de usuario)

> ⛔ **Este camino NO se usa durante el taller.** La regla del harness es que la primera versión de tu agente nunca incluye base de datos ni autenticación. Esto es para después, cuando tu V1 ya funciona y querés más.

## Qué te da

- **Memoria de verdad**: que tu agente guarde historial, preferencias que aprende, noticias ya enviadas (para no repetir), tareas completadas.
- **Cuentas de usuario**: que otras personas usen tu agente, cada una con sus datos.

## Cómo se activa (pedíselo a Claude Code)

Abrí `claude` en la carpeta del repo y decile en tus palabras qué querés, por ejemplo:

> "Quiero que mi agente recuerde qué noticias ya me mandó para no repetir"

Claude Code va a seguir estos pasos (vos solo creás la cuenta):

1. Crear un proyecto gratuito en [supabase.com](https://supabase.com) (eso lo hacés vos: cuenta + botón "New project").
2. Copiar dos valores del panel de Supabase al `.env` de tu agente:
   ```
   SUPABASE_URL=          # Settings → API → Project URL
   SUPABASE_SERVICE_KEY=  # Settings → API → service_role key (¡secreta!)
   ```
3. Instalar el cliente en `mi-agente/`: `npm install @supabase/supabase-js`
4. Crear las tablas que necesite (con el SQL editor de Supabase) y las tools de eve para leer/escribir.

## Notas técnicas para el AI Engineer

- Cliente servidor-a-servidor con `service_role` key: solo en tools de eve (corren en el runtime del servidor, nunca en el navegador). No exponer la key en el frontend Next.
- Para memoria simple del agente, evaluar primero el estado propio de eve (`node_modules/eve/docs/guides/state.md`) antes de sumar Supabase: si con eso alcanza, no agregues la dependencia.
- Auth de usuarios finales (multi-usuario) es un proyecto en sí: requiere reemplazar `placeholderAuth()` en `agent/channels/eve.ts` por un proveedor real (ver `node_modules/eve/docs/guides/auth-and-route-protection.md`). Proponerlo solo si el dueño lo pide explícitamente.
