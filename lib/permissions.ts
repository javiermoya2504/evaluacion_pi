import { UserRole } from "@/contexts/auth-context"

// Permisos del sistema por rol
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  coordinadora_pi: ["*"], // Acceso completo a todas las rutas
  jefe_asignatura: [
    "/dashboard",
    "/dashboard/rubricas",
    "/dashboard/proyectos",
    "/dashboard/notificaciones",
    "/dashboard/perfil",
  ],
  profesor: [
    "/dashboard",
    "/dashboard/evaluaciones",
    "/dashboard/notificaciones",
    "/dashboard/perfil",
  ],
}

/**
 * Valida si un rol tiene permiso para acceder a una ruta específica.
 */
export function hasPermission(role: UserRole, path: string): boolean {
  if (role === "coordinadora_pi") return true

  const allowedPaths = ROLE_PERMISSIONS[role] || []
  
  // Limpiar slash final para evitar problemas de concordancia
  const cleanPath = path.replace(/\/$/, "")

  return allowedPaths.some((allowed) => {
    // Coincidencia exacta (ej. /dashboard)
    if (cleanPath === allowed) return true
    // Coincidencia de subruta (ej. /dashboard/rubricas/nueva)
    if (cleanPath.startsWith(allowed + "/")) return true
    return false
  })
}
