"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, GraduationCap, KeyRound, Loader2, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type RegisterRole = "coordinadora_pi" | "jefe_asignatura" | "profesor"
type RegisterErrors = Partial<Record<"nombre" | "email" | "password" | "confirmPassword" | "rol" | "general", string>>

export default function RegisterPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rol, setRol] = useState<RegisterRole>("profesor")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const validationErrors = validateForm({ nombre, email, password, confirmPassword, rol })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
        }),
      })

      const data = (await response.json()) as {
        message?: string
        errors?: Partial<Record<"nombre" | "email" | "password", string[]>>
      }

      if (response.ok) {
        router.push("/login")
        return
      }

      if (response.status === 409) {
        setErrors({ email: data.message ?? "El correo electrónico ya está registrado" })
        return
      }

      if (data.errors) {
        setErrors({
          nombre: data.errors.nombre?.[0],
          email: data.errors.email?.[0],
          password: data.errors.password?.[0],
        })
        return
      }

      setErrors({ general: data.message ?? "No se pudo completar el registro" })
    } catch {
      setErrors({ general: "No se pudo conectar con el servidor" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main
      className="min-h-screen bg-[#f5f7f4] text-slate-950"
      style={
        {
          "--register-primary": "#0b8f87",
          "--register-primary-dark": "#0b2f2f",
        } as CSSProperties
      }
    >
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-[var(--register-primary-dark)] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.24),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--register-primary-dark)] shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">UPQ</p>
              <p className="text-sm text-teal-50/80">Universidad Politécnica de Querétaro</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">Registro institucional</p>
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
              Crea tu acceso a SIGEP-PI con el perfil adecuado.
            </h1>
            <p className="max-w-lg text-base leading-7 text-teal-50/75">
              El rol seleccionado determina los módulos y acciones disponibles dentro del sistema.
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Flujo de acceso</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {["Registro", "Validación", "Login", "Dashboard"].map((step, index) => (
                <div key={step} className="rounded-lg bg-white/10 p-3">
                  <div className="mb-3 h-1.5 rounded-full bg-white" style={{ opacity: 1 - index * 0.16 }} />
                  <p className="text-xs font-medium text-teal-50/86">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-[520px] space-y-6">
            <Button asChild variant="ghost" className="w-fit px-0 text-slate-600 hover:bg-transparent hover:text-slate-950">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al login
              </Link>
            </Button>

            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--register-primary)]">Acceso institucional</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Regístrate</h2>
              <p className="text-sm leading-6 text-slate-600">
                Completa tus datos y selecciona el rol que desempeñarás.
              </p>
            </div>

            <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errors.general && (
                    <ErrorMessage message={errors.general} />
                  )}

                  <FieldError id="nombre" label="Nombre completo" error={errors.nombre}>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:ring-[var(--register-primary)]"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </FieldError>

                  <FieldError id="email" label="Correo electrónico" error={errors.email}>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:ring-[var(--register-primary)]"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </FieldError>

                  <FieldError id="rol" label="Tipo de rol" error={errors.rol}>
                    <select id="rol" value={rol} onChange={(event) => setRol(event.target.value as RegisterRole)} className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--register-primary)]" disabled={isSubmitting} required>
                      <option value="coordinadora_pi">Coordinadora PI</option>
                      <option value="jefe_asignatura">Jefe de asignatura</option>
                      <option value="profesor">Profesor evaluador</option>
                    </select>
                  </FieldError>

                  <PasswordField
                    id="password"
                    label="Contraseña"
                    value={password}
                    showPassword={showPassword}
                    error={errors.password}
                    disabled={isSubmitting}
                    onChange={setPassword}
                    onToggleShow={() => setShowPassword((value) => !value)}
                  />

                  <PasswordField
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    value={confirmPassword}
                    showPassword={showConfirmPassword}
                    error={errors.confirmPassword}
                    disabled={isSubmitting}
                    onChange={setConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword((value) => !value)}
                  />

                  <Button
                    type="submit"
                    className="h-11 w-full bg-[var(--register-primary)] font-semibold text-white hover:bg-[var(--register-primary-dark)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Crear cuenta
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="font-semibold text-[var(--register-primary)] hover:underline">
                      Inicia sesión
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}

function FieldError({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  showPassword,
  error,
  disabled,
  onChange,
  onToggleShow,
}: {
  id: string
  label: string
  value: string
  showPassword: boolean
  error?: string
  disabled: boolean
  onChange: (value: string) => void
  onToggleShow: () => void
}) {
  return (
    <FieldError id={id} label={label} error={error}>
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-sm focus-visible:ring-[var(--register-primary)]"
          disabled={disabled}
          required
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </FieldError>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function validateForm(input: {
  nombre: string
  email: string
  password: string
  confirmPassword: string
  rol: RegisterRole
}): RegisterErrors {
  const errors: RegisterErrors = {}
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (input.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres"
  }

  if (!emailPattern.test(input.email.trim())) {
    errors.email = "Correo electrónico inválido"
  }

  if (input.password.length < 8) {
    errors.password = "La contraseña debe tener al menos 8 caracteres"
  }

  if (input.password !== input.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden"
  }

  return errors
}
