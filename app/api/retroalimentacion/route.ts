import { revalidateTag } from "next/cache"
import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth, withRoles } from "@/lib/middleware/role"
import { createRetroalimentacion, getAllRetroalimentaciones } from "@/lib/retroalimentacion/store"
import { createRetroalimentacionSchema } from "@/lib/validations/retroalimentacion"
import type { Role } from "@/lib/types/auth"

const WRITE_ROLES: Role[] = ["admin", "profesor"]

export const GET = withAuth(async () => {
  try {
    const retroalimentaciones = await getAllRetroalimentaciones()

    return jsonResponse({
      success: true,
      retroalimentaciones,
    })
  } catch (error) {
    console.error("[GET /api/retroalimentacion]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withRoles(WRITE_ROLES, async (request: NextRequest) => {
  try {
    const body = await request.json()
    const parsed = createRetroalimentacionSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return errorResponse("Datos de retroalimentación inválidos", 400, errors)
    }

    const retroalimentacion = await createRetroalimentacion(parsed.data)
    revalidateTag("retroalimentaciones", "max")

    return jsonResponse(
      {
        success: true,
        message: "Retroalimentación creada correctamente",
        retroalimentacion,
      },
      201,
    )
  } catch (error) {
    console.error("[POST /api/retroalimentacion]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
