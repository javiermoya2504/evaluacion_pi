import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth } from "@/lib/middleware/role"
import { getAllUsers } from "@/lib/users/store"

export const GET = withAuth(async () => {
  try {
    const users = await getAllUsers()

    return jsonResponse({
      success: true,
      users,
    })
  } catch (error) {
    console.error("[GET /api/users]", error)
    return errorResponse("Error interno del servidor", 500)
  }
})
