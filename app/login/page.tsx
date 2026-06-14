"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff, Loader2, AlertCircle, User, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

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

    const success = await login(email, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.")
    }
    setIsSubmitting(false)
  }

  const demoAccounts = [
    {
      role: "Coordinadora de PI",
      email: "coordinadora@utt.edu.mx",
      password: "admin123",
      description: "Acceso completo al sistema",
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    },
    {
      role: "Jefe de Asignatura",
      email: "jefe.programacion@utt.edu.mx",
      password: "jefe123",
      description: "Crear rúbricas por materia",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      role: "Profesor Evaluador",
      email: "profesor@utt.edu.mx",
      password: "prof123",
      description: "Evaluar proyectos finales",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
  ]

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  const handleGoogleLogin = () => {
    setError("")
    signIn("google", { callbackUrl: "/dashboard" }, { prompt: "select_account" })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        {/* Login Card */}
        <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm lg:max-w-md">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">SIGEP-RI</CardTitle>
              <CardDescription className="mt-1">
                Sistema Inteligente para la Gestión y Evaluación de Proyectos Integradores
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo institucional</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@utt.edu.mx"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
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

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs uppercase text-muted-foreground">o</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-sm font-bold text-foreground">
                G
              </span>
              Continuar con Google
            </Button>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Universidad Tecnológica de Tijuana</p>
              <p className="mt-1">Ingeniería en Software e Informática</p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts Card */}
        <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm lg:flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Cuentas de demostración</CardTitle>
            <CardDescription>
              Haz clic en una cuenta para autocompletar las credenciales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="w-full rounded-lg border border-border/50 bg-background/50 p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
                          account.color
                        )}
                      >
                        {account.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{account.description}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 rounded-md bg-muted/50 p-2 font-mono text-xs">
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="text-foreground">{account.email}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Password:</span>{" "}
                    <span className="text-foreground">{account.password}</span>
                  </p>
                </div>
              </button>
            ))}

            <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-400">
                <strong>Nota:</strong> Estas son cuentas de demostración para probar el sistema.
                En producción, las credenciales se validarán contra el sistema institucional.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
