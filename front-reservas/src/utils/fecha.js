// Convierte un Date a formato "YYYY-MM-DDTHH:mm" para inputs datetime-local
export function toDatetimeLocalValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Redondea hacia arriba al siguiente múltiplo de `minutos`
function redondearHaciaArriba(date, minutos = 30) {
  const ms = 1000 * 60 * minutos;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

// Valor por defecto para "inicio": ahora, redondeado al próximo bloque de 30 min
export function inicioPorDefecto() {
  return toDatetimeLocalValue(redondearHaciaArriba(new Date(), 30));
}

// Valor por defecto para "fin": inicio + horas
export function finPorDefecto(inicioValue, horas = 2) {
  const base = new Date(inicioValue);
  base.setHours(base.getHours() + horas);
  return toDatetimeLocalValue(base);
}

// Formatea una fecha para mostrarla en las tarjetas ("1 dic, 14:00")
export function formatearFechaHora(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString("es-GT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Devuelve una copia de las reservas ordenada cronológicamente (más próxima primero)
export function ordenarPorInicio(reservas) {
  return [...reservas].sort((a, b) => new Date(a.inicio) - new Date(b.inicio));
}
