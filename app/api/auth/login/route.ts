import { NextRequest } from "next/server"
import {
  comparePassword,
  errorResponse,
  getJwtSecret,
  jsonResponse,
  signToken,
} from "@/lib/auth"
import { findUserByEmail, toPublicUser } from "@/lib/users/store"
import { loginSchema } from "@/lib/validations/auth"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    getJwtSecret()
  } catch {
    return errorResponse("Configuración del servidor incompleta", 500)
  }

  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de inicio de sesión inválidos", 400, errors)
    }

    const { email, password } = parsed.data
    const storedUser = await findUserByEmail(email)

    if (!storedUser) {
      return errorResponse("Credenciales incorrectas", 401)
    }

    const isValidPassword = await comparePassword(password, storedUser.passwordHash)

    if (!isValidPassword) {
      return errorResponse("Credenciales incorrectas", 401)
    }

    const user = toPublicUser(storedUser)
    const token = signToken(user)

    return jsonResponse({
      success: true,
      message: "Inicio de sesión exitoso",
      user,
      token,
    })
  } catch (error) {
    console.error("[POST /api/auth/login]", error)
    return errorResponse("Error interno del servidor", 500)
  }
}
