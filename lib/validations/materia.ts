import { z } from "zod"

const nombreField = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(150, "El nombre no puede exceder 150 caracteres")

const cuatrimestreField = z
  .number({ invalid_type_error: "El cuatrimestre debe ser un número" })
  .int("El cuatrimestre debe ser un número entero")
  .min(1, "El cuatrimestre debe ser al menos 1")
  .max(12, "El cuatrimestre no puede exceder 12")

const profesorField = z
  .string()
  .trim()
  .min(2, "El nombre del profesor debe tener al menos 2 caracteres")
  .max(100, "El nombre del profesor no puede exceder 100 caracteres")

const activaField = z.boolean()

export const createMateriaSchema = z.object({
  nombre: nombreField,
  cuatrimestre: cuatrimestreField,
  profesor: profesorField,
  activa: activaField.optional().default(true),
})

export const updateMateriaSchema = z
  .object({
    nombre: nombreField.optional(),
    cuatrimestre: cuatrimestreField.optional(),
    profesor: profesorField.optional(),
    activa: activaField.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar",
  })

export type CreateMateriaInput = z.infer<typeof createMateriaSchema>
export type UpdateMateriaInput = z.infer<typeof updateMateriaSchema>
