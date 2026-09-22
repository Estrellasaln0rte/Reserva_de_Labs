import type { Request, Response } from "express";
import { prisma } from "./prisma.js";
import {
  crearSalaSchema,
  crearReservaSchema,
  idSchema,
} from "./validation.js";

// GET /api/salas
// Trae todas las salas junto con sus reservas
export async function listarSalas(_req: Request, res: Response) {
  const salas = await prisma.sala.findMany({
    include: { reservas: true },
    orderBy: { id: "asc" },
    take: 100,
  });

  res.json(salas);
}

// POST /api/salas
// Crea una sala solo si los datos son válidos
export async function crearSala(req: Request, res: Response) {
  const parsed = crearSalaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "datos inválidos",
      detalles: parsed.error.flatten().fieldErrors,
    });
  }

  const sala = await prisma.sala.create({
    data: parsed.data,
  });

  res.status(201).json(sala);
}

// POST /api/salas/:id/reservas
// Crea una reserva solo si el ID y los datos son válidos
export async function crearReserva(req: Request, res: Response) {
  const id = idSchema.safeParse(req.params.id);

  if (!id.success) {
    return res.status(400).json({
      error: "id de sala inválido",
    });
  }

  const parsed = crearReservaSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "datos inválidos",
      detalles: parsed.error.flatten().fieldErrors,
    });
  }

  const sala = await prisma.sala.findUnique({
    where: { id: id.data },
  });

  if (!sala) {
    return res.status(404).json({
      error: "sala no encontrada",
    });
  }

  const reserva = await prisma.reserva.create({
    data: {
      ...parsed.data,
      salaId: id.data,
    },
  });

  res.status(201).json(reserva);
}

// DELETE /api/salas/:id
export async function borrarSala(req: Request, res: Response) {
  const id = Number(req.params.id);

  try {
    await prisma.sala.delete({
      where: { id },
    });

    res.status(204).send();
  } catch {
    res.status(404).json({
      error: "sala no encontrada",
    });
  }
}