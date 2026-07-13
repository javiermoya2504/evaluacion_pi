import { z } from "zod"

const idField = (message: string) => z.string().trim().min(1, message)

export const createRetroalimentacionSchema = z.object({
  equipoId: idField("El equipoId es obligatorio"),
  evaluacionId: idField("El evaluacionId es obligatorio"),
  docenteId: idField("El docenteId es obligatorio"),
  comentario: z
    .string()
    .trim()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(1000, "El comentario no puede exceder 1000 caracteres"),
})

export type CreateRetroalimentacionInput = z.infer<typeof createRetroalimentacionSchema>
