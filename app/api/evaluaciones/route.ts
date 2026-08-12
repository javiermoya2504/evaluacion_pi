import { NextRequest } from "next/server"
import { revalidateTag } from "next/cache"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { CACHE_TAGS } from "@/lib/cache-tags"
import { withAuth, withRoles } from "@/lib/middleware/role"
import {
  createEvaluacion,
  getAllEvaluaciones,
  updateEvaluacion,
} from "@/lib/evaluaciones/store"
import { createEvaluacionSchema, updateEvaluacionSchema } from "@/lib/validations/evaluacion"
import type { Role } from "@/lib/types/auth"

const WRITE_ROLES: Role[] = ["coordinadora_pi", "profesor"]

export const GET = withAuth(async () => {
  try {
    const evaluaciones = await getAllEvaluaciones()

    return jsonResponse({
      success: true,
      evaluaciones,
    })
  } catch (error) {
    console.error("[GET /api/evaluaciones]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createEvaluacionSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de evaluación inválidos", 400, errors)
    }

    const evaluacion = await createEvaluacion(parsed.data)
    revalidateTag(CACHE_TAGS.evaluaciones, "max")

    return jsonResponse(
      {
        success: true,
        message: "Evaluación creada correctamente",
        evaluacion,
      },
      201,
    )
  } catch (error) {
    console.error("[POST /api/evaluaciones]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const PUT = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = updateEvaluacionSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de evaluación inválidos", 400, errors)
    }

    const evaluacion = await updateEvaluacion(parsed.data.id, parsed.data)
    revalidateTag(CACHE_TAGS.evaluaciones, "max")

    return jsonResponse({
      success: true,
      message: "Evaluación actualizada correctamente",
      evaluacion,
    })
  } catch (error) {
    if (error instanceof Error && error.message === "EVALUACION_NOT_FOUND") {
      return errorResponse("No se encontró la evaluación", 404)
    }

    console.error("[PUT /api/evaluaciones]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
