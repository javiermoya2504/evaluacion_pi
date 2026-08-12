import { describe, expect, it } from "vitest"
import { createProyectoSchema, updateProyectoSchema } from "./proyecto"

const validProject = {
  nombre: "Plataforma PI",
  descripcion: "Sistema de seguimiento institucional",
  carrera: "Ingenieria de Software",
  periodo: "2026-2",
  fechaInicio: "2026-08-01",
  fechaFin: "2026-12-01",
  estado: "en-desarrollo" as const,
  progreso: 25,
}

describe("proyecto schemas", () => {
  it("accepts a valid project", () => {
    expect(createProyectoSchema.safeParse(validProject).success).toBe(true)
  })

  it("rejects an end date before the start date", () => {
    expect(createProyectoSchema.safeParse({ ...validProject, fechaFin: "2026-07-01" }).success).toBe(false)
  })

  it("rejects an empty update", () => {
    expect(updateProyectoSchema.safeParse({ id: "project-1" }).success).toBe(false)
  })
})
