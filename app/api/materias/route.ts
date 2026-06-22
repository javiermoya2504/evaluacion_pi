import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth, withRoles } from "@/lib/middleware/role"
import { createMateria, getAllMaterias } from "@/lib/materias/store"
import { createMateriaSchema } from "@/lib/validations/materia"

import type { Role } from "@/lib/types/auth"

export const runtime = "nodejs"

const WRITE_ROLES: Role[] = ["admin", "profesor"]

export const GET = withAuth(async () => {
  try {
    const materias = await getAllMaterias()

    return jsonResponse({
      success: true,
      materias,
    })
  } catch (error) {
    console.error("[GET /api/materias]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createMateriaSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de materia inválidos", 400, errors)
    }

    const materia = await createMateria(parsed.data)

    return jsonResponse(
      {
        success: true,
        message: "Materia creada correctamente",
        materia,
      },
      201,
    )
  } catch (error) {
    if (error instanceof Error && error.message === "MATERIA_ALREADY_EXISTS") {
      return errorResponse("Ya existe una materia con ese nombre", 409)
    }

    console.error("[POST /api/materias]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
