import { type UserRole } from "@/contexts/auth-context"

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["*"],
  coordinadora_pi: ["*"],
  jefe_asignatura: ["/dashboard", "/dashboard/rubricas", "/dashboard/proyectos"],
  profesor: ["/dashboard", "/dashboard/evaluaciones", "/dashboard/retroalimentacion", "/dashboard/rubricas"],
  alumno: ["/dashboard"],
}

export function hasPermission(role: UserRole, path: string): boolean {
  if (role === "admin" || role === "coordinadora_pi") return true

  const cleanPath = path.replace(/\/$/, "")
  const allowedPaths = ROLE_PERMISSIONS[role] || []

  return allowedPaths.some((allowed) => {
    if (cleanPath === allowed) return true
    if (allowed === "/dashboard") return false
    return cleanPath.startsWith(`${allowed}/`)
  })
}
