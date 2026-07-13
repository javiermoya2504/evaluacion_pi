export const EMAIL_QUEUE_NAME = "email"

export type EmailProvider = "console" | "resend" | "smtp"

export type EmailConfig = {
  provider: EmailProvider
  from: string
  replyTo?: string
  resendApiKey?: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  smtpSecure: boolean
}

type Env = Partial<NodeJS.ProcessEnv>

function readBoolean(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback
  return ["1", "true", "yes", "on"].includes(value.toLowerCase())
}

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function resolveEmailProvider(env: Env = process.env): EmailProvider {
  const configuredProvider = env.EMAIL_PROVIDER?.toLowerCase()

  if (
    configuredProvider === "console" ||
    configuredProvider === "resend" ||
    configuredProvider === "smtp"
  ) {
    return configuredProvider
  }

  if (env.RESEND_API_KEY) return "resend"
  if (env.SMTP_HOST) return "smtp"
  return "console"
}

export function getEmailConfig(env: Env = process.env): EmailConfig {
  const provider = resolveEmailProvider(env)

  return {
    provider,
    from: env.EMAIL_FROM || "Evaluacion PI <no-reply@example.com>",
    replyTo: env.EMAIL_REPLY_TO || undefined,
    resendApiKey: env.RESEND_API_KEY || undefined,
    smtpHost: env.SMTP_HOST || undefined,
    smtpPort: readNumber(env.SMTP_PORT, 587),
    smtpUser: env.SMTP_USER || undefined,
    smtpPassword: env.SMTP_PASSWORD || undefined,
    smtpSecure: readBoolean(env.SMTP_SECURE, false),
  }
}

export function getMissingEmailSecretNames(env: Env = process.env): string[] {
  const provider = resolveEmailProvider(env)
  const missing: string[] = []

  if (!env.EMAIL_FROM) missing.push("EMAIL_FROM")

  if (provider === "resend" && !env.RESEND_API_KEY) {
    missing.push("RESEND_API_KEY")
  }

  if (provider === "smtp") {
    if (!env.SMTP_HOST) missing.push("SMTP_HOST")
    if (!env.SMTP_USER) missing.push("SMTP_USER")
    if (!env.SMTP_PASSWORD) missing.push("SMTP_PASSWORD")
  }

  return missing
}

export function assertEmailConfig(env: Env = process.env): EmailConfig {
  const config = getEmailConfig(env)
  const missing = getMissingEmailSecretNames(env)

  if (
    config.provider === "console" &&
    env.NODE_ENV === "production" &&
    env.EMAIL_ALLOW_CONSOLE !== "true"
  ) {
    throw new Error(
      "EMAIL_PROVIDER no puede ser console en produccion sin EMAIL_ALLOW_CONSOLE=true",
    )
  }

  if (missing.length > 0) {
    throw new Error(`Faltan secretos de email: ${missing.join(", ")}`)
  }

  return config
}

export function getRedisUrl(env: Env = process.env): string {
  return env.REDIS_URL || "redis://localhost:6379"
}
