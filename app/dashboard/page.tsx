"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsGrid } from "@/components/dashboard/stats-cards"
import { EvaluacionesChart, CalificacionesChart } from "@/components/dashboard/charts"
import { ProyectosRecientes, ActividadReciente } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  BookOpen,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

// Dashboard para Coordinadora de PI - Vista completa
function CoordinadoraDashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Dashboard" 
        description="Vista general del sistema de proyectos integradores"
      />
      
      <div className="flex-1 space-y-6 p-6">
        <StatsGrid />

        <div className="grid gap-6 lg:grid-cols-2">
          <EvaluacionesChart />
          <CalificacionesChart />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ProyectosRecientes />
          <ActividadReciente />
        </div>
      </div>
    </div>
  )
}

// Dashboard para Jefe de Academia - Enfocado en sus rúbricas y materias
function JefeAcademiaDashboard() {
  const { user } = useAuth()
  
  const misRubricas = [
    { 
      id: 1, 
      nombre: "Rúbrica Parcial 1 - Programación Web", 
      parcial: "1er Parcial",
      estado: "activa",
      criterios: 5,
      fechaCreacion: "2024-01-10"
    },
    { 
      id: 2, 
      nombre: "Rúbrica Parcial 2 - Programación Web", 
      parcial: "2do Parcial",
      estado: "borrador",
      criterios: 4,
      fechaCreacion: "2024-01-15"
    },
    { 
      id: 3, 
      nombre: "Rúbrica Parcial 3 - Programación Web", 
      parcial: "3er Parcial",
      estado: "pendiente",
      criterios: 0,
      fechaCreacion: null
    },
  ]

  const proximasActividades = [
    { id: 1, titulo: "Entrega de rúbrica Parcial 2", fecha: "2024-01-20", tipo: "entrega" },
    { id: 2, titulo: "Revisión con Coordinadora PI", fecha: "2024-01-22", tipo: "reunion" },
    { id: 3, titulo: "Evaluación Parcial 1", fecha: "2024-01-25", tipo: "evaluacion" },
  ]

  const estadoConfig = {
    activa: { label: "Activa", className: "bg-emerald-500/10 text-emerald-500" },
    borrador: { label: "Borrador", className: "bg-amber-500/10 text-amber-500" },
    pendiente: { label: "Pendiente", className: "bg-muted text-muted-foreground" },
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title={`Bienvenido, ${user?.name?.split(" ")[0]}`}
        description={`Panel de gestión de rúbricas - ${user?.materia || "Programación Web"}`}
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats del Jefe de Academia */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mis Rúbricas
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Para este cuatrimestre</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rúbricas Activas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Listas para evaluar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Borrador
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Por completar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Por crear</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mis Rúbricas */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mis Rúbricas</CardTitle>
                <CardDescription>Rúbricas de tu materia por parcial</CardDescription>
              </div>
              <Button asChild>
                <Link href="/dashboard/rubricas">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {misRubricas.map((rubrica) => {
                const config = estadoConfig[rubrica.estado as keyof typeof estadoConfig]
                return (
                  <div key={rubrica.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{rubrica.nombre}</p>
                          <Badge className={config.className}>{config.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rubrica.criterios > 0 ? `${rubrica.criterios} criterios` : "Sin criterios aún"}
                          {rubrica.fechaCreacion && ` • Creada: ${rubrica.fechaCreacion}`}
                        </p>
                      </div>
                    </div>
                    <Button variant={rubrica.estado === "pendiente" ? "default" : "outline"} size="sm" asChild>
                      <Link href="/dashboard/rubricas">
                        {rubrica.estado === "pendiente" ? "Crear" : "Editar"}
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Próximas Actividades */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Actividades</CardTitle>
              <CardDescription>Fechas importantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {proximasActividades.map((actividad) => (
                <div key={actividad.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full ${
                    actividad.tipo === "entrega" ? "bg-amber-500" :
                    actividad.tipo === "reunion" ? "bg-primary" : "bg-emerald-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{actividad.titulo}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {actividad.fecha}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Progreso del cuatrimestre */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso del Cuatrimestre</CardTitle>
            <CardDescription>Estado de tus rúbricas para el PI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Rúbricas completadas</span>
                  <span className="font-medium">1 de 3</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
              <p className="text-sm text-muted-foreground">
                Recuerda completar todas las rúbricas antes de la fecha de evaluación final del PI.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Vista para Profesor Evaluador - Solo evaluación final
function ProfesorEvaluadorDashboard() {
  const { user } = useAuth()
  
  const equiposAsignados = [
    { 
      id: 1, 
      nombre: "Equipo Alpha", 
      proyecto: "Sistema IoT para Agricultura",
      integrantes: 5,
      estado: "pendiente",
      fechaLimite: "2024-01-30"
    },
    { 
      id: 2, 
      nombre: "Equipo Beta", 
      proyecto: "App de Gestión Escolar",
      integrantes: 4,
      estado: "pendiente",
      fechaLimite: "2024-01-30"
    },
    { 
      id: 3, 
      nombre: "Equipo Gamma", 
      proyecto: "Plataforma E-learning",
      integrantes: 5,
      estado: "evaluado",
      calificacion: 92,
      fechaLimite: "2024-01-30"
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title={`Bienvenido, ${user?.name?.split(" ")[0]}`}
        description="Panel de evaluación final de Proyectos Integradores"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats simples */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos Asignados
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equiposAsignados.length}</div>
              <p className="text-xs text-muted-foreground">Para evaluar este periodo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposAsignados.filter(e => e.estado === "pendiente").length}
              </div>
              <p className="text-xs text-muted-foreground">Por evaluar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evaluados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposAsignados.filter(e => e.estado === "evaluado").length}
              </div>
              <p className="text-xs text-muted-foreground">Completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerta de fecha límite */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Fecha límite de evaluación</p>
              <p className="text-sm text-muted-foreground">
                Tienes hasta el 30 de enero de 2024 para completar todas las evaluaciones
              </p>
            </div>
            <Badge variant="outline" className="border-amber-500 text-amber-500">
              17 días restantes
            </Badge>
          </CardContent>
        </Card>

        {/* Lista de equipos a evaluar */}
        <Card>
          <CardHeader>
            <CardTitle>Equipos a Evaluar</CardTitle>
            <CardDescription>
              Haz clic en &quot;Evaluar&quot; para aplicar la rúbrica global del PI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {equiposAsignados.map((equipo) => (
              <div 
                key={equipo.id} 
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    equipo.estado === "evaluado" ? "bg-emerald-500/10" : "bg-primary/10"
                  }`}>
                    <Users className={`h-6 w-6 ${
                      equipo.estado === "evaluado" ? "text-emerald-500" : "text-primary"
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{equipo.nombre}</p>
                      {equipo.estado === "evaluado" && (
                        <Badge className="bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Evaluado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{equipo.proyecto}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {equipo.integrantes} integrantes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {equipo.estado === "evaluado" && equipo.calificacion && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-500">{equipo.calificacion}</p>
                      <p className="text-xs text-muted-foreground">Calificación</p>
                    </div>
                  )}
                  <Button 
                    variant={equipo.estado === "evaluado" ? "outline" : "default"}
                    asChild
                  >
                    <Link href="/dashboard/evaluaciones">
                      {equipo.estado === "evaluado" ? "Ver Evaluación" : "Evaluar"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Información de la rúbrica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rúbrica Global del PI
            </CardTitle>
            <CardDescription>
              Criterios que evaluarás en cada proyecto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Desarrollo Técnico</p>
                <p className="text-2xl font-bold text-primary">40%</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Funcionalidad</p>
                <p className="text-2xl font-bold text-primary">25%</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Documentación</p>
                <p className="text-2xl font-bold text-primary">20%</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Trabajo en Equipo</p>
                <p className="text-2xl font-bold text-primary">15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  // Renderizar dashboard según el rol
  if (user?.role === "jefe_academia") {
    return <JefeAcademiaDashboard />
  }

  if (user?.role === "profesor") {
    return <ProfesorEvaluadorDashboard />
  }

  // Default: Coordinadora de PI
  return <CoordinadoraDashboard />
}
