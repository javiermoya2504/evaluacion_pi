import type { EmailProvider } from "./config"
import type { EmailJobData } from "./types"

type EmailLogLevel = "info" | "error"

export type EmailLogEvent =
  | "email_worker_ready"
  | "email_worker_shutdown"
  | "email_job_enqueued"
  | "email_send_started"
  | "email_send_succeeded"
  | "email_send_failed"

type EmailLogContext = {
  event: EmailLogEvent
  level?: EmailLogLevel
  provider?: EmailProvider
  jobId?: string
  messageId?: string
  attemptsMade?: number
  durationMs?: number
  error?: unknown
  email?: Pick<EmailJobData, "to" | "subject" | "metadata">
}

function anonymizeRecipient(recipient: string): string {
  const [localPart, domain] = recipient.split("@")

  if (!domain) return "***"

  return `${localPart.slice(0, 2)}***@${domain}`
}

function normalizeRecipients(to: EmailJobData["to"]): string[] {
  return Array.isArray(to) ? to : [to]
}

function serializeError(error: unknown): string | undefined {
  if (!error) return undefined
  if (error instanceof Error) return error.message
  return String(error)
}

export function logEmailEvent(context: EmailLogContext): void {
  const level = context.level ?? "info"
  const payload = {
    event: context.event,
    email_event: context.event,
    provider: context.provider,
    jobId: context.jobId,
    messageId: context.messageId,
    attemptsMade: context.attemptsMade,
    durationMs: context.durationMs,
    subject: context.email?.subject,
    to: context.email
      ? normalizeRecipients(context.email.to).map(anonymizeRecipient)
      : undefined,
    metadata: context.email?.metadata,
    error: serializeError(context.error),
    timestamp: new Date().toISOString(),
  }

  const serializedPayload = JSON.stringify(payload)

  if (level === "error") {
    console.error(serializedPayload)
    return
  }

  console.info(serializedPayload)
}
