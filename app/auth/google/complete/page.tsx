"use client"

import { Suspense, useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { parseOAuthRole } from "@/lib/oauth-role"

const AUTH_STORAGE_KEY = "sigep_user"
const AUTH_TOKEN_STORAGE_KEY = "sigep_token"
const AUTH_STORAGE_EVENT = "sigep-auth-change"

export default function CompleteGoogleAuthPage() {
  return (
    <Suspense fallback={<CompletionStatus />}>
      <CompleteGoogleAuthContent />
    </Suspense>
  )
}

function CompleteGoogleAuthContent() {
  const { status } = useSession()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState("")
  const role = parseOAuthRole(searchParams.get("role"))
  const visibleError = error || (!role ? "No se recibio un rol valido. Vuelve al inicio e intenta de nuevo." : "")

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") {
      router.replace("/login?error=google")
      return
    }

    if (!role) return

    let cancelled = false
    const complete = async () => {
      try {
        const response = await fetch("/api/auth/google/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rol: role }),
        })
        const data = await response.json()
        if (!response.ok || !data.user || !data.token) {
          throw new Error(data.message || "No se pudo completar el registro con Google")
        }
        if (cancelled) return
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user))
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, data.token)
        window.dispatchEvent(new Event(AUTH_STORAGE_EVENT))
        router.replace("/dashboard")
      } catch (completionError) {
        if (!cancelled) {
          setError(completionError instanceof Error ? completionError.message : "Error al completar el acceso")
        }
      }
    }
    void complete()
    return () => { cancelled = true }
  }, [role, router, status])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
        {visibleError ? (
          <div className="space-y-5">
            <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h1 className="text-xl font-semibold">No pudimos completar el acceso</h1>
            <p className="text-sm text-slate-600">{visibleError}</p>
            <Button onClick={() => signOut({ callbackUrl: "/login" })}>Volver a iniciar sesion</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-700" />
            <h1 className="text-xl font-semibold">Preparando tu perfil</h1>
            <p className="text-sm text-slate-600">Estamos vinculando tu cuenta de Google con el rol seleccionado.</p>
          </div>
        )}
      </div>
    </main>
  )
}

function CompletionStatus() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-4 rounded-2xl border bg-white p-8 text-center shadow-lg">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-teal-700" />
        <h1 className="text-xl font-semibold">Preparando tu perfil</h1>
      </div>
    </main>
  )
}
