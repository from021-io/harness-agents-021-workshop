"use client";

// Alta y edición de una ficha. El formulario se arma solo, leyendo los campos
// de la especificación: no hay un formulario por herramienta.

import { useState } from "react";
import type { Espec } from "@/lib/espec";
import type { Registro } from "@/lib/datos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CampoInput } from "./campo-input";

type Props = {
  espec: Espec;
  abierto: boolean;
  registro?: Registro | null;
  onCerrar: () => void;
  onGuardar: (datos: Record<string, unknown>) => void;
};

export function Formulario({ espec, abierto, registro, onCerrar, onGuardar }: Props) {
  const [valores, setValores] = useState<Record<string, unknown>>({});
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [ultimoId, setUltimoId] = useState<string | null>(null);

  // Al abrir con otra ficha, cargamos sus valores.
  const claveActual = registro?.id ?? "nuevo";
  if (abierto && ultimoId !== claveActual) {
    setUltimoId(claveActual);
    setValores(registro ? { ...registro } : { estado: espec.estados.valores[0] });
    setFaltantes([]);
  }

  const editando = Boolean(registro);

  const guardar = () => {
    const sinCompletar = espec.campos
      .filter((c) => c.requerido && !String(valores[c.id] ?? "").trim())
      .map((c) => c.id);
    if (sinCompletar.length > 0) {
      setFaltantes(sinCompletar);
      return;
    }
    onGuardar(valores);
    onCerrar();
  };

  return (
    <Dialog open={abierto} onOpenChange={(v) => !v && onCerrar()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editando ? `Editar ${espec.registro.singular}` : `Nuevo ${espec.registro.singular}`}
          </DialogTitle>
          <DialogDescription>
            Completá lo que sepas. Después se puede editar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="campo-estado">{espec.estados.etiqueta}</Label>
            <Select
              value={String(valores.estado ?? espec.estados.valores[0])}
              onValueChange={(v) => setValores((prev) => ({ ...prev, estado: v }))}
            >
              <SelectTrigger id="campo-estado" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {espec.estados.valores.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {espec.campos.map((campo) => (
            <div key={campo.id}>
              <CampoInput
                campo={campo}
                valor={valores[campo.id]}
                onChange={(v) => setValores((prev) => ({ ...prev, [campo.id]: v }))}
              />
              {faltantes.includes(campo.id) && (
                <p className="text-destructive mt-1 text-xs">Falta completar esto.</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button onClick={guardar}>{editando ? "Guardar cambios" : "Crear"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
