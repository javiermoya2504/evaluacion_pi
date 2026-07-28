import { errorResponse, jsonResponse } from "@/lib/auth"
import { withRoles } from "@/lib/middleware/role"
import { getEstadisticasMaterias } from "@/lib/estadisticas/store"
import type { Role } from "@/lib/types/auth"

const READ_ROLES: Role[] = ["admin", "profesor"]

export const GET = withRoles(READ_ROLES, async () => {
  try {
    const materias = await getEstadisticasMaterias()

    return jsonResponse({
      success: true,
      materias,
    })
  } catch (error) {
    console.error("[GET /api/estadisticas/materias]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
