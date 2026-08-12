import { NextRequest } from "next/server"
import { revalidateTag } from "next/cache"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { CACHE_TAGS } from "@/lib/cache-tags"
import { withAuth, withRoles } from "@/lib/middleware/role"
import { createRubrica, getAllRubricas } from "@/lib/rubricas/store"
import { createRubricaSchema } from "@/lib/validations/rubrica"

import type { Role } from "@/lib/types/auth"

const WRITE_ROLES: Role[] = ["coordinadora_pi", "jefe_asignatura"]

export const GET = withAuth(async () => {
  try {
    const rubricas = await getAllRubricas()

    return jsonResponse({
      success: true,
      rubricas,
    })
  } catch (error) {
    console.error("[GET /api/rubricas/global]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createRubricaSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de rúbrica inválidos", 400, errors)
    }

    const rubrica = await createRubrica(parsed.data)
    revalidateTag(CACHE_TAGS.rubricas, "max")

    return jsonResponse(
      {
        success: true,
        message: "Rúbrica global creada correctamente",
        rubrica,
      },
      201,
    )
  } catch (error) {
    console.error("[POST /api/rubricas/global]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
