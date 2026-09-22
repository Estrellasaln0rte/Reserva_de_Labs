// La API corre en local en el puerto definido por PORT en el .env del backend (ver .env.example)
const API = "http://localhost:3010";

export async function obtenerSalas() {
  const res = await fetch(`${API}/api/salas`);
  if (!res.ok) throw new Error("no se pudo cargar la lista de labs");
  return res.json();
}

export async function crearReserva(salaId, datos) {
  const res = await fetch(`${API}/api/salas/${salaId}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  return res;
}
