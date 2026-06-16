export const ROLES = ["admin", "profesor", "alumno"] as const

export type Role = (typeof ROLES)[number]

export interface AuthUser {
  id: string
  email: string
  nombre: string
  rol: Role
  createdAt: string
}

export interface StoredUser extends AuthUser {
  passwordHash: string
}

export interface JwtPayload {
  sub: string
  email: string
  nombre: string
  rol: Role
  iat?: number
  exp?: number
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
