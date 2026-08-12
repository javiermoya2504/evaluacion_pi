import { describe, expect, it } from "vitest"
import { authenticateDemoUser } from "./demo-auth"

describe("authenticateDemoUser", () => {
  it("autentica cada perfil demo con el rol correcto", () => {
    expect(authenticateDemoUser("coordinadora@upq.mx", "admin123")?.rol).toBe("coordinadora_pi")
    expect(authenticateDemoUser("jefe@upq.mx", "jefe123")?.rol).toBe("jefe_asignatura")
    expect(authenticateDemoUser("profesor@upq.mx", "prof123")?.rol).toBe("profesor")
  })

  it("rechaza credenciales incorrectas", () => {
    expect(authenticateDemoUser("profesor@upq.mx", "incorrecta")).toBeNull()
  })
})
