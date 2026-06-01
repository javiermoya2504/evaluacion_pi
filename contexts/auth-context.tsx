"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { SessionProvider, signOut, useSession } from "next-auth/react"

export type UserRole = "coordinadora_pi" | "jefe_asignatura" | "profesor"

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

const demoUsers: Record<string, User & { password: string }> = {
  "coordinadora@utt.edu.mx": {
    id: "1",
    nombre: "Dra. Maria Gonzalez Hernandez",
    email: "coordinadora@utt.edu.mx",
    rol: "coordinadora_pi",
    carrera: "ISC / ITI",
    password: "admin123",
  },
  "jefe.programacion@utt.edu.mx": {
    id: "2",
    nombre: "Ing. Carlos Ramirez Lopez",
    email: "jefe.programacion@utt.edu.mx",
    rol: "jefe_asignatura",
    asignatura: "Programacion Web",
    carrera: "ISC",
    password: "jefe123",
  },
  "jefe.bd@utt.edu.mx": {
    id: "3",
    nombre: "Mtro. Roberto Sanchez Perez",
    email: "jefe.bd@utt.edu.mx",
    rol: "jefe_asignatura",
    asignatura: "Base de Datos",
    carrera: "ISC",
    password: "jefe123",
  },
  "profesor@utt.edu.mx": {
    id: "4",
    nombre: "Ing. Ana Martinez Ruiz",
    email: "profesor@utt.edu.mx",
    rol: "profesor",
    carrera: "ISC",
    password: "prof123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateProvider>{children}</AuthStateProvider>
    </SessionProvider>
  )
}

function AuthStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      return
    }

    const googleUser = getGoogleUser(session?.user)
    if (googleUser) {
      setUser(googleUser)
      localStorage.removeItem("sigep_user")
      setIsLoading(false)
      return
    }

    const savedUser = localStorage.getItem("sigep_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("sigep_user")
      }
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))

    const demoUser = demoUsers[email.toLowerCase()]

    if (demoUser && demoUser.password === password) {
      const { password: _, ...userWithoutPassword } = demoUser
      setUser(userWithoutPassword)
      localStorage.setItem("sigep_user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sigep_user")

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

function getGoogleUser(sessionUser: unknown): User | null {
  if (!sessionUser || typeof sessionUser !== "object") {
    return null
  }

  const userData = sessionUser as {
    name?: string | null
    email?: string | null
    image?: string | null
  }

  if (!userData.email) {
    return null
  }

  const email = userData.email.toLowerCase()
  const demoUser = demoUsers[email]

  if (demoUser) {
    const { password: _, ...userWithoutPassword } = demoUser
    return {
      ...userWithoutPassword,
      nombre: userData.name || userWithoutPassword.nombre,
      avatar: userData.image || userWithoutPassword.avatar,
    }
  }

  return {
    id: email,
    nombre: userData.name || email,
    email,
    rol: "profesor",
    carrera: "ISC",
    avatar: userData.image || undefined,
  }
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
    coordinadora_pi: "Coordinadora de PI",
    jefe_asignatura: "Jefe de Asignatura",
    profesor: "Profesor Evaluador",
  }
  return roles[rol]
}

export function getRoleColor(rol: UserRole): string {
  const colors: Record<UserRole, string> = {
    coordinadora_pi: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    jefe_asignatura: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    profesor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  }
  return colors[rol]
}
