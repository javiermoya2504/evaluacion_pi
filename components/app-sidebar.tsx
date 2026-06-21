"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, getRoleColor, getRoleName, type UserRole } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/permissions"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react"

type NavigationItem = {
  name: string
  href: string
  icon: typeof LayoutDashboard
  description: string
  roles: UserRole[]
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Resumen por rol",
    roles: ["coordinadora_pi", "jefe_asignatura", "profesor"],
  },
  {
    name: "Rubricas",
    href: "/dashboard/rubricas",
    icon: ClipboardList,
    description: "Criterios y ponderaciones",
    roles: ["coordinadora_pi", "jefe_asignatura"],
  },
  {
    name: "Proyectos",
    href: "/dashboard/proyectos",
    icon: BookOpenCheck,
    description: "Proyectos integradores",
    roles: ["coordinadora_pi", "jefe_asignatura"],
  },
  {
    name: "Equipos",
    href: "/dashboard/equipos",
    icon: Users,
    description: "Equipos participantes",
    roles: ["coordinadora_pi"],
  },
  {
    name: "Evaluaciones",
    href: "/dashboard/evaluaciones",
    icon: ShieldCheck,
    description: "Aplicacion de rubricas",
    roles: ["coordinadora_pi", "profesor"],
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
    description: "Indicadores y resultados",
    roles: ["coordinadora_pi"],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.rol) && hasPermission(user.rol, item.href)
  )

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="border-b border-sidebar-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">SIGEP-PI</p>
            <p className="text-xs font-medium text-white/58">Universidad Politecnica de Queretaro</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="border-b border-sidebar-border p-4">
          <Badge className={cn("mb-3 w-full justify-center border py-1.5", getRoleColor(user.rol))}>
            {getRoleName(user.rol)}
          </Badge>
          <div className="rounded-xl bg-white/8 p-3">
            <p className="truncate text-sm font-semibold">{user.nombre}</p>
            <p className="mt-1 truncate text-xs text-white/58">{user.asignatura || user.carrera}</p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
          Navegacion
        </p>
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-3 py-3 transition",
                isActive
                  ? "bg-sidebar-accent text-white shadow-sm"
                  : "text-white/68 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", isActive ? "text-sidebar-primary" : "text-white/52")} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.name}</span>
                <span className="mt-0.5 block text-xs text-white/48 group-hover:text-white/60">{item.description}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:bg-white/8 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesion
        </Button>
      </div>
    </aside>
  )
}
