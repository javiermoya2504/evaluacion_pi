import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"
import type { Role } from "@/lib/types/auth"

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/",
]

const ROLE_PROTECTED_ROUTES: Record<string, Role[]> = {
  "/api/admin": ["admin"],
  "/api/profesor": ["admin", "profesor"],
  "/api/alumno": ["admin", "profesor", "alumno"],
}

function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) return null
  const token = authorization.slice(7).trim()
  return token.length > 0 ? token : null
}

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

function getRequiredRoles(pathname: string): Role[] | null {
  const matchedRoute = Object.keys(ROLE_PROTECTED_ROUTES).find((route) =>
    pathname.startsWith(route),
  )

  return matchedRoute ? ROLE_PROTECTED_ROUTES[matchedRoute] : null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (isPublicApiRoute(pathname)) {
    return NextResponse.next()
  }

  const requiredRoles = getRequiredRoles(pathname)

  if (!requiredRoles) {
    return NextResponse.next()
  }

  const token = getBearerToken(request)

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Token inválido o ausente" },
      { status: 401 },
    )
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Token inválido o expirado" },
      { status: 401 },
    )
  }

  if (!requiredRoles.includes(payload.rol)) {
    return NextResponse.json(
      { success: false, message: "No tienes permisos para realizar esta acción" },
      { status: 403 },
    )
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", payload.sub)
  requestHeaders.set("x-user-role", payload.rol)
  requestHeaders.set("x-user-email", payload.email)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/api/:path*"],
}
