import { describe, expect, it } from "vitest"
import { hasPermission } from "./permissions"

describe("role dashboard permissions", () => {
  it("allows every dashboard route for coordinacion", () => {
    expect(hasPermission("coordinadora_pi", "/dashboard/reportes")).toBe(true)
  })

  it("does not treat the dashboard root as a wildcard for jefatura", () => {
    expect(hasPermission("jefe_asignatura", "/dashboard")).toBe(true)
    expect(hasPermission("jefe_asignatura", "/dashboard/rubricas")).toBe(true)
    expect(hasPermission("jefe_asignatura", "/dashboard/reportes")).toBe(false)
  })

  it("limits profesores to their assigned modules", () => {
    expect(hasPermission("profesor", "/dashboard/evaluaciones")).toBe(true)
    expect(hasPermission("profesor", "/dashboard/equipos")).toBe(false)
  })
})
