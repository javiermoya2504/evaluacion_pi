import { describe, expect, it } from "vitest"

import { GET } from "./route"

describe("GET /api/health", () => {
  it("returns a non-cacheable healthy response", async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get("Cache-Control")).toContain("no-store")
    expect(body).toMatchObject({
      status: "ok",
      service: "evaluacion-pi",
    })
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false)
    expect(body.uptimeSeconds).toEqual(expect.any(Number))
  })
})
