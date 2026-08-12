import { z } from "zod"

const fields = {
  nombre: z.string().trim().min(2).max(150),
  descripcion: z.string().trim().min(5).max(1000),
  carrera: z.string().trim().min(2).max(80),
  periodo: z.string().trim().min(2).max(30),
  fechaInicio: z.string().date(),
  fechaFin: z.string().date(),
  estado: z.enum(["planificacion", "en-desarrollo", "finalizado"]),
  progreso: z.number().min(0).max(100),
}
export const createProyectoSchema = z.object(fields).refine((data) => data.fechaFin >= data.fechaInicio, { message: "La fecha final debe ser posterior", path: ["fechaFin"] })
export const updateProyectoSchema = z.object({ id: z.string().min(1), ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.optional()])) }).refine((data) => Object.keys(data).length > 1)
export type CreateProyectoInput = z.infer<typeof createProyectoSchema>
export type UpdateProyectoInput = z.infer<typeof updateProyectoSchema>
