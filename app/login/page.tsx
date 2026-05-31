"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, User, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    // Mapeo interno del correo del jefe para que funcione con el contexto de prueba sin cambiarlo
    const targetEmail = email.toLowerCase() === "jefe@utt.edu.mx" ? "jefe.programacion@utt.edu.mx" : email

    const success = await login(targetEmail, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.")
    }
    setIsSubmitting(false)
  }

  const handleDemoSelect = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setShowPassword(false) // Asegurar que la contraseña permanezca oculta en el input
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/50 px-4 py-12 dark:bg-slate-950/50">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Header institucional */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white shadow-sm dark:bg-blue-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              SIGEP-RI
            </h1>
            <p className="text-xs font-semibold text-blue-900/80 dark:text-blue-400 uppercase tracking-wider">
              Universidad Tecnológica de Tijuana
            </p>
          </div>
        </div>

        {/* Tarjeta de Login */}
        <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="text-lg font-semibold text-center text-slate-900 dark:text-slate-50">
              Acceso Institucional
            </CardTitle>
            <CardDescription className="text-xs text-center text-slate-500 dark:text-slate-400">
              Portal de Gestión y Evaluación de Proyectos Integradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <span className="leading-normal">{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-700 dark:text-slate-350">
                  Correo institucional
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@utt.edu.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-sm border-slate-200 focus-visible:ring-blue-900 dark:border-slate-800 dark:focus-visible:ring-blue-600"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-slate-700 dark:text-slate-350">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-9 text-sm border-slate-200 focus-visible:ring-blue-900 dark:border-slate-800 dark:focus-visible:ring-blue-600"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-855 text-white dark:bg-blue-600 dark:hover:bg-blue-700 mt-2 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </form>

            {/* Acceso de prueba siempre visible */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-xs font-semibold text-slate-750 dark:text-slate-300 text-left">
                Acceso de prueba
              </p>
              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Coordinadora PI */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Coordinadora PI</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-[9px] px-2 text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-800"
                      onClick={() => handleDemoSelect("coordinadora@utt.edu.mx", "admin123")}
                    >
                      Cargar
                    </Button>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                    <div>Email: <span className="font-mono text-slate-700 dark:text-slate-300">coordinadora@utt.edu.mx</span></div>
                    <div>Contraseña: <span className="font-mono text-slate-700 dark:text-slate-300">admin123</span></div>
                  </div>
                </div>

                {/* Jefe de Asignatura */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Jefe de Asignatura</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-[9px] px-2 text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-800"
                      onClick={() => handleDemoSelect("jefe@utt.edu.mx", "jefe123")}
                    >
                      Cargar
                    </Button>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                    <div>Email: <span className="font-mono text-slate-700 dark:text-slate-300">jefe@utt.edu.mx</span></div>
                    <div>Contraseña: <span className="font-mono text-slate-700 dark:text-slate-300">jefe123</span></div>
                  </div>
                </div>

                {/* Profesor */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Profesor</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-6 text-[9px] px-2 text-slate-600 border-slate-200 hover:bg-slate-50 dark:text-slate-350 dark:border-slate-800 dark:hover:bg-slate-800"
                      onClick={() => handleDemoSelect("profesor@utt.edu.mx", "prof123")}
                    >
                      Cargar
                    </Button>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                    <div>Email: <span className="font-mono text-slate-700 dark:text-slate-300">profesor@utt.edu.mx</span></div>
                    <div>Contraseña: <span className="font-mono text-slate-700 dark:text-slate-300">prof123</span></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer institucional */}
        <div className="text-center space-y-1 py-2">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Ingeniería en Software e Informática
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} UTT. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
