import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"
import type { Role } from "@/lib/types/auth"

const API_RATE_LIMIT_WINDOW_MS = 60_000
const API_RATE_LIMIT_MAX_REQUESTS = 100
const API_RATE_LIMIT_AUTH_MAX_REQUESTS = 20

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

type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfter: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) return null
  const token = authorization.slice(7).trim()
  return token.length > 0 ? token : null
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown"
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  )
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

function getApiRateLimit(pathname: string): number {
  if (pathname.startsWith("/api/auth/")) {
    return API_RATE_LIMIT_AUTH_MAX_REQUESTS
  }

  return API_RATE_LIMIT_MAX_REQUESTS
}

function checkApiRateLimit(request: NextRequest): RateLimitResult {
  const now = Date.now()
  const { pathname } = request.nextUrl
  const limit = getApiRateLimit(pathname)
  const clientIp = getClientIp(request)
  const key = `${clientIp}:api`
  const currentEntry = rateLimitStore.get(key)

  if (!currentEntry || currentEntry.resetAt <= now) {
    const resetAt = now + API_RATE_LIMIT_WINDOW_MS
    rateLimitStore.set(key, { count: 1, resetAt })

    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      resetAt,
      retryAfter: 0,
    }
  }

  currentEntry.count += 1

  if (currentEntry.count > limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: currentEntry.resetAt,
      retryAfter: Math.ceil((currentEntry.resetAt - now) / 1000),
    }
  }

  return {
    allowed: true,
    limit,
    remaining: Math.max(limit - currentEntry.count, 0),
    resetAt: currentEntry.resetAt,
    retryAfter: 0,
  }
}

function withRateLimitHeaders(
  response: NextResponse,
  rateLimit: RateLimitResult,
): NextResponse {
  response.headers.set("X-RateLimit-Limit", rateLimit.limit.toString())
  response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
  response.headers.set(
    "X-RateLimit-Reset",
    Math.ceil(rateLimit.resetAt / 1000).toString(),
  )

  if (!rateLimit.allowed) {
    response.headers.set("Retry-After", rateLimit.retryAfter.toString())
  }

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const rateLimit = checkApiRateLimit(request)

  if (!rateLimit.allowed) {
    return withRateLimitHeaders(
      NextResponse.json(
        {
          success: false,
          message: "Demasiadas solicitudes. Intenta de nuevo mas tarde.",
        },
        { status: 429 },
      ),
      rateLimit,
    )
  }

  if (isPublicApiRoute(pathname)) {
    return withRateLimitHeaders(NextResponse.next(), rateLimit)
  }

  const requiredRoles = getRequiredRoles(pathname)

  if (!requiredRoles) {
    return withRateLimitHeaders(NextResponse.next(), rateLimit)
  }

  const token = getBearerToken(request)

  if (!token) {
    return withRateLimitHeaders(
      NextResponse.json(
        { success: false, message: "Token invalido o ausente" },
        { status: 401 },
      ),
      rateLimit,
    )
  }

  const payload = verifyToken(token)

  if (!payload) {
    return withRateLimitHeaders(
      NextResponse.json(
        { success: false, message: "Token invalido o expirado" },
        { status: 401 },
      ),
      rateLimit,
    )
  }

  if (!requiredRoles.includes(payload.rol)) {
    return withRateLimitHeaders(
      NextResponse.json(
        { success: false, message: "No tienes permisos para realizar esta accion" },
        { status: 403 },
      ),
      rateLimit,
    )
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-user-id", payload.sub)
  requestHeaders.set("x-user-role", payload.rol)
  requestHeaders.set("x-user-email", payload.email)

  return withRateLimitHeaders(
    NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    }),
    rateLimit,
  )
}

export const config = {
  matcher: ["/api/:path*"],
}
