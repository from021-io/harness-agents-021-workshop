// La especificación es el contrato de la herramienta: describe qué es cada
// ficha, qué datos tiene, por qué estados pasa y qué puede hacer la IA.
// Toda la app se arma leyendo este archivo, así que se valida al cargarlo.

import { z } from "zod";

/** Tipos de campo soportados. Cerrado a propósito: el motor sabe dibujar cada uno. */
export const TIPOS_CAMPO = [
  "texto",
  "nota",
  "numero",
  "moneda",
  "fecha",
  "opcion",
  "email",
  "telefono",
  "booleano",
  "etiquetas",
] as const;

/** Fórmulas permitidas para campos calculados. Cerrado: nunca se evalúa código. */
export const FORMULAS = ["dias_desde", "dias_hasta", "multiplicar", "sumar", "restar"] as const;

const idSchema = z
  .string()
  .min(1)
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "el id debe empezar con letra y usar solo letras, números o guion bajo");

const campoSchema = z.object({
  id: idSchema,
  etiqueta: z.string().min(1),
  tipo: z.enum(TIPOS_CAMPO),
  requerido: z.boolean().default(false),
  /** Se muestra en la tarjeta del tablero, no solo en la ficha. */
  enTarjeta: z.boolean().default(false),
  /** Solo para tipo "opcion". */
  opciones: z.array(z.string().min(1)).optional(),
  ayuda: z.string().optional(),
});

const campoCalculadoSchema = z.object({
  id: idSchema,
  etiqueta: z.string().min(1),
  formula: z.enum(FORMULAS),
  /** Ids de campos sobre los que opera la fórmula. */
  argumentos: z.array(idSchema).min(1),
  sufijo: z.string().optional(),
});

const subListaSchema = z.object({
  id: idSchema,
  singular: z.string().min(1),
  plural: z.string().min(1),
  campos: z.array(campoSchema).min(1),
});

const indicadorSchema = z.object({
  etiqueta: z.string().min(1),
  tipo: z.enum(["cantidad", "suma"]),
  /** Para "suma": qué campo sumar. */
  campo: idSchema.optional(),
  /** Filtro opcional por estado. */
  estado: z.string().optional(),
});

/** Entrada del menú lateral: una vista completa o una vista filtrada por estado. */
const navegacionSchema = z.object({
  id: idSchema,
  etiqueta: z.string().min(1),
  vista: z.enum(["tablero", "lista"]).default("lista"),
  /** Si está, la entrada muestra solo las fichas en ese estado. */
  estado: z.string().optional(),
});

const accionIASchema = z.object({
  id: idSchema,
  etiqueta: z.string().min(1),
  alcance: z.enum(["tablero", "ficha"]),
  prompt: z.string().min(1),
});

export const especSchema = z
  .object({
    version: z.literal(1).default(1),
    herramienta: z.object({
      nombre: z.string().min(1),
      queResuelve: z.string().default(""),
      emoji: z.string().default("📋"),
      /** Color principal en hex (#2563eb). Tiñe botones, acentos y el menú. */
      color: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, "el color debe ser un hex de 6 dígitos, por ejemplo #2563eb")
        .optional(),
    }),
    registro: z.object({
      singular: z.string().min(1),
      plural: z.string().min(1),
      campoTitulo: idSchema,
    }),
    campos: z.array(campoSchema).min(1),
    calculados: z.array(campoCalculadoSchema).default([]),
    subLista: subListaSchema.optional(),
    estados: z.object({
      etiqueta: z.string().default("Estado"),
      valores: z.array(z.string().min(1)).min(2),
    }),
    indicadores: z.array(indicadorSchema).default([]),
    vistas: z
      .object({ inicial: z.enum(["tablero", "lista"]).default("tablero") })
      .default({ inicial: "tablero" }),
    navegacion: z.array(navegacionSchema).default([]),
    accionesIA: z.array(accionIASchema).default([]),
    semilla: z.array(z.record(z.string(), z.unknown())).default([]),
  })
  // Las reglas cruzadas: acá se atrapan los errores que un schema plano deja pasar.
  .superRefine((espec, ctx) => {
    const ids = new Set(espec.campos.map((c) => c.id));

    const error = (mensaje: string, path: (string | number)[]) =>
      ctx.addIssue({ code: "custom", message: mensaje, path });

    if (!ids.has(espec.registro.campoTitulo)) {
      error(
        `campoTitulo "${espec.registro.campoTitulo}" no existe entre los campos`,
        ["registro", "campoTitulo"],
      );
    }

    espec.campos.forEach((campo, i) => {
      if (campo.tipo === "opcion" && (!campo.opciones || campo.opciones.length === 0)) {
        error(`el campo "${campo.id}" es de tipo opcion y necesita "opciones"`, ["campos", i]);
      }
    });

    espec.calculados.forEach((calc, i) => {
      for (const arg of calc.argumentos) {
        if (!ids.has(arg)) {
          error(`el calculado "${calc.id}" usa el campo "${arg}", que no existe`, ["calculados", i]);
        }
      }
      const esperados = calc.formula === "dias_desde" || calc.formula === "dias_hasta" ? 1 : 2;
      if (calc.argumentos.length !== esperados) {
        error(
          `la fórmula "${calc.formula}" espera ${esperados} campo(s) y recibió ${calc.argumentos.length}`,
          ["calculados", i],
        );
      }
    });

    espec.indicadores.forEach((ind, i) => {
      if (ind.tipo === "suma" && (!ind.campo || !ids.has(ind.campo))) {
        error(`el indicador "${ind.etiqueta}" suma un campo que no existe`, ["indicadores", i]);
      }
      if (ind.estado && !espec.estados.valores.includes(ind.estado)) {
        error(`el indicador "${ind.etiqueta}" filtra por un estado que no existe`, ["indicadores", i]);
      }
    });

    espec.navegacion.forEach((entrada, i) => {
      if (entrada.estado && !espec.estados.valores.includes(entrada.estado)) {
        error(`la entrada de menú "${entrada.etiqueta}" filtra por un estado que no existe`, [
          "navegacion",
          i,
        ]);
      }
    });

    espec.semilla.forEach((registro, i) => {
      const estado = registro.estado;
      if (typeof estado === "string" && !espec.estados.valores.includes(estado)) {
        error(`el registro de ejemplo ${i + 1} tiene el estado "${estado}", que no existe`, [
          "semilla",
          i,
        ]);
      }
    });
  });

export type Espec = z.infer<typeof especSchema>;
export type EntradaMenu = z.infer<typeof navegacionSchema>;
export type Campo = z.infer<typeof campoSchema>;
export type CampoCalculado = z.infer<typeof campoCalculadoSchema>;
export type AccionIA = z.infer<typeof accionIASchema>;
export type Indicador = z.infer<typeof indicadorSchema>;
export type TipoCampo = (typeof TIPOS_CAMPO)[number];

/**
 * Menú lateral efectivo. Si la especificación no trae uno, armamos el mínimo
 * razonable: las dos vistas completas.
 */
export function menuDe(espec: Espec): EntradaMenu[] {
  if (espec.navegacion.length > 0) return espec.navegacion;
  return [
    { id: "tablero", etiqueta: "Tablero", vista: "tablero" },
    { id: "lista", etiqueta: "Lista", vista: "lista" },
  ];
}

/**
 * Traduce el color elegido a las variables que usa toda la interfaz. Con esto
 * alcanza para teñir la herramienta entera: nadie edita CSS a mano.
 */
export function variablesDeColor(color?: string): Record<string, string> {
  if (!color) return {};
  const n = Number.parseInt(color.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  // Luminancia relativa, para decidir si el texto encima va claro u oscuro.
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const contraste = lum > 0.6 ? "#111111" : "#ffffff";
  const mezcla = (pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
  return {
    "--primary": color,
    "--primary-foreground": contraste,
    "--ring": color,
    "--sidebar-primary": color,
    "--sidebar-primary-foreground": contraste,
    "--sidebar-accent": mezcla(12),
    "--accent": mezcla(12),
  };
}

/** Valida una especificación y devuelve errores en castellano, listos para mostrar. */
export function validarEspec(datos: unknown):
  | { ok: true; espec: Espec }
  | { ok: false; errores: string[] } {
  const resultado = especSchema.safeParse(datos);
  if (resultado.success) return { ok: true, espec: resultado.data };
  const errores = resultado.error.issues.map((issue) => {
    const donde = issue.path.length ? `${issue.path.join(" → ")}: ` : "";
    return `${donde}${issue.message}`;
  });
  return { ok: false, errores };
}
