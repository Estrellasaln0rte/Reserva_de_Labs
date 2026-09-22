import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL falta o es inválida"),
  DIRECT_URL: z.string().url("DIRECT_URL falta o es inválida"),
  PORT: z.coerce.number().int().positive().default(3010),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("✕ Configuración inválida. Revisá tu .env:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;