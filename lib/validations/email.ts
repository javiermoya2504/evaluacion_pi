import { z } from "zod"

const recipientField = z.string().trim().min(1, "El recipient es obligatorio")

export const createEmailSchema = z.object({
  recipient: z.union([
    recipientField.email("El recipient debe ser un correo válido"),
    z.array(recipientField.email("Cada destinatario debe ser un correo válido")),
  ]),
  subject: z.string().trim().min(1, "El subject es obligatorio"),
  text: z.string().trim().min(1, "El text es obligatorio"),
  html: z.string().trim().optional(),
})

export type CreateEmailInput = z.infer<typeof createEmailSchema>
