// Los datos de la herramienta viven en el navegador (localStorage).
// Sin base de datos ni cuentas: se abre y funciona. La contra, que hay que
// decir de frente: los datos son de esta computadora y este navegador.

import type { Campo, Espec } from "./espec";

export type Registro = Record<string, unknown> & { id: string; estado: string };

type Guardado = {
  /** Si cambia la forma de guardar, este número evita romper lo que ya había. */
  version: number;
  /** Huella de la especificación: si cambia mucho, se resiembra. */
  huella: string;
  registros: Registro[];
};

const VERSION = 1;

function clave(espec: Espec) {
  return `herramienta:${espec.herramienta.nombre}`;
}

/** Huella simple de la estructura, para detectar que la especificación cambió. */
function huellaDe(espec: Espec) {
  const partes = [
    espec.campos.map((c) => `${c.id}:${c.tipo}`).join(","),
    espec.estados.valores.join(","),
  ];
  return partes.join("|");
}

export function nuevoId() {
  return `r_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/** Completa un registro de la semilla con id y estado válidos. */
function normalizar(registro: Record<string, unknown>, espec: Espec): Registro {
  const estado =
    typeof registro.estado === "string" && espec.estados.valores.includes(registro.estado)
      ? registro.estado
      : espec.estados.valores[0];
  return { ...registro, id: typeof registro.id === "string" ? registro.id : nuevoId(), estado };
}

export function sembrar(espec: Espec): Registro[] {
  return espec.semilla.map((r) => normalizar(r, espec));
}

export function cargar(espec: Espec): Registro[] {
  if (typeof window === "undefined") return sembrar(espec);
  try {
    const crudo = window.localStorage.getItem(clave(espec));
    if (!crudo) {
      const inicial = sembrar(espec);
      guardar(espec, inicial);
      return inicial;
    }
    const guardado = JSON.parse(crudo) as Guardado;
    if (guardado.version !== VERSION || guardado.huella !== huellaDe(espec)) {
      // La herramienta cambió de forma: volvemos a los datos de ejemplo nuevos.
      const inicial = sembrar(espec);
      guardar(espec, inicial);
      return inicial;
    }
    return guardado.registros.map((r) => normalizar(r, espec));
  } catch {
    return sembrar(espec);
  }
}

export function guardar(espec: Espec, registros: Registro[]) {
  if (typeof window === "undefined") return;
  const guardado: Guardado = { version: VERSION, huella: huellaDe(espec), registros };
  window.localStorage.setItem(clave(espec), JSON.stringify(guardado));
}

export function crear(espec: Espec, registros: Registro[], datos: Record<string, unknown>) {
  return [...registros, normalizar({ ...datos, id: nuevoId() }, espec)];
}

export function actualizar(registros: Registro[], id: string, cambios: Record<string, unknown>) {
  return registros.map((r) => (r.id === id ? { ...r, ...cambios, id: r.id } : r));
}

export function mover(espec: Espec, registros: Registro[], id: string, estado: string) {
  if (!espec.estados.valores.includes(estado)) return registros;
  return registros.map((r) => (r.id === id ? { ...r, estado } : r));
}

export function borrar(registros: Registro[], id: string) {
  return registros.filter((r) => r.id !== id);
}

/**
 * Convierte el texto de una fecha en Date. Las fechas sin hora ("2026-07-28") se
 * leen como día local: si no, el navegador las toma como UTC y en América se
 * muestran un día antes.
 */
function aFecha(valor: unknown): Date | null {
  const texto = String(valor);
  const soloDia = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const d = soloDia
    ? new Date(Number(soloDia[1]), Number(soloDia[2]) - 1, Number(soloDia[3]))
    : new Date(texto);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Valor a mostrar de un campo, ya formateado para leer. */
export function mostrar(registro: Registro, campo: Campo, zonaHoraria?: string): string {
  const valor = registro[campo.id];
  if (valor === undefined || valor === null || valor === "") return "";
  switch (campo.tipo) {
    case "moneda": {
      const n = Number(valor);
      return Number.isFinite(n) ? `$${n.toLocaleString("es-AR")}` : String(valor);
    }
    case "fecha": {
      const d = aFecha(valor);
      if (!d) return String(valor);
      return new Intl.DateTimeFormat("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: zonaHoraria,
      }).format(d);
    }
    case "booleano":
      return valor ? "Sí" : "No";
    case "etiquetas":
      return Array.isArray(valor) ? valor.join(", ") : String(valor);
    default:
      return String(valor);
  }
}

/** Resuelve los campos calculados. Catálogo cerrado de fórmulas, nunca eval. */
export function calcular(registro: Registro, espec: Espec): Record<string, string> {
  const salida: Record<string, string> = {};
  const dias = (desde: Date, hasta: Date) =>
    Math.round((hasta.getTime() - desde.getTime()) / 86_400_000);

  for (const calc of espec.calculados) {
    const args = calc.argumentos.map((id) => registro[id]);
    let resultado: number | null = null;

    switch (calc.formula) {
      case "dias_desde": {
        const d = aFecha(args[0]);
        if (d) resultado = dias(d, new Date());
        break;
      }
      case "dias_hasta": {
        const d = aFecha(args[0]);
        if (d) resultado = dias(new Date(), d);
        break;
      }
      case "multiplicar":
        resultado = Number(args[0]) * Number(args[1]);
        break;
      case "sumar":
        resultado = Number(args[0]) + Number(args[1]);
        break;
      case "restar":
        resultado = Number(args[0]) - Number(args[1]);
        break;
    }

    if (resultado !== null && Number.isFinite(resultado)) {
      salida[calc.id] = `${resultado.toLocaleString("es-AR")}${calc.sufijo ?? ""}`;
    }
  }
  return salida;
}

/** Valores de los indicadores del encabezado. */
export function indicadores(registros: Registro[], espec: Espec) {
  return espec.indicadores.map((ind) => {
    const alcance = ind.estado ? registros.filter((r) => r.estado === ind.estado) : registros;
    if (ind.tipo === "cantidad") {
      return { etiqueta: ind.etiqueta, valor: String(alcance.length) };
    }
    const total = alcance.reduce((acc, r) => acc + (Number(r[ind.campo as string]) || 0), 0);
    return { etiqueta: ind.etiqueta, valor: `$${total.toLocaleString("es-AR")}` };
  });
}

/** Foto compacta de los datos para mandarle al asistente. */
export function fotoParaIA(registros: Registro[], espec: Espec) {
  return registros.map((r) => {
    const fila: Record<string, unknown> = { id: r.id, estado: r.estado };
    for (const campo of espec.campos) {
      if (r[campo.id] !== undefined && r[campo.id] !== "") fila[campo.id] = r[campo.id];
    }
    return { ...fila, ...calcular(r, espec) };
  });
}
