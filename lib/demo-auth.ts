import type { AuthUser } from "@/lib/types/auth"

const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  "coordinadora@upq.mx": { id: "demo-coordinadora", nombre: "Dra. Laura Mendoza Rivera", email: "coordinadora@upq.mx", rol: "coordinadora_pi", createdAt: "2026-01-01T00:00:00.000Z", password: "admin123" },
  "jefe@upq.mx": { id: "demo-jefe", nombre: "Mtro. Daniel Hernandez Soto", email: "jefe@upq.mx", rol: "jefe_asignatura", createdAt: "2026-01-01T00:00:00.000Z", password: "jefe123" },
  "profesor@upq.mx": { id: "demo-profesor", nombre: "Ing. Ana Sofia Torres Vega", email: "profesor@upq.mx", rol: "profesor", createdAt: "2026-01-01T00:00:00.000Z", password: "prof123" },
}

export function authenticateDemoUser(email: string, password: string): AuthUser | null {
  const candidate = DEMO_USERS[email.toLowerCase()]
  if (!candidate || candidate.password !== password) return null
  const { password: _password, ...user } = candidate
  void _password
  return user
}
