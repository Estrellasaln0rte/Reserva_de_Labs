import { formatearFechaHora } from "../utils/fecha";

export default function ReservaPill({ reserva }) {
  // próxima (dentro de 24h) se resalta en coral — el resto usa el azul informativo
  const esProxima = new Date(reserva.inicio) - new Date() < 1000 * 60 * 60 * 24;
  const dot = esProxima ? "var(--brand)" : "var(--info)";

  return (
    <li className="reserva-pill" style={{ "--dot": dot }}>
      <span className="reserva-pill__dot" />
      <span className="reserva-pill__responsable">{reserva.responsable}</span>
      <span className="reserva-pill__fecha">
        {formatearFechaHora(reserva.inicio)} – {formatearFechaHora(reserva.fin)}
      </span>
      <span className="reserva-pill__motivo">{reserva.motivo}</span>
    </li>
  );
}
