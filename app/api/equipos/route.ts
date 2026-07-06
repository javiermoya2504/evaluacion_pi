import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth } from "@/lib/middleware/role"

export const runtime = "nodejs"

export const GET = withAuth(async () => {
  try {
    return jsonResponse({
      success: true,
      equipos: [],
    })
  } catch (error) {
    console.error("[GET /api/equipos]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()

    return jsonResponse(
      {
        success: true,
        message: "Equipo recibido",
        equipo: body,
      },
      201,
    )
  } catch (error) {
    console.error("[POST /api/equipos]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
