import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth, withRoles } from "@/lib/middleware/role"
import {
  deleteMateria,
  getMateriaById,
  updateMateria,
} from "@/lib/materias/store"
import { updateMateriaSchema } from "@/lib/validations/materia"

import type { Role } from "@/lib/types/auth"

export const runtime = "nodejs"

const WRITE_ROLES: Role[] = ["admin", "profesor"]

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withAuth<RouteContext>(async (_request, { params }) => {
  try {
    const { id } = await params
    const materia = await getMateriaById(id)

    if (!materia) {
      return errorResponse("Materia no encontrada", 404)
    }

    return jsonResponse({
      success: true,
      materia,
    })
  } catch (error) {
    console.error("[GET /api/materias/[id]]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const PUT = withRoles<RouteContext>(WRITE_ROLES, async (request: NextRequest, { params }) => {
  try {
    const { id } = await params
    const existing = await getMateriaById(id)

    if (!existing) {
      return errorResponse("Materia no encontrada", 404)
    }

    const body = await request.json()
    const parsed = updateMateriaSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de materia inválidos", 400, errors)
    }

    const materia = await updateMateria(id, parsed.data)

    return jsonResponse({
      success: true,
      message: "Materia actualizada correctamente",
      materia,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "MATERIA_ALREADY_EXISTS") {
      return errorResponse("Ya existe una materia con ese nombre", 409)
    }

    if (error instanceof Error && error.message === "MATERIA_NOT_FOUND") {
      return errorResponse("Materia no encontrada", 404)
    }

    console.error("[PUT /api/materias/[id]]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const DELETE = withRoles<RouteContext>(WRITE_ROLES, async (_request, { params }) => {
  try {
    const { id } = await params
    const materia = await deleteMateria(id)

    return jsonResponse({
      success: true,
      message: "Materia eliminada correctamente",
      materia,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "MATERIA_NOT_FOUND") {
      return errorResponse("Materia no encontrada", 404)
    }

    console.error("[DELETE /api/materias/[id]]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
