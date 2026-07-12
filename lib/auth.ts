import bcrypt from "bcryptjs"
import jwt, { type SignOptions } from "jsonwebtoken"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { AuthUser, JwtPayload, Role } from "@/lib/types/auth"

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d"
const BCRYPT_ROUNDS = 12
const DEVELOPMENT_JWT_SECRET = "development-only-auth-secret"

export function getConfiguredJwtSecret(): string {
  const configuredSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET

  if (configuredSecret) {
    return configuredSecret
  }

  return process.env.NODE_ENV !== "production" ? DEVELOPMENT_JWT_SECRET : ""
}

export function getJwtSecret(): string {
  const jwtSecret = getConfiguredJwtSecret()

  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está configurado")
  }
  return jwtSecret
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function comparePassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

export function signToken(user: AuthUser): string {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
  }

  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload
    return decoded
  } catch {
    return null
  }
}

export function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization")

  if (!authorization?.startsWith("Bearer ")) {
    return null
  }

  const token = authorization.slice(7).trim()
  return token.length > 0 ? token : null
}

export function getUserFromRequest(request: NextRequest): AuthUser | null {
  const token = getBearerToken(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return {
    id: payload.sub,
    email: payload.email,
    nombre: payload.nombre,
    rol: payload.rol,
    createdAt: "",
  }
}

export function jsonResponse<T>(
  data: T,
  status = 200,
): NextResponse<T> {
  return NextResponse.json(data, { status })
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string[]>,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status },
  )
}

export function unauthorizedResponse(
  message = "No autorizado",
): NextResponse {
  return errorResponse(message, 401)
}

export function forbiddenResponse(
  message = "No tienes permisos para realizar esta acción",
): NextResponse {
  return errorResponse(message, 403)
}

export function hasRole(user: AuthUser, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(user.rol)
}
