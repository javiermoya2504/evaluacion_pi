import { describe, expect, it } from "vitest"
import { parseOAuthRole } from "./oauth-role"

describe("parseOAuthRole", () => {
  it.each(["coordinadora_pi", "jefe_asignatura", "profesor"])("acepta %s", (role) => {
    expect(parseOAuthRole(role)).toBe(role)
  })

  it.each(["admin", "alumno", "", undefined, null])("rechaza %s", (role) => {
    expect(parseOAuthRole(role)).toBeNull()
  })
})
