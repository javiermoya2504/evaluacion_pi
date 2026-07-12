import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth, withRoles } from "@/lib/middleware/role"
import { createEquipo, getAllEquipos, getEquipoById, updateEquipo } from "@/lib/equipos/store"
import { createEquipoSchema, updateEquipoSchema } from "@/lib/validations/equipo"

import type { Role } from "@/lib/types/auth"

export const runtime = "nodejs"

const WRITE_ROLES: Role[] = ["admin", "profesor"]

export const GET = withAuth(async () => {
  try {
    const equipos = await getAllEquipos()

    return jsonResponse({
      success: true,
      equipos,
    })
  } catch (error) {
    console.error("[GET /api/equipos]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createEquipoSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de equipo invalidos", 400, errors)
    }

    const equipo = await createEquipo(parsed.data)

    return jsonResponse(
      {
        success: true,
        message: "Equipo creado correctamente",
        equipo,
      },
      201,
    )
  } catch (error) {
    if (error instanceof Error && error.message === "EQUIPO_ALREADY_EXISTS") {
      return errorResponse("Ya existe un equipo con ese nombre", 409)
    }

    if (error instanceof Error && error.message === "MATERIA_NOT_FOUND") {
      return errorResponse("Materia no encontrada", 404)
    }

    if (error instanceof Error && error.message === "INTEGRANTE_NOT_FOUND") {
      return errorResponse("Integrante no encontrado", 404)
    }

    console.error("[POST /api/equipos]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const PUT = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = updateEquipoSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de equipo invalidos", 400, errors)
    }

    const existing = await getEquipoById(parsed.data.id)

    if (!existing) {
      return errorResponse("Equipo no encontrado", 404)
    }

    const equipo = await updateEquipo(parsed.data)

    return jsonResponse({
      success: true,
      message: "Equipo actualizado correctamente",
      equipo,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "EQUIPO_ALREADY_EXISTS") {
      return errorResponse("Ya existe un equipo con ese nombre", 409)
    }

    if (error instanceof Error && error.message === "EQUIPO_NOT_FOUND") {
      return errorResponse("Equipo no encontrado", 404)
    }

    if (error instanceof Error && error.message === "MATERIA_NOT_FOUND") {
      return errorResponse("Materia no encontrada", 404)
    }

    if (error instanceof Error && error.message === "INTEGRANTE_NOT_FOUND") {
      return errorResponse("Integrante no encontrado", 404)
    }

    console.error("[PUT /api/equipos]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
