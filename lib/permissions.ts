import { type UserRole } from "@/contexts/auth-context"

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  coordinadora_pi: ["*"],
  jefe_asignatura: ["/dashboard", "/dashboard/rubricas", "/dashboard/proyectos"],
  profesor: ["/dashboard", "/dashboard/evaluaciones"],
}

export function hasPermission(role: UserRole, path: string): boolean {
  if (role === "coordinadora_pi") return true

  const cleanPath = path.replace(/\/$/, "")
  const allowedPaths = ROLE_PERMISSIONS[role] || []

  return allowedPaths.some((allowed) => cleanPath === allowed || cleanPath.startsWith(`${allowed}/`))
}
