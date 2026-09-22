import express from "express";
import cors from "cors";
import { env } from "./env.js";
import {
  listarSalas,
  crearSala,
  crearReserva,
  borrarSala,
} from "./salas.controller.js";

const app = express();

// Permite que el frontend pueda comunicarse con el backend
app.use(cors());

// Permite recibir datos JSON en req.body
app.use(express.json());

// Rutas de la API
app.get("/api/salas", listarSalas);
app.post("/api/salas", crearSala);
app.post("/api/salas/:id/reservas", crearReserva);
app.delete("/api/salas/:id", borrarSala);

app.listen(env.PORT, () => {
  console.log(`API lista en http://localhost:${env.PORT}`);
});