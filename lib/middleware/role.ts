import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  forbiddenResponse,
  getUserFromRequest,
  unauthorizedResponse,
} from "@/lib/auth"
import type { AuthUser, Role } from "@/lib/types/auth"

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { user: AuthUser },
) => Promise<NextResponse> | NextResponse

export async function requireAuth(
  request: NextRequest,
): Promise<{ user: AuthUser } | NextResponse> {
  const user = getUserFromRequest(request)

  if (!user) {
    return unauthorizedResponse("Token inválido o ausente")
  }

  return { user }
}

export function requireRole(
  user: AuthUser,
  allowedRoles: Role[],
): NextResponse | null {
  if (!allowedRoles.includes(user.rol)) {
    return forbiddenResponse()
  }

  return null
}

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    return handler(request, { user: authResult.user })
  }
}

export function withRoles(allowedRoles: Role[], handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const roleError = requireRole(authResult.user, allowedRoles)

    if (roleError) {
      return roleError
    }

    return handler(request, { user: authResult.user })
  }
}
