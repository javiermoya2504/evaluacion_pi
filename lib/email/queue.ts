import { Queue, type ConnectionOptions } from "bullmq"

import { EMAIL_QUEUE_NAME, getRedisUrl } from "./config"
import { logEmailEvent } from "./log"
import type { EmailJobData, EmailSendResult } from "./types"

let emailQueue: Queue<EmailJobData, EmailSendResult, "send"> | undefined

export function getEmailRedisConnectionOptions(): ConnectionOptions {
  const redisUrl = new URL(getRedisUrl())

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    tls: redisUrl.protocol === "rediss:" ? {} : undefined,
    maxRetriesPerRequest: null,
  }
}

export function getEmailQueue(): Queue<EmailJobData, EmailSendResult, "send"> {
  if (!emailQueue) {
    emailQueue = new Queue<EmailJobData, EmailSendResult, "send">(EMAIL_QUEUE_NAME, {
      connection: getEmailRedisConnectionOptions(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5_000,
        },
        removeOnComplete: {
          age: 86_400,
          count: 1_000,
        },
        removeOnFail: {
          age: 604_800,
          count: 5_000,
        },
      },
    })
  }

  return emailQueue
}

export async function enqueueEmail(email: EmailJobData): Promise<string> {
  const job = await getEmailQueue().add("send", email)

  logEmailEvent({
    event: "email_job_enqueued",
    jobId: job.id,
    email,
  })

  return job.id ?? ""
}

export async function closeEmailQueue(): Promise<void> {
  await emailQueue?.close()
  emailQueue = undefined
}
