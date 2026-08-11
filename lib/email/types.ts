export type EmailJobData = {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  replyTo?: string
  metadata?: Record<string, string | number | boolean | null>
}

export type EmailSendResult = {
  provider: "console" | "resend" | "smtp"
  messageId: string
}
