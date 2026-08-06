import { NextRequest } from "next/server"
import {
  errorResponse,
  getJwtSecret,
  hashPassword,
  jsonResponse,
  signToken,
} from "@/lib/auth"
import { createUser } from "@/lib/users/store"
import { registerSchema } from "@/lib/validations/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    getJwtSecret()
  } catch {
    return errorResponse("Configuración del servidor incompleta", 500)
  }

  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de registro inválidos", 400, errors)
    }

    const { email, password, nombre, rol } = parsed.data
    const passwordHash = await hashPassword(password)

    const user = await createUser({
      email,
      nombre,
      rol,
      passwordHash,
    })

    const token = signToken(user)

    return jsonResponse(
      {
        success: true,
        message: "Usuario registrado correctamente",
        user,
        token,
      },
      201,
    )
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return errorResponse("El correo electrónico ya está registrado", 409)
    }

    console.error("[POST /api/auth/register]", error)
    return errorResponse("Error interno del servidor", 500)
  }
}
