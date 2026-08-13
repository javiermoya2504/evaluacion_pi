import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { sendEmail } from "@/lib/email/sender"
import { withRoles } from "@/lib/middleware/role"
import { createEmailSchema } from "@/lib/validations/email"
import type { Role } from "@/lib/types/auth"

const WRITE_ROLES: Role[] = ["admin", "coordinadora_pi", "profesor"]

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createEmailSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de correo inválidos", 400, errors)
    }

    const result = await sendEmail({
      to: parsed.data.recipient,
      subject: parsed.data.subject,
      text: parsed.data.text,
      html: parsed.data.html,
      metadata: {
        source: "api/email",
      },
    })

    return jsonResponse({
      success: true,
      message: "Correo enviado correctamente",
      provider: result.provider,
      messageId: result.messageId,
    })
  } catch (error) {
    console.error("[POST /api/email]", error)

    if (error instanceof Error) {
      const message = error.message.toLowerCase()

      if (
        message.includes("faltan secretos") ||
        message.includes("configuración") ||
        message.includes("email")
      ) {
        return errorResponse("Configuración de email incompleta", 500)
      }
    }

    return errorResponse("Error interno del servidor", 500)
  }
})
