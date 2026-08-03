import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { defineTool } from "eve/tools";
import { z } from "zod";

import { validarEspec } from "../../lib/espec";

// El asistente nunca escribe en los datos: propone. Esta herramienta valida
// cada propuesta contra la especificación y se la devuelve a la pantalla, que
// la muestra y espera que la persona toque "Aplicar".

const accionSchema = z.object({
  tipo: z.enum(["crear", "actualizar", "mover"]),
  id: z.string().optional().describe("Id del registro. Obligatorio para actualizar y mover."),
  datos: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Campos a escribir, usando los ids de la especificación."),
  estado: z.string().optional().describe("Estado destino. Obligatorio para mover."),
  porQue: z.string().describe("Una línea explicando el cambio, en criollo, para la persona."),
});

async function leerEspec() {
  const crudo = await readFile(join(process.cwd(), "config", "espec.json"), "utf8");
  const resultado = validarEspec(JSON.parse(crudo));
  if (!resultado.ok) throw new Error(`La especificación tiene errores: ${resultado.errores[0]}`);
  return resultado.espec;
}

export default defineTool({
  description:
    "Propone cambios sobre las fichas: crear una nueva, actualizar campos o moverla de estado. " +
    "No los aplica: la persona los confirma en la pantalla. Usala cuando te pidan cargar, " +
    "modificar o mover algo. Para responder preguntas no hace falta.",
  inputSchema: z.object({
    acciones: z.array(accionSchema).min(1).max(10),
  }),
  async execute({ acciones }) {
    const espec = await leerEspec();
    const idsCampos = new Set(espec.campos.map((c) => c.id));

    const aceptadas: z.infer<typeof accionSchema>[] = [];
    const rechazadas: { accion: unknown; motivo: string }[] = [];

    for (const accion of acciones) {
      const rechazar = (motivo: string) => rechazadas.push({ accion, motivo });

      if (accion.tipo !== "crear" && !accion.id) {
        rechazar("falta el id del registro");
        continue;
      }

      if (accion.estado && !espec.estados.valores.includes(accion.estado)) {
        rechazar(
          `el estado "${accion.estado}" no existe. Los válidos son: ${espec.estados.valores.join(", ")}`,
        );
        continue;
      }

      if (accion.tipo === "mover" && !accion.estado) {
        rechazar("mover necesita un estado destino");
        continue;
      }

      const camposInvalidos = Object.keys(accion.datos ?? {}).filter(
        (id) => id !== "estado" && !idsCampos.has(id),
      );
      if (camposInvalidos.length > 0) {
        rechazar(
          `estos campos no existen: ${camposInvalidos.join(", ")}. Los válidos son: ${[...idsCampos].join(", ")}`,
        );
        continue;
      }

      // Un campo de opción solo acepta los valores declarados.
      let opcionInvalida: string | null = null;
      for (const [id, valor] of Object.entries(accion.datos ?? {})) {
        const campo = espec.campos.find((c) => c.id === id);
        if (campo?.tipo === "opcion" && valor && !campo.opciones?.includes(String(valor))) {
          opcionInvalida = `"${valor}" no es una opción válida de ${campo.etiqueta} (${campo.opciones?.join(", ")})`;
          break;
        }
      }
      if (opcionInvalida) {
        rechazar(opcionInvalida);
        continue;
      }

      if (accion.tipo === "crear") {
        const titulo = accion.datos?.[espec.registro.campoTitulo];
        if (!titulo || !String(titulo).trim()) {
          rechazar(`para crear hace falta al menos "${espec.registro.campoTitulo}"`);
          continue;
        }
      }

      aceptadas.push(accion);
    }

    return {
      tipo: "propuesta" as const,
      aceptadas,
      rechazadas,
      // El modelo lee esto y le cuenta a la persona qué pasó.
      nota:
        rechazadas.length > 0
          ? "Algunas acciones no pasaron la validación. Contale a la persona cuáles y por qué, sin tecnicismos."
          : "Contale en una línea qué propusiste y que lo confirme en la pantalla.",
    };
  },
});
