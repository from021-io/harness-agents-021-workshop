"use client";

// Menú lateral. Las entradas salen de la especificación: cada una es una vista
// completa o una vista filtrada por estado (por ejemplo "Para entregar hoy").

import type { EntradaMenu, Espec } from "@/lib/espec";
import type { Registro } from "@/lib/datos";
import { Badge } from "@/components/ui/badge";

type Props = {
  espec: Espec;
  menu: EntradaMenu[];
  registros: Registro[];
  activa: string;
  onElegir: (id: string) => void;
};

export function MenuLateral({ espec, menu, registros, activa, onElegir }: Props) {
  const contar = (entrada: EntradaMenu) =>
    entrada.estado ? registros.filter((r) => r.estado === entrada.estado).length : registros.length;

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-56 shrink-0 flex-col gap-1 border-r p-3 md:flex">
      <div className="mb-3 px-2 py-1">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <span aria-hidden>{espec.herramienta.emoji}</span>
          <span className="truncate">{espec.herramienta.nombre}</span>
        </p>
      </div>

      <nav className="grid gap-0.5">
        {menu.map((entrada) => {
          const seleccionada = entrada.id === activa;
          return (
            <button
              key={entrada.id}
              type="button"
              onClick={() => onElegir(entrada.id)}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                seleccionada
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                  : "hover:bg-sidebar-accent"
              }`}
            >
              <span className="truncate">{entrada.etiqueta}</span>
              <Badge
                variant={seleccionada ? "secondary" : "outline"}
                className="ml-2 shrink-0 text-[11px]"
              >
                {contar(entrada)}
              </Badge>
            </button>
          );
        })}
      </nav>

      <p className="text-muted-foreground mt-auto px-2 text-[11px] leading-relaxed">
        Tus datos se guardan en este navegador, en esta computadora.
      </p>
    </aside>
  );
}
