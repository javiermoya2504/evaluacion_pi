import { Worker } from "bullmq"

import { EMAIL_QUEUE_NAME } from "../lib/email/config"
import { getEmailRedisConnectionOptions } from "../lib/email/queue"
import { logEmailEvent } from "../lib/email/log"
import { sendEmail } from "../lib/email/sender"
import type { EmailJobData, EmailSendResult } from "../lib/email/types"

const connection = getEmailRedisConnectionOptions()

const worker = new Worker<EmailJobData, EmailSendResult, "send">(
  EMAIL_QUEUE_NAME,
  async (job) =>
    sendEmail(job.data, {
      jobId: job.id,
      attemptsMade: job.attemptsMade,
    }),
  {
    connection,
    concurrency: Number(process.env.EMAIL_WORKER_CONCURRENCY || 5),
  },
)

worker.on("ready", () => {
  logEmailEvent({
    event: "email_worker_ready",
  })
})

worker.on("failed", (job, error) => {
  logEmailEvent({
    event: "email_send_failed",
    level: "error",
    jobId: job?.id,
    attemptsMade: job?.attemptsMade,
    error,
    email: job?.data,
  })
})

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  logEmailEvent({
    event: "email_worker_shutdown",
    email: {
      to: "worker@internal",
      subject: `Received ${signal}`,
    },
  })

  await worker.close()
}

process.on("SIGINT", (signal) => {
  shutdown(signal).finally(() => process.exit(0))
})

process.on("SIGTERM", (signal) => {
  shutdown(signal).finally(() => process.exit(0))
})
