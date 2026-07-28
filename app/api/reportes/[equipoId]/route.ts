import { errorResponse, jsonResponse } from "@/lib/auth"
import { withRoles } from "@/lib/middleware/role"
import { getReporteEquipo } from "@/lib/reportes/store"
import type { Role } from "@/lib/types/auth"

const READ_ROLES: Role[] = ["admin", "profesor"]

export const GET = withRoles(READ_ROLES, async (_request, { params }) => {
  try {
    const { equipoId } = await params

    const reporte = await getReporteEquipo(equipoId)

    if (!reporte) {
      return errorResponse("No se encontró el equipo", 404)
    }

    return jsonResponse({
      success: true,
      reporte,
    })
  } catch (error) {
    console.error("[GET /api/reportes/:equipoId]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
