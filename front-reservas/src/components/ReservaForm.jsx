import { useState } from "react";
import { reservaSchema } from "../schemas/reservaSchema";
import { crearReserva } from "../api/salas";
import { inicioPorDefecto, finPorDefecto, toDatetimeLocalValue } from "../utils/fecha";

function formularioVacio() {
  const inicio = inicioPorDefecto();
  return { responsable: "", motivo: "", inicio, fin: finPorDefecto(inicio) };
}

export default function ReservaForm({ salas, onReservaCreada }) {
  const [salaId, setSalaId] = useState("");
  const [form, setForm] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [tocados, setTocados] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  function actualizarCampo(campo, valor) {
    const siguiente = { ...form, [campo]: valor };
    setForm(siguiente);
    setTocados((t) => ({ ...t, [campo]: true }));

    const check = reservaSchema.safeParse(siguiente);
    setErrores(check.success ? {} : check.error.flatten().fieldErrors);
  }

  function claseCampo(campo) {
    if (!tocados[campo]) return "";
    return errores[campo] ? "invalido" : "valido";
  }

  async function reservar(e) {
    e.preventDefault();
    setMensaje(null);
    setTocados({ responsable: true, motivo: true, inicio: true, fin: true, salaId: true });

    if (!salaId) {
      setErrores((prev) => ({ ...prev, salaId: ["elegí un laboratorio"] }));
      return;
    }

    // 1 · validación de CLIENTE (UX): mismas reglas que el servidor, aviso inmediato
    const check = reservaSchema.safeParse(form);
    if (!check.success) {
      setErrores(check.error.flatten().fieldErrors);
      return;
    }
    setErrores({});

    // 2 · al SERVIDOR, que vuelve a validar en serio
    setEnviando(true);
    try {
      const res = await crearReserva(salaId, form);

      if (res.status === 400) {
        const body = await res.json();
        setErrores(body.detalles || {});
        setMensaje({ tipo: "error", texto: body.error || "datos inválidos" });
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMensaje({ tipo: "error", texto: body.error || "el servidor no pudo procesar la reserva" });
        return;
      }

      setMensaje({ tipo: "exito", texto: "✓ reserva creada" });
      setForm(formularioVacio());
      setTocados({});
      onReservaCreada?.();
    } catch {
      setMensaje({ tipo: "error", texto: "no se pudo conectar con el servidor" });
    } finally {
      setEnviando(false);
    }
  }

  const ahora = toDatetimeLocalValue(new Date());

  return (
    <div className="form-card">
      <form onSubmit={reservar} noValidate>
        <div className="form-grid">
          <div className="campo full">
            <label htmlFor="sala">Laboratorio</label>
            <select
              id="sala"
              className={claseCampo("salaId")}
              value={salaId}
              onChange={(e) => {
                setSalaId(e.target.value);
                setTocados((t) => ({ ...t, salaId: true }));
                setErrores((prev) => ({ ...prev, salaId: undefined }));
              }}
            >
              <option value="">— elegí un lab —</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} · {s.edificio}
                </option>
              ))}
            </select>
            {errores.salaId && <span className="error-campo">{errores.salaId[0]}</span>}
          </div>

          <div className="campo">
            <label htmlFor="responsable">Responsable</label>
            <input
              id="responsable"
              type="text"
              placeholder="tu nombre"
              className={claseCampo("responsable")}
              value={form.responsable}
              onChange={(e) => actualizarCampo("responsable", e.target.value)}
            />
            {errores.responsable && <span className="error-campo">{errores.responsable[0]}</span>}
          </div>

          <div className="campo">
            <label htmlFor="motivo">Motivo</label>
            <input
              id="motivo"
              type="text"
              placeholder="práctica de laboratorio"
              className={claseCampo("motivo")}
              value={form.motivo}
              onChange={(e) => actualizarCampo("motivo", e.target.value)}
            />
            {errores.motivo && <span className="error-campo">{errores.motivo[0]}</span>}
          </div>

          <div className="campo">
            <label htmlFor="inicio">Inicio</label>
            <input
              id="inicio"
              type="datetime-local"
              min={ahora}
              className={claseCampo("inicio")}
              value={form.inicio}
              onChange={(e) => actualizarCampo("inicio", e.target.value)}
            />
            {errores.inicio && <span className="error-campo">{errores.inicio[0]}</span>}
          </div>

          <div className="campo">
            <label htmlFor="fin">Fin</label>
            <input
              id="fin"
              type="datetime-local"
              min={form.inicio}
              className={claseCampo("fin")}
              value={form.fin}
              onChange={(e) => actualizarCampo("fin", e.target.value)}
            />
            {errores.fin && <span className="error-campo">{errores.fin[0]}</span>}
          </div>
        </div>

        <div className="form-footer">
          <button className="btn-primario" type="submit" disabled={enviando}>
            {enviando ? "Procesando…" : "Reservar"}
          </button>
          {mensaje && (
            <div className={`mensaje ${mensaje.tipo}`}>
              <span className="icono">{mensaje.tipo === "exito" ? "✓" : "!"}</span>
              {mensaje.texto}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
