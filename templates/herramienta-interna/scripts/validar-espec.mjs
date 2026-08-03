#!/usr/bin/env node
// Revisa que la especificación de la herramienta esté bien formada antes de
// levantarla. Mejor descubrir un error acá que en una pantalla rota.
//
// Uso: npm run validar-espec            (valida config/espec.json)
//      npm run validar-espec -- todas   (valida también todas las recetas)

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Node 24 lee TypeScript directo, así que reusamos el mismo validador que la app.
let validarEspec;
try {
  ({ validarEspec } = await import("../lib/espec.ts"));
} catch (e) {
  console.error("No pude leer lib/espec.ts. Necesitás Node 24 o más nuevo.");
  console.error(e.message);
  process.exit(1);
}

const raiz = process.cwd();
const objetivos = [];

const especPath = join(raiz, "config", "espec.json");
if (existsSync(especPath)) objetivos.push(["config/espec.json", especPath]);

if (process.argv.includes("todas")) {
  const recetasDir = join(raiz, "recetas");
  if (existsSync(recetasDir)) {
    for (const archivo of readdirSync(recetasDir).filter((f) => f.endsWith(".json"))) {
      objetivos.push([`recetas/${archivo}`, join(recetasDir, archivo)]);
    }
  }
}

if (objetivos.length === 0) {
  console.error("No encontré config/espec.json. ¿Ya se creó la herramienta?");
  process.exit(1);
}

let fallo = false;

for (const [nombre, ruta] of objetivos) {
  let datos;
  try {
    datos = JSON.parse(readFileSync(ruta, "utf8"));
  } catch (e) {
    console.error(`❌ ${nombre}: el archivo no es un JSON válido (${e.message})`);
    fallo = true;
    continue;
  }

  const resultado = validarEspec(datos);
  if (resultado.ok) {
    const e = resultado.espec;
    console.log(
      `✅ ${nombre}: "${e.herramienta.nombre}" con ${e.campos.length} campos, ` +
        `${e.estados.valores.length} estados y ${e.semilla.length} registros de ejemplo.`,
    );
  } else {
    console.error(`❌ ${nombre}:`);
    for (const error of resultado.errores) console.error(`   - ${error}`);
    fallo = true;
  }
}

process.exit(fallo ? 1 : 0);
