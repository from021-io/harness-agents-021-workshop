"use client";

// El panel de IA. Manda una foto de los datos con cada pregunta, muestra la
// respuesta y, cuando el asistente propone cambios, los deja a un click de
// distancia. Nunca escribe solo.

import { useEffect, useMemo, useRef, useState } from "react";
import { Client } from "eve/client";
import { useEveAgent } from "eve/react";
import type { Espec } from "@/lib/espec";
import {
  actualizar as actualizarRegistro,
  crear as crearRegistro,
  fotoParaIA,
  mover as moverRegistro,
  type Registro,
} from "@/lib/datos";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type Accion = {
  tipo: "crear" | "actualizar" | "mover";
  id?: string;
  datos?: Record<string, unknown>;
  estado?: string;
  porQue: string;
};

type Props = {
  espec: Espec;
  registros: Registro[];
  pedido: { prompt: string; nonce: number } | null;
  onAplicarCambios: (registros: Registro[]) => void;
};

export function Asistente({ espec, registros, pedido, onAplicarCambios }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [aplicadas, setAplicadas] = useState<string[]>([]);
  const ultimoPedido = useRef<number>(0);

  const [session] = useState(() => new Client({ host: "" }).session());
  const agente = useEveAgent({ session });
  const ocupado = agente.status === "submitted" || agente.status === "streaming";

  // Cada pregunta viaja con una foto de los datos: el asistente no tiene otra
  // forma de verlos, porque viven en este navegador. Va como clientContext, que
  // alcanza al modelo pero no ensucia el historial de la conversación.
  const preguntar = (consulta: string) => {
    if (!consulta.trim() || ocupado) return;
    const campos = espec.campos.map((c) => `${c.id} (${c.etiqueta}, ${c.tipo})`).join("; ");
    void agente.send({
      message: consulta,
      clientContext: [
        `Datos actuales, ${registros.length} ${espec.registro.plural.toLowerCase()}:`,
        JSON.stringify(fotoParaIA(registros, espec)),
        `Estados válidos: ${espec.estados.valores.join(", ")}.`,
        `Campos válidos: ${campos}.`,
      ].join("\n"),
    });
    setTexto("");
  };

  // Los atajos de la ficha abren el panel y disparan la consulta.
  useEffect(() => {
    if (!pedido || pedido.nonce === ultimoPedido.current) return;
    ultimoPedido.current = pedido.nonce;
    setAbierto(true);
    preguntar(pedido.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pedido]);

  const accionesTablero = espec.accionesIA.filter((a) => a.alcance === "tablero");

  // Buscamos propuestas y redacciones en lo que devolvieron las herramientas.
  const { propuestas, redacciones } = useMemo(() => {
    const propuestas: { clave: string; acciones: Accion[]; rechazadas: number }[] = [];
    const redacciones: { clave: string; titulo: string; texto: string }[] = [];

    agente.data.messages.forEach((mensaje, mi) => {
      mensaje.parts.forEach((parte, pi) => {
        if (parte.type !== "dynamic-tool" || !parte.output) return;
        const salida = parte.output as Record<string, unknown>;
        const clave = `${mi}-${pi}`;
        if (salida.tipo === "propuesta" && Array.isArray(salida.aceptadas)) {
          propuestas.push({
            clave,
            acciones: salida.aceptadas as Accion[],
            rechazadas: Array.isArray(salida.rechazadas) ? salida.rechazadas.length : 0,
          });
        }
        if (salida.tipo === "redaccion" && typeof salida.texto === "string") {
          redacciones.push({
            clave,
            titulo: String(salida.titulo ?? "Texto"),
            texto: salida.texto,
          });
        }
      });
    });

    return { propuestas, redacciones };
  }, [agente.data.messages]);

  const aplicar = (clave: string, acciones: Accion[]) => {
    let siguientes = registros;
    for (const accion of acciones) {
      if (accion.tipo === "crear") {
        siguientes = crearRegistro(espec, siguientes, accion.datos ?? {});
      } else if (accion.tipo === "mover" && accion.id && accion.estado) {
        siguientes = moverRegistro(espec, siguientes, accion.id, accion.estado);
      } else if (accion.tipo === "actualizar" && accion.id) {
        siguientes = actualizarRegistro(siguientes, accion.id, accion.datos ?? {});
      }
    }
    onAplicarCambios(siguientes);
    setAplicadas((prev) => [...prev, clave]);
  };

  const textoDe = (mensaje: (typeof agente.data.messages)[number]) =>
    mensaje.parts
      .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      .map((p) => p.text)
      .join("");

  return (
    <>
      {/* Burbuja fija abajo a la derecha, como cualquier chat de producto. */}
      <button
        type="button"
        aria-label={abierto ? "Cerrar asistente" : "Abrir asistente"}
        onClick={() => setAbierto((v) => !v)}
        className="bg-primary text-primary-foreground fixed right-5 bottom-5 z-50 grid h-14 w-14 place-items-center rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span
          className={`transition-all duration-200 ${abierto ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
        >
          <MessageCircle className="size-6" />
        </span>
        <span
          className={`absolute transition-all duration-200 ${abierto ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`}
        >
          <X className="size-6" />
        </span>
      </button>

      <div
        role="dialog"
        aria-label="Asistente"
        aria-hidden={!abierto}
        className={`bg-card fixed right-5 bottom-24 z-50 flex max-h-[min(600px,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-200 ease-out ${
          abierto
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        }`}
      >
        <header className="grid gap-0.5 border-b p-4">
          <p className="text-sm font-semibold">Asistente</p>
          <p className="text-muted-foreground text-xs">
            Preguntale sobre tus {espec.registro.plural.toLowerCase()}, dictale una ficha nueva o
            pedile que escriba algo.
          </p>
        </header>

        <ScrollArea className="flex-1">
          <div className="grid gap-3 p-4">
            {agente.data.messages.length === 0 && (
              <div className="grid gap-2">
                {accionesTablero.map((accion) => (
                  <Button
                    key={accion.id}
                    variant="secondary"
                    size="sm"
                    className="justify-start"
                    onClick={() => preguntar(accion.prompt)}
                  >
                    ✨ {accion.etiqueta}
                  </Button>
                ))}
                <p className="text-muted-foreground pt-2 text-xs">
                  También podés escribirle: "cargá a Ana Ruiz de Textil Sur" o "¿cuáles están
                  frenados?".
                </p>
              </div>
            )}

            {agente.data.messages.map((mensaje, i) => {
              const contenido = textoDe(mensaje);
              if (!contenido) return null;
              const mio = mensaje.role === "user";
              return (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    mio ? "bg-primary text-primary-foreground ml-6" : "bg-muted mr-6"
                  }`}
                >
                  {contenido}
                </div>
              );
            })}

            {redacciones.map((r) => (
              <Card key={r.clave} className="gap-2 p-3">
                <p className="text-xs font-medium">{r.titulo}</p>
                <p className="text-sm whitespace-pre-wrap">{r.texto}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void navigator.clipboard.writeText(r.texto)}
                >
                  Copiar
                </Button>
              </Card>
            ))}

            {propuestas.map((p) => (
              <Card key={p.clave} className="gap-2 p-3">
                <p className="text-xs font-medium">
                  {p.acciones.length === 1 ? "Propuesta" : `${p.acciones.length} propuestas`}
                </p>
                <ul className="grid gap-1">
                  {p.acciones.map((accion, i) => (
                    <li key={i} className="text-sm">
                      • {accion.porQue}
                    </li>
                  ))}
                </ul>
                {p.rechazadas > 0 && (
                  <p className="text-muted-foreground text-xs">
                    {p.rechazadas} no se pudieron preparar.
                  </p>
                )}
                {aplicadas.includes(p.clave) ? (
                  <p className="text-xs font-medium text-green-600 dark:text-green-500">
                    ✓ Aplicado
                  </p>
                ) : (
                  <Button size="sm" onClick={() => aplicar(p.clave, p.acciones)}>
                    Aplicar
                  </Button>
                )}
              </Card>
            ))}

            {ocupado && <p className="text-muted-foreground text-xs">Pensando...</p>}
          </div>
        </ScrollArea>

        <Separator />
        <form
          className="flex gap-2 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            preguntar(texto);
          }}
        >
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Preguntá o pedí algo..."
            disabled={ocupado}
          />
          <Button type="submit" disabled={ocupado || !texto.trim()}>
            Enviar
          </Button>
        </form>
      </div>
    </>
  );
}
