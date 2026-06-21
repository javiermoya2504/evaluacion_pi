"use client"

import { useMemo, useState, type CSSProperties } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  BookCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Layers3,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

type AccessProfile = {
  role: UserRole
  title: string
  subtitle: string
  email: string
  password: string
  accent: string
  theme: {
    primary: string
    primaryDark: string
    soft: string
    border: string
    text: string
    panel: string
    glow: string
  }
  icon: typeof ShieldCheck
  permissions: string[]
}

const accessProfiles: AccessProfile[] = [
  {
    role: "coordinadora_pi",
    title: "Coordinadora PI",
    subtitle: "Control general del proceso",
    email: "coordinadora@upq.mx",
    password: "admin123",
    accent: "from-teal-500 to-cyan-500",
    theme: {
      primary: "#0b8f87",
      primaryDark: "#0b2f2f",
      soft: "#ecfdf7",
      border: "#5eead4",
      text: "#0f766e",
      panel: "#0b2f2f",
      glow: "rgba(45, 212, 191, 0.24)",
    },
    icon: ShieldCheck,
    permissions: ["Seguimiento global", "Reportes ejecutivos", "Gestion de equipos"],
  },
  {
    role: "jefe_asignatura",
    title: "Jefe de asignatura",
    subtitle: "Rubricas y criterios por materia",
    email: "jefe@upq.mx",
    password: "jefe123",
    accent: "from-blue-500 to-indigo-500",
    theme: {
      primary: "#3b63ff",
      primaryDark: "#18235f",
      soft: "#eef3ff",
      border: "#93c5fd",
      text: "#3150c8",
      panel: "#111a4f",
      glow: "rgba(59, 99, 255, 0.24)",
    },
    icon: Layers3,
    permissions: ["Diseno de rubricas", "Revision de proyectos", "Avance por parcial"],
  },
  {
    role: "profesor",
    title: "Profesor evaluador",
    subtitle: "Evaluacion de proyectos asignados",
    email: "profesor@upq.mx",
    password: "prof123",
    accent: "from-amber-500 to-orange-500",
    theme: {
      primary: "#f97316",
      primaryDark: "#7c2d12",
      soft: "#fff7ed",
      border: "#fdba74",
      text: "#c2410c",
      panel: "#431407",
      glow: "rgba(249, 115, 22, 0.24)",
    },
    icon: BookCheck,
    permissions: ["Evaluaciones pendientes", "Calificacion por rubrica", "Retroalimentacion"],
  },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("coordinadora_pi")
  const [email, setEmail] = useState("coordinadora@upq.mx")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const selectedProfile = useMemo(
    () => accessProfiles.find((profile) => profile.role === selectedRole) ?? accessProfiles[0],
    [selectedRole]
  )

  const handleProfileSelect = (profile: AccessProfile) => {
    setSelectedRole(profile.role)
    setEmail(profile.email)
    setPassword(profile.password)
    setShowPassword(false)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const success = await login(email, password)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("No pudimos validar el acceso. Revisa el correo institucional y la contrasena.")
    }

    setIsSubmitting(false)
  }

  return (
    <main
      className="min-h-screen bg-[#f5f7f4] text-slate-950 transition-colors duration-300"
      style={{
        "--role-primary": selectedProfile.theme.primary,
        "--role-primary-dark": selectedProfile.theme.primaryDark,
        "--role-soft": selectedProfile.theme.soft,
        "--role-border": selectedProfile.theme.border,
        "--role-text": selectedProfile.theme.text,
        "--role-panel": selectedProfile.theme.panel,
        "--role-glow": selectedProfile.theme.glow,
      } as CSSProperties}
    >
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-[var(--role-panel)] px-12 py-10 text-white transition-colors duration-300 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--role-glow),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--role-primary-dark)] shadow-lg">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white">UPQ</p>
              <p className="text-sm text-teal-50/80">Universidad Politecnica de Queretaro</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-8">
            <Badge className="border-white/15 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {selectedProfile.title}
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
                Evaluacion inteligente de proyectos integradores.
              </h1>
              <p className="max-w-lg text-base leading-7 text-teal-50/78">
                Centraliza rubricas, equipos, evidencias y resultados para que cada rol trabaje
                solo con la informacion que necesita.
              </p>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3">
              {[
                ["24", "Proyectos activos"],
                ["8", "Rubricas vigentes"],
                ["91%", "Avance evaluado"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs font-medium text-teal-50/72">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/12 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Flujo del proceso PI</p>
                <p className="text-xs text-teal-50/70">Planeacion, evaluacion y cierre academico.</p>
              </div>
              <BarChart3 className="h-5 w-5 text-teal-200" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["Registro", "Rubricas", "Evaluacion", "Reportes"].map((step, index) => (
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
            <div className="space-y-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--role-primary-dark)] text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--role-text)]">UPQ</p>
                <h1 className="text-2xl font-semibold tracking-tight">SIGEP-PI</h1>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--role-text)]">Acceso institucional</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Inicia sesion</h2>
              <p className="text-sm leading-6 text-slate-600">
                Selecciona un perfil de prueba para presentar el sistema por rol sin exponer credenciales.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {accessProfiles.map((profile) => {
                const Icon = profile.icon
                const isSelected = selectedRole === profile.role

                return (
                  <button
                    key={profile.role}
                    type="button"
                    onClick={() => handleProfileSelect(profile)}
                    className={cn(
                      "rounded-xl border bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                      isSelected ? "border-[var(--role-primary)] ring-2 ring-[var(--role-primary)]/15" : "border-slate-200"
                    )}
                  >
                    <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", profile.accent)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{profile.title}</p>
                    <p className="mt-1 text-xs leading-4 text-slate-500">{profile.subtitle}</p>
                  </button>
                )
              })}
            </div>

            <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/60">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="rounded-xl border border-[var(--role-border)] bg-[var(--role-soft)] p-4 transition-colors duration-300">
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", selectedProfile.accent)}>
                        <selectedProfile.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{selectedProfile.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">
                          {selectedProfile.permissions.join(" · ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo institucional</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@upq.mx"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:ring-[var(--role-primary)]"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Contrasena</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Contrasena institucional"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 border-slate-200 bg-slate-50 pl-10 pr-10 text-sm focus-visible:ring-[var(--role-primary)]"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                        aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-11 w-full bg-[var(--role-primary)] font-semibold text-white hover:bg-[var(--role-primary-dark)]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Validando acceso...
                      </>
                    ) : (
                      <>
                        Entrar al panel
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-3 rounded-xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-600 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--role-text)]" />
                Permisos visibles por rol
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[var(--role-text)]" />
                Datos preparados para demo
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
