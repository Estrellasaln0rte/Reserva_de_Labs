import { z } from "zod";

// Espejo EXACTO de src/validation.ts (crearReservaSchema) del backend.
// Valida acá solo por UX (feedback inmediato); la fuente de verdad sigue
// siendo el servidor, que vuelve a validar todo con el mismo criterio.
export const reservaSchema = z
  .object({
    responsable: z.string().trim().min(3, "¿quién reserva?").max(100),

    motivo: z.string().trim().min(3, "contá para qué").max(200),

    inicio: z.coerce.date(),

    fin: z.coerce.date(),
  })
  .refine((r) => r.fin > r.inicio, {
    message: "el fin debe ser después del inicio",
    path: ["fin"],
  })
  .refine((r) => r.inicio > new Date(), {
    message: "no podés reservar en el pasado",
    path: ["inicio"],
  });
