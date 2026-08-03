"use client";

// La pantalla completa. No sabe nada del negocio: todo sale de la
// especificación, así que la misma pantalla sirve para un CRM o un tablero de
// pedidos sin cambiar una línea.

import { useEffect, useState } from "react";
import type { Espec } from "@/lib/espec";
import {
  actualizar as actualizarRegistro,
  borrar as borrarRegistro,
  cargar,
  crear as crearRegistro,
  guardar,
  indicadores,
  mover as moverRegistro,
  sembrar,
  type Registro,
} from "@/lib/datos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Asistente } from "./asistente";
import { Ficha } from "./ficha";
import { Formulario } from "./formulario";
import { Lista } from "./lista";
import { Tablero } from "./tablero";

export function Herramienta({ espec, zonaHoraria }: { espec: Espec; zonaHoraria?: string }) {
  const [registros, setRegistros] = useState<Registro[]>(() => sembrar(espec));
  const [listo, setListo] = useState(false);
  const [vista, setVista] = useState(espec.vistas.inicial);
  const [abierta, setAbierta] = useState<Registro | null>(null);
  const [editando, setEditando] = useState<Registro | null>(null);
  const [formAbierto, setFormAbierto] = useState(false);
  const [pedidoIA, setPedidoIA] = useState<{ prompt: string; nonce: number } | null>(null);

  // localStorage solo existe en el navegador: cargamos después del primer render.
  useEffect(() => {
    setRegistros(cargar(espec));
    setListo(true);
  }, [espec]);

  const aplicar = (siguientes: Registro[]) => {
    setRegistros(siguientes);
    guardar(espec, siguientes);
  };

  const onGuardarForm = (datos: Record<string, unknown>) => {
    if (editando) {
      aplicar(actualizarRegistro(registros, editando.id, datos));
      setAbierta((prev) => (prev ? { ...prev, ...datos } : prev));
    } else {
      aplicar(crearRegistro(espec, registros, datos));
    }
    setEditando(null);
  };

  const pedirIA = (prompt: string) => setPedidoIA({ prompt, nonce: Date.now() });

  const accionDeFicha = (accionId: string, registro: Registro) => {
    const accion = espec.accionesIA.find((a) => a.id === accionId);
    if (!accion) return;
    const titulo = String(registro[espec.registro.campoTitulo] ?? registro.id);
    pedirIA(`${accion.prompt}\n\nEs sobre "${titulo}" (id ${registro.id}).`);
  };

  const metricas = indicadores(registros, espec);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <span aria-hidden>{espec.herramienta.emoji}</span>
            {espec.herramienta.nombre}
          </h1>
          {espec.herramienta.queResuelve && (
            <p className="text-muted-foreground mt-0.5 text-sm">{espec.herramienta.queResuelve}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Asistente
            espec={espec}
            registros={registros}
            pedido={pedidoIA}
            onAplicarCambios={aplicar}
          />
          <Button
            onClick={() => {
              setEditando(null);
              setFormAbierto(true);
            }}
          >
            Nuevo {espec.registro.singular.toLowerCase()}
          </Button>
        </div>
      </header>

      {metricas.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {metricas.map((m) => (
            <Card key={m.etiqueta} className="gap-1 p-4">
              <p className="text-muted-foreground text-xs">{m.etiqueta}</p>
              <p className="text-2xl font-semibold tabular-nums">{m.valor}</p>
            </Card>
          ))}
        </div>
      )}

      <Tabs value={vista} onValueChange={(v) => setVista(v as typeof vista)}>
        <TabsList>
          <TabsTrigger value="tablero">Tablero</TabsTrigger>
          <TabsTrigger value="lista">Lista</TabsTrigger>
        </TabsList>
      </Tabs>

      {!listo ? (
        <p className="text-muted-foreground py-12 text-center text-sm">Cargando tus datos...</p>
      ) : vista === "tablero" ? (
        <Tablero
          espec={espec}
          registros={registros}
          zonaHoraria={zonaHoraria}
          onAbrir={setAbierta}
          onMover={(id, estado) => aplicar(moverRegistro(espec, registros, id, estado))}
        />
      ) : (
        <Lista
          espec={espec}
          registros={registros}
          zonaHoraria={zonaHoraria}
          onAbrir={setAbierta}
        />
      )}

      <Ficha
        espec={espec}
        registro={abierta}
        zonaHoraria={zonaHoraria}
        onCerrar={() => setAbierta(null)}
        onEditar={(registro) => {
          setEditando(registro);
          setFormAbierto(true);
        }}
        onBorrar={(id) => aplicar(borrarRegistro(registros, id))}
        onActualizar={(id, cambios) => {
          aplicar(actualizarRegistro(registros, id, cambios));
          setAbierta((prev) => (prev && prev.id === id ? { ...prev, ...cambios } : prev));
        }}
        onAccionIA={accionDeFicha}
      />

      <Formulario
        espec={espec}
        abierto={formAbierto}
        registro={editando}
        onCerrar={() => {
          setFormAbierto(false);
          setEditando(null);
        }}
        onGuardar={onGuardarForm}
      />

      <p className="text-muted-foreground text-center text-xs">
        Tus datos se guardan en este navegador, en esta computadora. No se comparten con nadie.
      </p>
    </div>
  );
}
