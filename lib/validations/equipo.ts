import { z } from "zod"

const idField = z
  .string()
  .trim()
  .min(1, "El id es requerido")

const nombreField = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(150, "El nombre no puede exceder 150 caracteres")

const materiaIdField = z
  .string()
  .trim()
  .min(1, "La materia es requerida")

const integranteIdsField = z
  .array(idField)
  .default([])
  .transform((ids) => Array.from(new Set(ids.map((id) => id.trim()))))

export const createEquipoSchema = z.object({
  nombre: nombreField,
  materiaId: materiaIdField,
  integranteIds: integranteIdsField.optional().default([]),
})

export const updateEquipoSchema = z
  .object({
    id: idField,
    nombre: nombreField.optional(),
    materiaId: materiaIdField.optional(),
    integranteIds: integranteIdsField.optional(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== "id"), {
    message: "Debe proporcionar al menos un campo para actualizar",
  })

export type CreateEquipoInput = z.infer<typeof createEquipoSchema>
export type UpdateEquipoInput = z.infer<typeof updateEquipoSchema>
