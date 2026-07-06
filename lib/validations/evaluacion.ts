import { z } from "zod"

const idField = (message: string) =>
  z.string().trim().min(1, message)

const puntuacionField = z
  .number({ invalid_type_error: "La puntuación debe ser un número" })
  .min(0, "La puntuación debe ser mayor o igual a 0")

const criterioSchema = z.object({
  criterioId: idField("El criterioId es obligatorio"),
  puntuacion: puntuacionField,
})

export const createEvaluacionSchema = z.object({
  equipoId: idField("El equipoId es obligatorio"),
  rubricaId: idField("El rubricaId es obligatorio"),
  docenteId: idField("El docenteId es obligatorio"),
  observaciones: z.string().trim().max(2000, "Las observaciones no pueden exceder 2000 caracteres").optional().default(""),
  criterios: z
    .array(criterioSchema)
    .min(1, "Debe incluir al menos un criterio"),
})

export const updateEvaluacionSchema = z
  .object({
    id: idField("El id de la evaluación es obligatorio"),
    equipoId: idField("El equipoId es obligatorio").optional(),
    rubricaId: idField("El rubricaId es obligatorio").optional(),
    docenteId: idField("El docenteId es obligatorio").optional(),
    observaciones: z
      .string()
      .trim()
      .max(2000, "Las observaciones no pueden exceder 2000 caracteres")
      .optional(),
    criterios: z
      .array(criterioSchema)
      .min(1, "Debe incluir al menos un criterio")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 1, {
    message: "Debe proporcionar al menos un campo para actualizar",
  })

export type CreateEvaluacionInput = z.infer<typeof createEvaluacionSchema>
export type UpdateEvaluacionInput = z.infer<typeof updateEvaluacionSchema>
