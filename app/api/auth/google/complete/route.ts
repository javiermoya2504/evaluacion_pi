import { randomUUID } from "crypto"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/nextauth"
import { errorResponse, hashPassword, jsonResponse, signToken } from "@/lib/auth"
import { parseOAuthRole } from "@/lib/oauth-role"
import { findOrCreateOAuthUser } from "@/lib/users/store"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email?.trim().toLowerCase()
  const name = session?.user?.name?.trim()

  if (!email) return errorResponse("Debes autenticarte con Google", 401)

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse("Solicitud invalida", 400)
  }

  const role = parseOAuthRole(
    body && typeof body === "object" && "rol" in body ? body.rol : undefined,
  )
  if (!role) return errorResponse("Selecciona un rol valido", 400)

  const passwordHash = await hashPassword(randomUUID())
  const user = await findOrCreateOAuthUser({
    email,
    nombre: name || email,
    rol: role,
    passwordHash,
  })

  return jsonResponse({ success: true, user, token: signToken(user) })
}
