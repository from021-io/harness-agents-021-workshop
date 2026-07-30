import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Lee la lista de tareas pendientes (backlog) del dueño desde data/backlog.md. " +
    "Devuelve el texto tal cual está escrito, con sus prioridades y notas.",
  inputSchema: z.object({}),
  async execute() {
    try {
      const contenido = await readFile(join(process.cwd(), "data", "backlog.md"), "utf8");
      return { backlog: contenido };
    } catch {
      return { backlog: null, nota: "No existe data/backlog.md todavía." };
    }
  },
});
