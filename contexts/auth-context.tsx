"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { SessionProvider, signOut, useSession } from "next-auth/react"

export type UserRole = "admin" | "coordinadora_pi" | "jefe_asignatura" | "profesor" | "alumno"

export interface User {
  id: string
  nombre: string
  email: string
  rol: UserRole
  carrera?: string
  asignatura?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isCoordinadora: boolean
  isJefeAsignatura: boolean
  isProfesor: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AUTH_STORAGE_KEY = "sigep_user"
const AUTH_TOKEN_STORAGE_KEY = "sigep_token"
const AUTH_STORAGE_EVENT = "sigep-auth-change"

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateProvider>{children}</AuthStateProvider>
    </SessionProvider>
  )
}

function AuthStateProvider({ children }: { children: ReactNode }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { status } = useSession()
  const router = useRouter()
  const storedUserValue = useSyncExternalStore(
    subscribeToStoredUser,
    getStoredUserValue,
    () => null,
  )
  const storedUser = useMemo(() => parseStoredUser(storedUserValue), [storedUserValue])
  const user = storedUser
  const isLoading = status === "loading" || isAuthenticating

  useEffect(() => {
    if (user) {
      document.documentElement.dataset.roleTheme = user.rol
    } else {
      document.documentElement.dataset.roleTheme = "guest"
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsAuthenticating(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = (await response.json()) as {
          user?: User
          token?: string
        }

        if (data.user && data.token) {
          setStoredSession(data.user, data.token)
          return true
        }
      }

      return false
    } catch {
      return false
    } finally {
      setIsAuthenticating(false)
    }
  }

  const logout = () => {
    clearStoredUser()

    if (status === "authenticated") {
      signOut({ callbackUrl: "/login" })
      return
    }

    router.push("/login")
  }

  const isCoordinadora = user?.rol === "coordinadora_pi"
  const isJefeAsignatura = user?.rol === "jefe_asignatura"
  const isProfesor = user?.rol === "profesor"

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isCoordinadora,
        isJefeAsignatura,
        isProfesor,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function subscribeToStoredUser(onChange: () => void) {
  window.addEventListener("storage", onChange)
  window.addEventListener(AUTH_STORAGE_EVENT, onChange)
  return () => {
    window.removeEventListener("storage", onChange)
    window.removeEventListener(AUTH_STORAGE_EVENT, onChange)
  }
}

function getStoredUserValue() {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

function parseStoredUser(value: string | null): User | null {
  if (!value) return null

  try {
    return JSON.parse(value) as User
  } catch {
    return null
  }
}

function setStoredSession(user: User, token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT))
}

function clearStoredUser() {
  const hasStoredUser = localStorage.getItem(AUTH_STORAGE_KEY)
  const hasStoredToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!hasStoredUser && !hasStoredToken) return
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT))
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

export function getRoleName(rol: UserRole): string {
  const roles: Record<UserRole, string> = {
    admin: "Administrador",
    coordinadora_pi: "Coordinadora PI",
    jefe_asignatura: "Jefe de asignatura",
    profesor: "Profesor evaluador",
    alumno: "Alumno",
  }
  return roles[rol]
}

export function getRoleColor(rol: UserRole): string {
  const colors: Record<UserRole, string> = {
    admin: "border-teal-200 bg-teal-50 text-teal-700",
    coordinadora_pi: "border-teal-200 bg-teal-50 text-teal-700",
    jefe_asignatura: "border-blue-200 bg-blue-50 text-blue-700",
    profesor: "border-amber-200 bg-amber-50 text-amber-700",
    alumno: "border-emerald-200 bg-emerald-50 text-emerald-700",
  }
  return colors[rol]
}
