import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const API_RATE_LIMIT_WINDOW_MS = 60_000
const API_RATE_LIMIT_MAX_REQUESTS = 100
const API_RATE_LIMIT_AUTH_MAX_REQUESTS = 20

const RATE_LIMIT_EXEMPT_ROUTES = ["/api/health", "/api/docs"]

const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/",
]


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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  if (
    RATE_LIMIT_EXEMPT_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
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

  return withRateLimitHeaders(NextResponse.next(), rateLimit)
}

export const config = {
  matcher: ["/api/:path*"],
}
