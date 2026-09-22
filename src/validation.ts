import { z } from "zod";

// Reglas para crear una sala
export const crearSalaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "el nombre es muy corto"),

  edificio: z
    .string()
    .trim()
    .min(1, "el edificio es obligatorio"),

  capacidad: z
    .number()
    .int()
    .positive("la capacidad debe ser mayor a 0"),
});

// Reglas para crear una reserva
export const crearReservaSchema = z
  .object({
    responsable: z
      .string()
      .trim()
      .min(3, "¿quién reserva?")
      .max(100),

    motivo: z
      .string()
      .trim()
      .min(3, "contá para qué")
      .max(200),

    inicio: z.coerce.date(),

    fin: z.coerce.date(),
  })

  // La hora de finalización debe ser posterior al inicio
  .refine((r) => r.fin > r.inicio, {
    message: "el fin debe ser después del inicio",
    path: ["fin"],
  })

  // No se permiten reservas en el pasado
  .refine((r) => r.inicio > new Date(), {
    message: "no podés reservar en el pasado",
    path: ["inicio"],
  });

// Regla para los ID que vienen en la URL
export const idSchema = z.coerce.number().int().positive();