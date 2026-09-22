import { ordenarPorInicio } from "../utils/fecha";
import ReservaPill from "./ReservaPill";

// cada tarjeta rota entre estos acentos para que la grilla no se vea monocroma
const ACENTOS = [
  { linea: "var(--brand)", sombra: "rgba(226, 131, 95, 0.35)" },
  { linea: "var(--info)", sombra: "rgba(44, 159, 199, 0.32)" },
  { linea: "var(--gold)", sombra: "rgba(251, 183, 40, 0.32)" },
];

export default function SalaCard({ sala, indice }) {
  const reservas = ordenarPorInicio(sala.reservas ?? []);
  const acento = ACENTOS[indice % ACENTOS.length];

  return (
    <article
      className="sala-card"
      style={{ "--acento": acento.linea, "--acento-sombra": acento.sombra }}
    >
      <div className="sala-card__head">
        <div>
          <div className="sala-card__nombre">{sala.nombre}</div>
          <div className="sala-card__chips">
            <span className="chip chip-edificio">Edificio {sala.edificio}</span>
            <span className="chip chip-capacidad">
              <span className="n">{sala.capacidad}</span> personas
            </span>
          </div>
        </div>
      </div>

      <div className="sala-card__reservas">
        <span className="sala-card__reservas-label">Reservas</span>
        {reservas.length === 0 ? (
          <p className="sala-card__sin-reservas">Sin reservas por el momento</p>
        ) : (
          <ul className="pill-lista">
            {reservas.map((r) => (
              <ReservaPill key={r.id} reserva={r} />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
