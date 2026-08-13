"use client"

import { useCallback, useState } from "react"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { authFetch } from "@/lib/client-api"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import type { DashboardData, DashboardSummary } from "@/lib/types/dashboard"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Gauge,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

type Metric = {
  label: string
  value: string
  detail: string
  icon: typeof ShieldCheck
  tone: string
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon

  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{metric.detail}</p>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.tone}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HeroPanel({
  eyebrow,
  title,
  description,
  action,
  href,
  progress,
}: {
  eyebrow: string
  title: string
  description: string
  action: string
  href: string
  progress: number
}) {
  return (
    <section className="rounded-2xl bg-[#0b2f2f] p-6 text-white shadow-lg shadow-teal-950/10">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <Badge className="border-white/15 bg-white/10 text-teal-50 hover:bg-white/10">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {eyebrow}
          </Badge>
          <div className="space-y-2">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            <p className="max-w-2xl text-sm leading-6 text-teal-50/75">{description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-50/72">Avance del periodo</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
          <Button asChild className="mt-2 bg-white text-[#0b2f2f] hover:bg-teal-50">
            <Link href={href}>
              {action}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function CoordinadoraDashboard({ summary, projects }: { summary: DashboardSummary; projects: DashboardData["proyectos"] }) {
  const metrics: Metric[] = [
    {
      label: "Proyectos PI",
      value: String(summary.proyectos),
      detail: `${summary.proyectosEnDesarrollo} en desarrollo, ${summary.proyectosFinalizados} finalizados`,
      icon: BookOpenCheck,
      tone: "bg-teal-50 text-teal-700",
    },
    {
      label: "Equipos registrados",
      value: String(summary.equipos),
      detail: `${new Set(projects.map((item) => item.carrera)).size} carreras participantes`,
      icon: Users,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Evaluaciones",
      value: String(summary.evaluaciones),
      detail: `${summary.equiposEvaluados} equipos evaluados`,
      icon: ClipboardCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Avance promedio",
      value: `${summary.avancePromedio}%`,
      detail: "calculado desde proyectos",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
    },
  ]

  const stages = projects.slice(0, 6).map((item) => [item.nombre, item.progreso] as const)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Centro de control PI"
        description="Vista ejecutiva del proceso de Proyectos Integradores UPQ"
      />
      <div className="flex-1 space-y-6 p-6">
        <HeroPanel
          eyebrow="Coordinacion academica"
          title="Monitorea el avance completo de equipos, rubricas y resultados en un solo panel."
          description="Esta vista prioriza indicadores globales, alertas de seguimiento y accesos rapidos para tomar decisiones durante el cierre del periodo."
          action="Revisar reportes"
          href="/dashboard/reportes"
          progress={summary.avancePromedio}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Mapa de avance por etapa</CardTitle>
              <CardDescription>Seguimiento operativo del proceso PI actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {stages.map(([stage, value]) => (
                <div key={stage} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stage}</span>
                    <span className="font-semibold text-slate-950">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Acciones prioritarias</CardTitle>
              <CardDescription>Actividades que elevan el control del proceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ["Validar rubricas pendientes", "/dashboard/rubricas", Layers3],
                ["Revisar equipos sin evidencia", "/dashboard/equipos", Users],
                ["Exportar reporte ejecutivo", "/dashboard/reportes", BarChart3],
              ].map(([label, href, Icon]) => (
                <Button key={label as string} asChild variant="outline" className="h-12 w-full justify-between">
                  <Link href={href as string}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label as string}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function JefeAsignaturaDashboard({ summary, projects }: { summary: DashboardSummary; projects: DashboardData["proyectos"] }) {
  const { user } = useAuth()
  const rubricas = projects.slice(0, 6).map((item) => [item.nombre, item.estado, item.progreso] as const)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={`Hola, ${user?.nombre.split(" ")[1] ?? "docente"}`}
        description={`Gestion de rubricas para ${user?.asignatura ?? "asignatura PI"}`}
      />
      <div className="flex-1 space-y-6 p-6">
        <HeroPanel
          eyebrow="Jefatura de asignatura"
          title="Convierte criterios dispersos en rubricas claras, medibles y listas para evaluar."
          description="Tu panel se enfoca en criterios, parciales y consistencia academica para que los profesores evaluen con el mismo estandar."
          action="Editar rubricas"
          href="/dashboard/rubricas"
          progress={summary.avancePromedio}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Rubricas", value: String(summary.rubricas), detail: `${summary.rubricasCompletas} con ponderacion completa`, icon: FileText, tone: "bg-blue-50 text-blue-700" },
            { label: "Criterios definidos", value: String(summary.criterios), detail: "cargados desde Neon", icon: Layers3, tone: "bg-teal-50 text-teal-700" },
            { label: "Proyectos vinculados", value: String(summary.proyectos), detail: `${summary.proyectosEnDesarrollo} en desarrollo`, icon: BookOpenCheck, tone: "bg-amber-50 text-amber-700" },
          ].map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Rubricas por componente</CardTitle>
              <CardDescription>Estado de preparacion para la evaluacion PI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rubricas.map(([name, status, progress]) => (
                <div key={name} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{name}</p>
                      <p className="text-xs text-slate-500">{progress}% de criterios completados</p>
                    </div>
                    <Badge variant="outline">{status}</Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Checklist de calidad</CardTitle>
              <CardDescription>Detalle que hace ver el sistema mas profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Criterios con ponderacion total de 100%",
                "Niveles de desempeno claros",
                "Retroalimentacion sugerida por criterio",
                "Publicacion controlada por parcial",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-teal-700" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProfesorDashboard({ summary, projects }: { summary: DashboardSummary; projects: DashboardData["proyectos"] }) {

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Panel de evaluacion"
        description="Proyectos asignados y rubricas listas para aplicar"
      />
      <div className="flex-1 space-y-6 p-6">
        <HeroPanel
          eyebrow="Profesor evaluador"
          title="Evalua proyectos con contexto, evidencias y rubricas en una experiencia guiada."
          description="Esta vista destaca pendientes reales, tiempo estimado y estado de retroalimentacion para cerrar evaluaciones sin perder trazabilidad."
          action="Comenzar evaluacion"
          href="/dashboard/evaluaciones"
          progress={summary.avancePromedio}
        />

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Equipos disponibles", value: String(summary.equipos), detail: `${summary.equiposEvaluados} evaluados por ti`, icon: Users, tone: "bg-teal-50 text-teal-700" },
            { label: "Evaluaciones", value: String(summary.evaluaciones), detail: "registradas por tu cuenta", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
            { label: "Retroalimentacion", value: String(summary.retroalimentaciones), detail: "comentarios registrados", icon: MessageSquareText, tone: "bg-blue-50 text-blue-700" },
          ].map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle>Cola de evaluacion</CardTitle>
            <CardDescription>Prioridad de proyectos asignados para este periodo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-950">{project.nombre}</p>
                      <Badge variant={project.estado === "finalizado" ? "default" : "outline"}>{project.estado}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{project.carrera}</p>
                    <Progress value={project.progreso} className="mt-2 h-2" />
                  </div>
                </div>
                <Button asChild variant={project.estado === "finalizado" ? "outline" : "default"}>
                  <Link href="/dashboard/evaluaciones">
                    {project.estado === "finalizado" ? "Ver detalle" : "Evaluar"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-teal-700" />
              Cierre de evaluaciones
            </CardTitle>
            <CardDescription>Fecha limite configurada para presentacion final PI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 rounded-xl bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium">
                Completa las evaluaciones antes del viernes de cierre para liberar resultados.
              </p>
              <Badge className="w-fit bg-amber-600 text-white hover:bg-amber-600">Prioridad alta</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AlumnoDashboard() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={`Hola, ${user?.nombre ?? "alumno"}`}
        description="Tu cuenta de alumno ya está autenticada en SIGEP-PI"
      />
      <div className="flex-1 p-6">
        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle>Acceso de alumno activo</CardTitle>
            <CardDescription>
              El registro público crea este rol correctamente. Las funciones específicas de alumno quedan pendientes.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState("")
  const load = useCallback(async () => {
    if (!user) return
    try {
      const response = await authFetch("/api/dashboard/summary", { cache: "no-store" })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || "No se pudieron actualizar las metricas")
      setData(payload)
      setError("")
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron actualizar las metricas")
    }
  }, [user])
  useAutoRefresh(load)

  if (!data) return <div className="p-6 text-sm text-slate-600">{error || "Actualizando metricas..."}</div>

  if (user?.rol === "jefe_asignatura") {
    return <JefeAsignaturaDashboard summary={data.summary} projects={data.proyectos} />
  }

  if (user?.rol === "profesor") {
    return <ProfesorDashboard summary={data.summary} projects={data.proyectos} />
  }

  if (user?.rol === "alumno") {
    return <AlumnoDashboard />
  }

  return <CoordinadoraDashboard summary={data.summary} projects={data.proyectos} />
}
