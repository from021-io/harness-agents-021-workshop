"use client";

// Vista de tabla, para cuando hay muchas fichas y se quiere buscar o comparar.

import { useMemo, useState } from "react";
import type { Espec } from "@/lib/espec";
import { calcular, mostrar, type Registro } from "@/lib/datos";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  espec: Espec;
  registros: Registro[];
  zonaHoraria?: string;
  onAbrir: (registro: Registro) => void;
};

export function Lista({ espec, registros, zonaHoraria, onAbrir }: Props) {
  const [busqueda, setBusqueda] = useState("");
  // En la tabla mostramos el título, el estado y hasta cuatro campos más.
  const columnas = espec.campos.filter((c) => c.id !== espec.registro.campoTitulo).slice(0, 4);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return registros;
    return registros.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(q)),
    );
  }, [registros, busqueda]);

  return (
    <div className="grid gap-3">
      <Input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={`Buscar ${espec.registro.plural.toLowerCase()}...`}
        className="max-w-xs"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{espec.registro.singular}</TableHead>
              <TableHead>{espec.estados.etiqueta}</TableHead>
              {columnas.map((campo) => (
                <TableHead key={campo.id}>{campo.etiqueta}</TableHead>
              ))}
              {espec.calculados.map((calc) => (
                <TableHead key={calc.id}>{calc.etiqueta}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2 + columnas.length + espec.calculados.length}
                  className="text-muted-foreground py-8 text-center text-sm"
                >
                  No hay nada que coincida con la búsqueda.
                </TableCell>
              </TableRow>
            )}

            {filtrados.map((registro) => {
              const calculados = calcular(registro, espec);
              return (
                <TableRow
                  key={registro.id}
                  onClick={() => onAbrir(registro)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {String(registro[espec.registro.campoTitulo] ?? "Sin título")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{registro.estado}</Badge>
                  </TableCell>
                  {columnas.map((campo) => (
                    <TableCell key={campo.id} className="text-muted-foreground">
                      {mostrar(registro, campo, zonaHoraria)}
                    </TableCell>
                  ))}
                  {espec.calculados.map((calc) => (
                    <TableCell key={calc.id} className="text-muted-foreground">
                      {calculados[calc.id] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
