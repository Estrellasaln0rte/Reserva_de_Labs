# Reserva de Labs

API desarrollada con Express, Prisma y PostgreSQL (Supabase) para la administración de salas de laboratorio y sus reservas (relación 1—N: una `Sala` posee múltiples registros de `Reserva`).

## Principios de seguridad

- **El servidor no debe confiar en los datos de entrada.** Toda solicitud `POST` valida el cuerpo de la petición mediante Zod (`src/validation.ts`), utilizando `safeParse` antes de interactuar con Prisma. Si la validación falla, se responde con `400` y el detalle correspondiente, sin que la operación llegue a la base de datos. Toda ruta nueva que reciba datos del cliente (body o parámetros) debe contar con su propio esquema de validación; no se admiten excepciones bajo el criterio de que un campo es "simple".
- **La validación del cliente no sustituye a la del servidor.** El frontend puede replicar las mismas reglas con fines de experiencia de usuario (retroalimentación inmediata), pero constituye una capa de conveniencia, no de seguridad. La fuente de verdad reside en `src/validation.ts` y `src/salas.controller.ts`.
- **Los secretos se gestionan mediante `.env` y nunca se incorporan al código fuente.** Las variables `DATABASE_URL`, `DIRECT_URL` y `PORT` residen únicamente en `.env` (excluido del control de versiones). `src/env.ts` valida dichas variables al iniciar la aplicación mediante Zod; si alguna falta o es inválida, el proceso finaliza (`process.exit(1)`) en lugar de continuar con una configuración incompleta. No se deben incluir URLs, contraseñas ni claves de acceso en el código ni en los commits.
- **`.env.example` documenta la estructura, no los valores.** Al incorporar una nueva variable de entorno, debe actualizarse `.env.example` con la clave correspondiente vacía, y `.env` (de uso local, no versionado) con el valor real.
- **Previo a cualquier `git push`, debe verificarse el resultado de `git status` para confirmar que `.env` no forma parte de los cambios a subir.** En caso de que una clave real haya sido expuesta en el historial de Git, corresponde rotarla en Supabase antes de proceder con `git rm --cached .env`; la eliminación del archivo por sí sola es insuficiente, dado que el historial de Git conserva el registro.
- **La configuración `onDelete: Cascade`** en la relación `Reserva.sala` es un comportamiento intencional: la eliminación de una sala implica la eliminación de sus reservas asociadas. No debe interpretarse como un defecto.

## Ejecución del servidor

Requisitos: Node 18 o superior, y un archivo `.env` local con las variables `DATABASE_URL`, `DIRECT_URL` y `PORT` (véase `.env.example`).

```bash
npm install
npm run dev       # inicia la API con recarga automática en http://localhost:3010
```

Scripts adicionales:

```bash
npm run migrate   # aplica el esquema de prisma/schema.prisma a la base de datos (utiliza DIRECT_URL)
npm run seed      # carga los datos iniciales de salas (prisma/seed.ts)
npm run studio    # abre Prisma Studio para la inspección y edición manual de datos
```

## Endpoints

| Verbo  | Ruta                       | Validación aplicada                |
|--------|----------------------------|-------------------------------------|
| GET    | `/api/salas`               | —                                    |
| POST   | `/api/salas`                | `crearSalaSchema`                    |
| POST   | `/api/salas/:id/reservas`  | `idSchema` + `crearReservaSchema`    |
| DELETE | `/api/salas/:id`            | — (responde `404` si no existe)     |

## Ejecución de las pruebas automatizadas (Postman)

Las pruebas se encuentran en `postman/reserva-labs.postman_collection.json`, colección exportada y versionada dentro del repositorio.

1. Iniciar el backend (`npm run dev`); la colección apunta a `http://localhost:3010` a través de la variable `baseUrl`.
2. En Postman: **File → Import** y seleccionar dicho archivo.
3. Ejecutar la colección completa mediante el **Collection Runner** (clic derecho sobre la colección "Reserva de Labs" → *Run collection*) para validar los nueve casos incluidos: los casos válidos deben responder `200`/`201`/`204`, y los casos inválidos deben responder `400`/`404` junto con el detalle del campo correspondiente.

La colección crea una sala real, almacena su `id` en la variable `salaId`, genera una reserva asociada a dicha sala y, finalmente, la elimina; no se requiere limpieza manual posterior a su ejecución.

Al incorporar un nuevo endpoint, debe añadirse también su solicitud correspondiente con su respectivo `pm.test` a esta colección, y volver a exportarla (**Export → Collection v2.1**) sobre el mismo archivo.
