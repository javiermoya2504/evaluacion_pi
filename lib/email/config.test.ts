import { describe, expect, it } from "vitest"

import {
  assertEmailConfig,
  getEmailConfig,
  getMissingEmailSecretNames,
  resolveEmailProvider,
} from "./config"

describe("email config", () => {
  it("uses console provider by default for local development", () => {
    expect(resolveEmailProvider({})).toBe("console")
    expect(getEmailConfig({}).from).toBe("Evaluacion PI <no-reply@example.com>")
  })

  it("prefers Resend when RESEND_API_KEY is configured", () => {
    expect(
      resolveEmailProvider({
        RESEND_API_KEY: "secret",
      }),
    ).toBe("resend")
  })

  it("accepts SMTP when SMTP_HOST is configured", () => {
    expect(
      resolveEmailProvider({
        SMTP_HOST: "smtp.example.com",
      }),
    ).toBe("smtp")
  })

  it("reports missing Resend secrets", () => {
    expect(
      getMissingEmailSecretNames({
        EMAIL_PROVIDER: "resend",
      }),
    ).toEqual(["EMAIL_FROM", "RESEND_API_KEY"])
  })

  it("reports missing SMTP secrets", () => {
    expect(
      getMissingEmailSecretNames({
        EMAIL_PROVIDER: "smtp",
        EMAIL_FROM: "Evaluacion PI <no-reply@example.com>",
        SMTP_HOST: "smtp.example.com",
      }),
    ).toEqual(["SMTP_USER", "SMTP_PASSWORD"])
  })

  it("rejects console provider in production unless explicitly allowed", () => {
    expect(() =>
      assertEmailConfig({
        NODE_ENV: "production",
        EMAIL_PROVIDER: "console",
        EMAIL_FROM: "Evaluacion PI <no-reply@example.com>",
      }),
    ).toThrow("EMAIL_PROVIDER no puede ser console")
  })
})
