import type { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth } from "@/lib/middleware/role"
import { getTrazabilidad } from "@/lib/trazabilidad/store"
import type { TrazabilidadFilters } from "@/lib/types/trazabilidad"

function parseDate(value: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  return value
}

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters: TrazabilidadFilters = {}

    const materiaId = searchParams.get("materiaId")
    const parcialId = searchParams.get("parcialId")
    const equipoId = searchParams.get("equipoId")
    const fechaInicio = parseDate(searchParams.get("fechaInicio"))
    const fechaFin = parseDate(searchParams.get("fechaFin"))

    if (materiaId) {
      filters.materiaId = materiaId
    }

    if (parcialId) {
      filters.parcialId = parcialId
    }

    if (equipoId) {
      filters.equipoId = equipoId
    }

    if (fechaInicio) {
      filters.fechaInicio = fechaInicio
    }

    if (fechaFin) {
      filters.fechaFin = fechaFin
    }

    const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : null
    const fechaFinDate = fechaFin ? new Date(fechaFin) : null

    if (fechaInicioDate && Number.isNaN(fechaInicioDate.getTime())) {
      return errorResponse("La fecha de inicio es inválida", 400)
    }

    if (fechaFinDate && Number.isNaN(fechaFinDate.getTime())) {
      return errorResponse("La fecha de fin es inválida", 400)
    }

    if (fechaInicioDate && fechaFinDate && fechaInicioDate > fechaFinDate) {
      return errorResponse("La fecha de inicio no puede ser posterior a la fecha de fin", 400)
    }

    const trazabilidad = await getTrazabilidad(filters)

    return jsonResponse({
      success: true,
      trazabilidad,
    })
  } catch (error) {
    console.error("[GET /api/trazabilidad]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
