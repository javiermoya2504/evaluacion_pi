"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  "coordinadora@upq.mx": {
    id: "1",
    nombre: "Dra. Laura Mendoza Rivera",
    email: "coordinadora@upq.mx",
    rol: "coordinadora_pi",
    carrera: "Ingenieria en Software",
    password: "admin123",
  },
  "jefe@upq.mx": {
    id: "2",
    nombre: "Mtro. Daniel Hernandez Soto",
    email: "jefe@upq.mx",
    rol: "jefe_asignatura",
    asignatura: "Desarrollo de Software",
    carrera: "Ingenieria en Software",
    password: "jefe123",
  },
  "profesor@upq.mx": {
    id: "3",
    nombre: "Ing. Ana Sofia Torres Vega",
    email: "profesor@upq.mx",
    rol: "profesor",
    carrera: "Ingenieria en Software",
    password: "prof123",
  },
  "coordinadora@utt.edu.mx": {
    id: "1",
    nombre: "Dra. Laura Mendoza Rivera",
    email: "coordinadora@upq.mx",
    rol: "coordinadora_pi",
    carrera: "Ingenieria en Software",
    password: "admin123",
  },
  "jefe.programacion@utt.edu.mx": {
    id: "2",
    nombre: "Mtro. Daniel Hernandez Soto",
    email: "jefe@upq.mx",
    rol: "jefe_asignatura",
    asignatura: "Desarrollo de Software",
    carrera: "Ingenieria en Software",
    password: "jefe123",
  },
  "jefe@utt.edu.mx": {
    id: "2",
    nombre: "Mtro. Daniel Hernandez Soto",
    email: "jefe@upq.mx",
    rol: "jefe_asignatura",
    asignatura: "Desarrollo de Software",
    carrera: "Ingenieria en Software",
    password: "jefe123",
  },
  "profesor@utt.edu.mx": {
    id: "3",
    nombre: "Ing. Ana Sofia Torres Vega",
    email: "profesor@upq.mx",
    rol: "profesor",
    carrera: "Ingenieria en Software",
    password: "prof123",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedUser = localStorage.getItem("sigep_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem("sigep_user")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      document.documentElement.dataset.roleTheme = user.rol
    } else {
      document.documentElement.dataset.roleTheme = "guest"
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 650))

    const demoUser = demoUsers[email.toLowerCase().trim()]

    if (demoUser && demoUser.password === password) {
      const { password: _password, ...userWithoutPassword } = demoUser
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}

export function getRoleName(rol: UserRole): string {
  const roles: Record<UserRole, string> = {
    coordinadora_pi: "Coordinadora PI",
    jefe_asignatura: "Jefe de asignatura",
    profesor: "Profesor evaluador",
  }
  return roles[rol]
}

export function getRoleColor(rol: UserRole): string {
  const colors: Record<UserRole, string> = {
    coordinadora_pi: "border-teal-200 bg-teal-50 text-teal-700",
    jefe_asignatura: "border-blue-200 bg-blue-50 text-blue-700",
    profesor: "border-amber-200 bg-amber-50 text-amber-700",
  }
  return colors[rol]
}
