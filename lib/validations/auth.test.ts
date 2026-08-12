import { describe, expect, it } from "vitest"
import { registerSchema } from "./auth"

describe("registerSchema", () => {
  const base = { nombre: "Usuario Prueba", email: "TEST@UPQ.MX", password: "segura123" }

  it.each(["coordinadora_pi", "jefe_asignatura", "profesor"])("acepta el rol registrable %s", (rol) => {
    const result = registerSchema.safeParse({ ...base, rol })
    expect(result.success).toBe(true)
  })

  it.each(["admin", "alumno", "invalido", undefined])("rechaza el rol no registrable %s", (rol) => {
    const result = registerSchema.safeParse({ ...base, rol })
    expect(result.success).toBe(false)
  })
})
