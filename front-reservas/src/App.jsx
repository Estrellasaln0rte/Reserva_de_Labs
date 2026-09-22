import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { Cargando, ErrorRed } from "./components/EstadoCarga";
import SalaCard from "./components/SalaCard";
import ReservaForm from "./components/ReservaForm";
import { obtenerSalas } from "./api/salas";

export default function App() {
  const [salas, setSalas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  async function cargarSalas() {
    setCargando(true);
    setError(null);
    try {
      setSalas(await obtenerSalas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSalas();
  }, []);

  return (
    <div className="page">
      <Header />

      <div className="section-title">
        <h2>Laboratorios</h2>
        {!cargando && !error && <span className="count">{salas.length} disponibles</span>}
      </div>

      {cargando && <Cargando />}
      {error && <ErrorRed mensaje={error} />}

      {!cargando && !error && (
        <>
          {salas.length === 0 ? (
            <div className="vacio">Todavía no hay laboratorios registrados.</div>
          ) : (
            <div className="salas-grid">
              {salas.map((sala, i) => (
                <SalaCard key={sala.id} sala={sala} indice={i} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="section-title">
        <h2>Nueva reserva</h2>
      </div>
      <ReservaForm salas={salas} onReservaCreada={cargarSalas} />

      <div className="footer-nota">// Reserva de Labs · frontend en React + Vite</div>
    </div>
  );
}
