import { z } from "zod"

const nombreField = z
  .string()
  .trim()
  .min(1, "El nombre es requerido")

const descripcionField = z
  .string()
  .trim()
  .min(1, "La descripción es requerida")

const criterioSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre del criterio es requerido"),
  porcentaje: z
    .number({ invalid_type_error: "El porcentaje debe ser un número" })
    .positive("El porcentaje debe ser mayor que 0")
    .max(100, "El porcentaje no puede exceder 100"),
})

export const createRubricaSchema = z
  .object({
    nombre: nombreField,
    descripcion: descripcionField,
    criterios: z
      .array(criterioSchema, {
        required_error: "Los criterios son requeridos",
        invalid_type_error: "Los criterios deben ser una lista",
      })
      .min(1, "Debe proporcionar al menos un criterio"),
  })
  .refine(
    (data) => {
      const total = data.criterios.reduce(
        (sum, criterio) => sum + criterio.porcentaje,
        0,
      )

      return Math.abs(total - 100) < 1e-8
    },
    {
      message: "La suma de los porcentajes debe ser igual a 100",
      path: ["criterios"],
    },
  )

export type CreateRubricaInput = z.infer<typeof createRubricaSchema>
