import nodemailer from "nodemailer"
import { Resend } from "resend"

import { assertEmailConfig } from "./config"
import { logEmailEvent } from "./log"
import type { EmailJobData, EmailSendResult } from "./types"

type SendEmailOptions = {
  jobId?: string
  attemptsMade?: number
}

export async function sendEmail(
  email: EmailJobData,
  options: SendEmailOptions = {},
): Promise<EmailSendResult> {
  const startedAt = Date.now()
  const config = assertEmailConfig()

  logEmailEvent({
    event: "email_send_started",
    provider: config.provider,
    jobId: options.jobId,
    attemptsMade: options.attemptsMade,
    email,
  })

  try {
    if (config.provider === "console") {
      const messageId = `console-${Date.now()}`

      logEmailEvent({
        event: "email_send_succeeded",
        provider: config.provider,
        jobId: options.jobId,
        messageId,
        attemptsMade: options.attemptsMade,
        durationMs: Date.now() - startedAt,
        email,
      })

      return {
        provider: "console",
        messageId,
      }
    }

    if (config.provider === "resend") {
      const resend = new Resend(config.resendApiKey)
      const emailContent = email.html
        ? { html: email.html, text: email.text }
        : { text: email.text || "" }
      const response = await resend.emails.send({
        from: config.from,
        to: email.to,
        subject: email.subject,
        replyTo: email.replyTo || config.replyTo,
        ...emailContent,
      })

      if (response.error) {
        throw new Error(response.error.message)
      }

      const messageId = response.data?.id || `resend-${Date.now()}`

      logEmailEvent({
        event: "email_send_succeeded",
        provider: config.provider,
        jobId: options.jobId,
        messageId,
        attemptsMade: options.attemptsMade,
        durationMs: Date.now() - startedAt,
        email,
      })

      return {
        provider: "resend",
        messageId,
      }
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    })

    const result = await transporter.sendMail({
      from: config.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: email.replyTo || config.replyTo,
    })

    const messageId = result.messageId || `smtp-${Date.now()}`

    logEmailEvent({
      event: "email_send_succeeded",
      provider: config.provider,
      jobId: options.jobId,
      messageId,
      attemptsMade: options.attemptsMade,
      durationMs: Date.now() - startedAt,
      email,
    })

    return {
      provider: "smtp",
      messageId,
    }
  } catch (error) {
    logEmailEvent({
      event: "email_send_failed",
      provider: config.provider,
      jobId: options.jobId,
      attemptsMade: options.attemptsMade,
      durationMs: Date.now() - startedAt,
      error,
      level: "error",
      email,
    })

    throw error
  }
}
