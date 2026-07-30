import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineTool } from "eve/tools";
import Parser from "rss-parser";
import { z } from "zod";

type Fuente = { nombre: string; rss: string };
type Fuentes = Record<string, Fuente[]>;

const parser = new Parser({ timeout: 8000 });

async function leerFuentes(): Promise<Fuentes> {
  const raw = await readFile(join(process.cwd(), "config", "fuentes.json"), "utf8");
  return JSON.parse(raw) as Fuentes;
}

export default defineTool({
  description:
    "Busca los artículos publicados en las últimas horas en las fuentes RSS configuradas para un tema. " +
    "Devuelve título, resumen, link, fuente y fecha de cada artículo. " +
    "Los temas disponibles salen de config/fuentes.json.",
  inputSchema: z.object({
    tema: z
      .string()
      .min(1)
      .describe("Tema a buscar, debe existir en config/fuentes.json (ej: 'economia')"),
    horas: z
      .number()
      .int()
      .min(1)
      .max(168)
      .default(24)
      .describe("Ventana de tiempo hacia atrás en horas (default 24)"),
  }),
  async execute({ tema, horas }) {
    const fuentes = await leerFuentes();
    const lista = fuentes[tema];
    if (!lista) {
      return {
        error: `El tema "${tema}" no está configurado.`,
        temasDisponibles: Object.keys(fuentes),
      };
    }

    const desde = Date.now() - horas * 60 * 60 * 1000;
    const resultados = await Promise.allSettled(
      lista.map(async (fuente) => {
        const feed = await parser.parseURL(fuente.rss);
        return (feed.items ?? [])
          .filter((item) => {
            const fecha = item.isoDate ?? item.pubDate;
            return fecha ? new Date(fecha).getTime() >= desde : true;
          })
          .slice(0, 15)
          .map((item) => ({
            fuente: fuente.nombre,
            titulo: item.title ?? "(sin título)",
            resumen: (item.contentSnippet ?? "").slice(0, 300),
            link: item.link ?? "",
            fecha: item.isoDate ?? item.pubDate ?? null,
          }));
      }),
    );

    const articulos = resultados.flatMap((r) =>
      r.status === "fulfilled" ? r.value : [],
    );
    const fuentesCaidas = lista
      .filter((_, i) => resultados[i].status === "rejected")
      .map((f) => f.nombre);

    return { tema, articulos, fuentesCaidas };
  },
});
