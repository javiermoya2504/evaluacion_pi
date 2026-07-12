import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  forbiddenResponse,
  getUserFromRequest,
  unauthorizedResponse,
} from "@/lib/auth"
import type { AuthUser, Role } from "@/lib/types/auth"

export type RouteParamsContext = {
  params: Promise<Record<string, string>>
}

export type AuthenticatedContext<T extends RouteParamsContext = RouteParamsContext> = {
  user: AuthUser
} & T

export type AuthenticatedHandler<T extends RouteParamsContext = RouteParamsContext> = (
  request: NextRequest,
  context: AuthenticatedContext<T>,
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
  allowedRoles: readonly Role[],
): NextResponse | null {
  if (!allowedRoles.includes(user.rol)) {
    return forbiddenResponse()
  }

  return null
}

export function withAuth<T extends RouteParamsContext = RouteParamsContext>(
  handler: AuthenticatedHandler<T>,
) {
  return async (
    request: NextRequest,
    routeContext: T,
  ): Promise<NextResponse> => {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    return handler(request, { user: authResult.user, ...routeContext })
  }
}

export function withRoles<T extends RouteParamsContext = RouteParamsContext>(
  allowedRoles: readonly Role[],
  handler: AuthenticatedHandler<T>,
) {
  return async (
    request: NextRequest,
    routeContext: T,
  ): Promise<NextResponse> => {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
      return authResult
    }

    const roleError = requireRole(authResult.user, allowedRoles)

    if (roleError) {
      return roleError
    }

    return handler(request, { user: authResult.user, ...routeContext })
  }
}
