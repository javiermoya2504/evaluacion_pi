"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth, getRoleName, getRoleColor } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FileBarChart,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  FileCheck,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NavigationItem = {
  name: string
  href: string
  icon: typeof LayoutDashboard
  description: string
  roles: ("coordinadora_pi" | "jefe_asignatura" | "profesor")[]
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Vista general del sistema",
    roles: ["coordinadora_pi", "jefe_asignatura", "profesor"],
  },
  {
    name: "Rúbricas",
    href: "/dashboard/rubricas",
    icon: ClipboardList,
    description: "Gestión de rúbricas académicas",
    roles: ["coordinadora_pi", "jefe_asignatura"],
  },
  {
    name: "Proyectos",
    href: "/dashboard/proyectos",
    icon: BookOpen,
    description: "Proyectos integradores",
    roles: ["coordinadora_pi", "jefe_asignatura"],
  },
  {
    name: "Equipos",
    href: "/dashboard/equipos",
    icon: Users,
    description: "Gestión de equipos",
    roles: ["coordinadora_pi"],
  },
  {
    name: "Evaluaciones",
    href: "/dashboard/evaluaciones",
    icon: FileCheck,
    description: "Evaluación de proyectos",
    roles: ["coordinadora_pi", "profesor"],
  },
  {
    name: "Reportes",
    href: "/dashboard/reportes",
    icon: FileBarChart,
    description: "Reportes y estadísticas",
    roles: ["coordinadora_pi"],
  },
]

const secondaryNavigation: NavigationItem[] = [
  {
    name: "Notificaciones",
    href: "/dashboard/notificaciones",
    icon: Bell,
    description: "Centro de notificaciones",
    roles: ["coordinadora_pi", "jefe_asignatura", "profesor"],
  },
  {
    name: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    description: "Ajustes del sistema",
    roles: ["coordinadora_pi"],
  },
]

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout, isCoordinadora, isJefeAsignatura, isProfesor } = useAuth()

  // Filtrar navegación según el rol del usuario
  const filteredNavigation = navigation.filter(
    (item) => user && item.roles.includes(user.rol)
  )
  const filteredSecondaryNav = secondaryNavigation.filter(
    (item) => user && item.roles.includes(user.rol)
  )

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">SIGEP-RI</span>
              <span className="text-xs text-muted-foreground">Proyectos Integradores</span>
            </div>
          )}
        </div>

        {/* User Role Badge */}
        {!collapsed && user && (
          <div className="border-b border-sidebar-border px-4 py-3">
            <span
              className={cn(
                "inline-flex w-full justify-center rounded-md border px-2 py-1 text-xs font-medium",
                getRoleColor(user.rol)
              )}
            >
              {getRoleName(user.rol)}
            </span>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          <div className="mb-2 px-2">
            {!collapsed && (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Principal
              </span>
            )}
          </div>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return collapsed ? (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg mx-auto transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}

          {/* Secondary Navigation */}
          {filteredSecondaryNav.length > 0 && (
            <div className="my-4 border-t border-sidebar-border pt-4">
              {!collapsed && (
                <span className="mb-2 block px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sistema
                </span>
              )}
              {filteredSecondaryNav.map((item) => {
                const isActive = pathname === item.href
                return collapsed ? (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg mx-auto transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent",
                  collapsed && "justify-center"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                {!collapsed && user && (
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium text-sidebar-foreground">
                      {user.nombre}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.asignatura || user.carrera}
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user && (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.nombre}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Mi perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-background hover:bg-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  )
}
