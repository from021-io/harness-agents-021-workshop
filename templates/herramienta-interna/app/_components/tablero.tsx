"use client";

// Vista de columnas por estado. Se puede arrastrar una ficha de una columna a
// otra para moverla, que es la acción más común de toda herramienta interna.

import { useState } from "react";
import type { Espec } from "@/lib/espec";
import { calcular, mostrar, type Registro } from "@/lib/datos";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Props = {
  espec: Espec;
  registros: Registro[];
  zonaHoraria?: string;
  onAbrir: (registro: Registro) => void;
  onMover: (id: string, estado: string) => void;
};

export function Tablero({ espec, registros, zonaHoraria, onAbrir, onMover }: Props) {
  const [encima, setEncima] = useState<string | null>(null);
  const camposTarjeta = espec.campos.filter((c) => c.enTarjeta && c.id !== espec.registro.campoTitulo);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {espec.estados.valores.map((estado) => {
        const enEstado = registros.filter((r) => r.estado === estado);
        return (
          <section
            key={estado}
            onDragOver={(e) => {
              e.preventDefault();
              setEncima(estado);
            }}
            onDragLeave={() => setEncima((prev) => (prev === estado ? null : prev))}
            onDrop={(e) => {
              e.preventDefault();
              setEncima(null);
              const id = e.dataTransfer.getData("text/plain");
              if (id) onMover(id, estado);
            }}
            className={`bg-muted/40 flex w-72 shrink-0 flex-col gap-2 rounded-lg p-3 transition-colors ${
              encima === estado ? "ring-primary bg-muted ring-2" : ""
            }`}
          >
            <header className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium">{estado}</h2>
              <Badge variant="secondary">{enEstado.length}</Badge>
            </header>

            {enEstado.length === 0 && (
              <p className="text-muted-foreground px-1 py-6 text-center text-xs">
                Nada por acá todavía
              </p>
            )}

            {enEstado.map((registro) => {
              const calculados = calcular(registro, espec);
              return (
                <Card
                  key={registro.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", registro.id)}
                  onClick={() => onAbrir(registro)}
                  className="hover:border-primary/50 cursor-pointer gap-2 p-3 transition-colors"
                >
                  <p className="text-sm leading-snug font-medium">
                    {String(registro[espec.registro.campoTitulo] ?? "Sin título")}
                  </p>

                  {camposTarjeta.map((campo) => {
                    const texto = mostrar(registro, campo, zonaHoraria);
                    if (!texto) return null;
                    return (
                      <p key={campo.id} className="text-muted-foreground text-xs">
                        {texto}
                      </p>
                    );
                  })}

                  {Object.entries(calculados).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {espec.calculados.map((calc) =>
                        calculados[calc.id] ? (
                          <Badge key={calc.id} variant="outline" className="text-[11px] font-normal">
                            {calc.etiqueta}: {calculados[calc.id]}
                          </Badge>
                        ) : null,
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
