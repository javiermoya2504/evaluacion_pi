"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/permissions"
import { AppSidebar } from "@/components/app-sidebar"
import { GraduationCap, Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (!hasPermission(user.rol, pathname)) {
      router.push("/dashboard")
    }
  }, [isLoading, pathname, router, user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparando panel...
          </div>
        </div>
      </div>
    )
  }

  if (!user || !hasPermission(user.rol, pathname)) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="min-h-screen md:pl-72">{children}</main>
    </div>
  )
}
