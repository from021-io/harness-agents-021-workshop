"use client";

// Un solo lugar decide cómo se dibuja cada tipo de campo. Si mañana hay un tipo
// nuevo, se agrega acá y funciona en toda la herramienta.

import type { Campo } from "@/lib/espec";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  campo: Campo;
  valor: unknown;
  onChange: (valor: unknown) => void;
};

export function CampoInput({ campo, valor, onChange }: Props) {
  const id = `campo-${campo.id}`;

  const control = () => {
    switch (campo.tipo) {
      case "nota":
        return (
          <Textarea
            id={id}
            rows={3}
            value={String(valor ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "opcion":
        return (
          <Select value={String(valor ?? "")} onValueChange={onChange}>
            <SelectTrigger id={id} className="w-full">
              <SelectValue placeholder="Elegí una opción" />
            </SelectTrigger>
            <SelectContent>
              {(campo.opciones ?? []).map((opcion) => (
                <SelectItem key={opcion} value={opcion}>
                  {opcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "booleano":
        return (
          <div className="flex h-9 items-center">
            <Checkbox
              id={id}
              checked={Boolean(valor)}
              onCheckedChange={(marcado) => onChange(Boolean(marcado))}
            />
          </div>
        );

      case "etiquetas":
        return (
          <Input
            id={id}
            value={Array.isArray(valor) ? valor.join(", ") : String(valor ?? "")}
            placeholder="Separadas por coma"
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
          />
        );

      case "moneda":
      case "numero":
        return (
          <div className="relative">
            {campo.tipo === "moneda" && (
              <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                $
              </span>
            )}
            <Input
              id={id}
              type="number"
              inputMode="decimal"
              className={campo.tipo === "moneda" ? "pl-7" : undefined}
              value={String(valor ?? "")}
              onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        );

      default: {
        const tipoHtml =
          campo.tipo === "fecha"
            ? "date"
            : campo.tipo === "email"
              ? "email"
              : campo.tipo === "telefono"
                ? "tel"
                : "text";
        return (
          <Input
            id={id}
            type={tipoHtml}
            value={String(valor ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      }
    }
  };

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>
        {campo.etiqueta}
        {campo.requerido && <span className="text-muted-foreground"> *</span>}
      </Label>
      {control()}
      {campo.ayuda && <p className="text-muted-foreground text-xs">{campo.ayuda}</p>}
    </div>
  );
}
