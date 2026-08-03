import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { validarEspec } from "@/lib/espec";
import { Herramienta } from "./_components/herramienta";

export default async function Page() {
  const crudo = await readFile(join(process.cwd(), "config", "espec.json"), "utf8");
  const resultado = validarEspec(JSON.parse(crudo));

  // Si la especificación está rota, mostramos qué revisar en vez de una pantalla en blanco.
  if (!resultado.ok) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-lg font-semibold">Hay algo para corregir en la herramienta</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          El archivo <code>config/espec.json</code> tiene estos problemas:
        </p>
        <ul className="mt-4 grid gap-1 text-sm">
          {resultado.errores.map((error) => (
            <li key={error}>• {error}</li>
          ))}
        </ul>
      </main>
    );
  }

  return <Herramienta espec={resultado.espec} zonaHoraria={process.env.ZONA_HORARIA} />;
}
