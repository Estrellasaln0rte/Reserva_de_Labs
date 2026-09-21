import { prisma } from "../src/prisma.js";

async function main() {
  await prisma.reserva.deleteMany();
  await prisma.sala.deleteMany();
  await prisma.sala.createMany({
    data: [
      { nombre: "Lab A · Redes", edificio: "M", capacidad: 30 },
      { nombre: "Lab B · Software", edificio: "M", capacidad: 25 },
      { nombre: "Lab C · Hardware", edificio: "O", capacidad: 20 },
    ],
  });
  console.log("seed listo");
}
main().catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());