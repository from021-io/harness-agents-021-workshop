// Acceso a la API de Google Calendar usando el refresh token guardado
// por scripts/conectar-google.mjs. El access token se cachea en memoria.

let cache: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Falta conectar Google Calendar. Corré `npm run conectar-google` primero.",
    );
  }

  if (cache && cache.expiresAt > Date.now() + 60_000) {
    return cache.token;
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo renovar el acceso a Google (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cache = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cache.token;
}

export async function calendarApi(
  path: string,
  init?: { method?: string; body?: unknown; query?: Record<string, string> },
): Promise<unknown> {
  const token = await getAccessToken();
  const url = new URL(`https://www.googleapis.com/calendar/v3${path}`);
  for (const [k, v] of Object.entries(init?.query ?? {})) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Google Calendar respondió ${res.status}: ${await res.text()}`);
  }
  return res.json();
}
