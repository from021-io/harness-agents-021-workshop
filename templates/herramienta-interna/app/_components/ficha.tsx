"use client";

// Detalle de una ficha: todos sus datos, su sub-lista (si la especificación la
// define) y los atajos de IA que aplican a esta ficha en particular.

import { useState } from "react";
import type { Espec } from "@/lib/espec";
import { calcular, mostrar, nuevoId, type Registro } from "@/lib/datos";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CampoInput } from "./campo-input";

type Props = {
  espec: Espec;
  registro: Registro | null;
  zonaHoraria?: string;
  onCerrar: () => void;
  onEditar: (registro: Registro) => void;
  onBorrar: (id: string) => void;
  onActualizar: (id: string, cambios: Record<string, unknown>) => void;
  onAccionIA: (accionId: string, registro: Registro) => void;
};

export function Ficha({
  espec,
  registro,
  zonaHoraria,
  onCerrar,
  onEditar,
  onBorrar,
  onActualizar,
  onAccionIA,
}: Props) {
  const [nuevoItem, setNuevoItem] = useState<Record<string, unknown>>({});

  if (!registro) return null;

  const calculados = calcular(registro, espec);
  const accionesFicha = espec.accionesIA.filter((a) => a.alcance === "ficha");
  const subLista = espec.subLista;
  const items = subLista
    ? ((registro[subLista.id] as Record<string, unknown>[] | undefined) ?? [])
    : [];

  const agregarItem = () => {
    if (!subLista) return;
    const faltan = subLista.campos.filter(
      (c) => c.requerido && !String(nuevoItem[c.id] ?? "").trim(),
    );
    if (faltan.length > 0) return;
    onActualizar(registro.id, {
      [subLista.id]: [...items, { ...nuevoItem, id: nuevoId() }],
    });
    setNuevoItem({});
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onCerrar()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {String(registro[espec.registro.campoTitulo] ?? "Sin título")}
            <Badge variant="secondary">{registro.estado}</Badge>
          </DialogTitle>
          <DialogDescription>{espec.registro.singular}</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 py-2 sm:grid-cols-2">
          {espec.campos
            .filter((c) => c.id !== espec.registro.campoTitulo)
            .map((campo) => {
              const texto = mostrar(registro, campo, zonaHoraria);
              if (!texto) return null;
              return (
                <div key={campo.id} className={campo.tipo === "nota" ? "sm:col-span-2" : undefined}>
                  <dt className="text-muted-foreground text-xs">{campo.etiqueta}</dt>
                  <dd className="text-sm whitespace-pre-wrap">{texto}</dd>
                </div>
              );
            })}

          {espec.calculados.map((calc) =>
            calculados[calc.id] ? (
              <div key={calc.id}>
                <dt className="text-muted-foreground text-xs">{calc.etiqueta}</dt>
                <dd className="text-sm">{calculados[calc.id]}</dd>
              </div>
            ) : null,
          )}
        </dl>

        {accionesFicha.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-2 py-1">
              {accionesFicha.map((accion) => (
                <Button
                  key={accion.id}
                  size="sm"
                  variant="outline"
                  onClick={() => onAccionIA(accion.id, registro)}
                >
                  ✨ {accion.etiqueta}
                </Button>
              ))}
            </div>
          </>
        )}

        {subLista && (
          <>
            <Separator />
            <section className="grid gap-2 py-1">
              <h3 className="text-sm font-medium">{subLista.plural}</h3>

              {items.length === 0 && (
                <p className="text-muted-foreground text-xs">Todavía no hay {subLista.plural.toLowerCase()}.</p>
              )}

              {items.map((item, i) => (
                <div key={String(item.id ?? i)} className="bg-muted/50 grid gap-0.5 rounded-md p-2">
                  {subLista.campos.map((campo) => {
                    const texto = mostrar(item as Registro, campo, zonaHoraria);
                    if (!texto) return null;
                    return (
                      <p key={campo.id} className="text-sm">
                        <span className="text-muted-foreground text-xs">{campo.etiqueta}: </span>
                        {texto}
                      </p>
                    );
                  })}
                </div>
              ))}

              <div className="grid gap-2 rounded-md border border-dashed p-3">
                {subLista.campos.map((campo) => (
                  <CampoInput
                    key={campo.id}
                    campo={campo}
                    valor={nuevoItem[campo.id]}
                    onChange={(v) => setNuevoItem((prev) => ({ ...prev, [campo.id]: v }))}
                  />
                ))}
                <Button size="sm" variant="secondary" onClick={agregarItem}>
                  Agregar {subLista.singular.toLowerCase()}
                </Button>
              </div>
            </section>
          </>
        )}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              onBorrar(registro.id);
              onCerrar();
            }}
          >
            Borrar
          </Button>
          <Button onClick={() => onEditar(registro)}>Editar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
