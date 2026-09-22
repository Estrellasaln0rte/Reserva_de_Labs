export function Cargando() {
  return (
    <div className="estado cargando">
      <span className="spinner" />
      Cargando labs…
    </div>
  );
}

export function ErrorRed({ mensaje }) {
  return (
    <div className="estado error">
      <span className="icono">!</span>
      No se pudo conectar con el servidor: {mensaje}
    </div>
  );
}
