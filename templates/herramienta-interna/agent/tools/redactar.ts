import { defineTool } from "eve/tools";
import { z } from "zod";

// Devuelve un texto listo para copiar (un mail, un mensaje, un resumen).
// No toca ningún dato: solo escribe.

export default defineTool({
  description:
    "Entrega un texto redactado para que la persona lo copie: un mail de seguimiento, " +
    "un mensaje, un resumen. Usala cuando te pidan escribir algo. No modifica ninguna ficha.",
  inputSchema: z.object({
    titulo: z.string().describe("De qué es el texto, en pocas palabras. Ej: 'Mail para Laura'."),
    texto: z.string().min(1).describe("El texto completo, listo para copiar y pegar."),
  }),
  async execute({ titulo, texto }) {
    return { tipo: "redaccion" as const, titulo, texto };
  },
});
