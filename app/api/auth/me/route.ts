import { NextRequest } from "next/server"
import { jsonResponse } from "@/lib/auth"
import { withAuth } from "@/lib/middleware/role"
import { findUserById, toPublicUser } from "@/lib/users/store"

export const runtime = "nodejs"

export const GET = withAuth(async (_request: NextRequest, { user }) => {
  const storedUser = await findUserById(user.id)
  const currentUser = storedUser ? toPublicUser(storedUser) : user

  return jsonResponse({
    success: true,
    user: currentUser,
  })
})
