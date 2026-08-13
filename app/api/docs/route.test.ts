import { describe, expect, it } from "vitest"
import { GET } from "./route"
import { openApiDocument } from "./openapi"

describe("Swagger UI", () => {
  it("sirve Swagger UI en /api/docs", async () => {
    const response = await GET()
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("text/html")
    expect(html).toContain("SwaggerUIBundle")
    expect(html).toContain("/api/docs/openapi")
  })

  it("documenta todas las rutas de negocio", () => {
    expect(Object.keys(openApiDocument.paths)).toEqual(
      expect.arrayContaining([
        "/api/health",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/me",
        "/api/materias",
        "/api/materias/{id}",
        "/api/equipos",
        "/api/rubricas/global",
        "/api/evaluaciones",
        "/api/retroalimentacion",
      ]),
    )
  })
})
