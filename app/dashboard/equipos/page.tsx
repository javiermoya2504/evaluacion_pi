"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  type LucideIcon,
  Plus,
  Search,
  Users,
} from "lucide-react"

const teams = [
  {
    id: 1,
    nombre: "Equipo Aurum",
    proyecto: "Sistema de gestion de laboratorios UPQ",
    carrera: "Ingenieria en Software",
    semestre: "7mo",
    lider: "Carlos Mendez",
    correo: "carlos.mendez@upq.edu.mx",
    integrantes: ["Maria Lopez", "Juan Perez", "Ana Garcia", "Pedro Sanchez"],
    materias: ["Desarrollo de Software", "Base de Datos", "Interfaces Web"],
    evidencias: 82,
    estado: "activo",
    promedio: 89,
  },
  {
    id: 2,
    nombre: "Equipo Nexus",
    proyecto: "App de seguimiento academico",
    carrera: "Ingenieria en Software",
    semestre: "6to",
    lider: "Laura Ramirez",
    correo: "laura.ramirez@upq.edu.mx",
    integrantes: ["Diego Torres", "Sofia Hernandez", "Miguel Flores"],
    materias: ["Proyecto Integrador", "Calidad de Software"],
    evidencias: 64,
    estado: "riesgo",
    promedio: 78,
  },
  {
    id: 3,
    nombre: "Equipo Innova",
    proyecto: "Panel IoT para eficiencia energetica",
    carrera: "Ingenieria en Tecnologias de Manufactura",
    semestre: "8vo",
    lider: "Roberto Diaz",
    correo: "roberto.diaz@upq.edu.mx",
    integrantes: ["Carmen Ruiz", "Fernando Vega", "Patricia Luna", "Andres Castro"],
    materias: ["Sistemas Embebidos", "Proyecto Integrador", "Analitica"],
    evidencias: 96,
    estado: "validado",
    promedio: 94,
  },
]

const statusConfig = {
  activo: { label: "Activo", className: "bg-blue-50 text-blue-700 border-blue-200", icon: BookOpenCheck },
  riesgo: { label: "Requiere seguimiento", className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle },
  validado: { label: "Validado", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
}

type SummaryMetric = {
  label: string
  value: number
  icon: LucideIcon
  tone: string
}

export default function EquiposPage() {
  const { user } = useAuth()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("todos")

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        const text = `${team.nombre} ${team.proyecto} ${team.lider} ${team.carrera}`.toLowerCase()
        const matchesQuery = text.includes(query.toLowerCase())
        const matchesStatus = status === "todos" || team.estado === status
        return matchesQuery && matchesStatus
      }),
    [query, status]
  )

  if (user?.rol !== "coordinadora_pi") {
    return (
      <div className="flex flex-col">
        <DashboardHeader
          title="Acceso restringido"
          description="Tu rol no tiene permisos para administrar equipos"
        />
        <div className="p-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="font-semibold text-amber-950">Modulo reservado para Coordinadora PI.</p>
              <p className="mt-2 text-sm text-amber-800">
                La gestion de equipos, alumnos y asignaciones corresponde al rol de coordinacion.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Equipos PI"
        description="Panel coordinador PI: lista, estado y evidencias de equipos"
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-4">
          {([
            { label: "Equipos", value: teams.length, icon: Users, tone: "bg-teal-50 text-teal-700" },
            { label: "En seguimiento", value: teams.filter((team) => team.estado === "riesgo").length, icon: AlertTriangle, tone: "bg-amber-50 text-amber-700" },
            { label: "Validados", value: teams.filter((team) => team.estado === "validado").length, icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
            { label: "Promedio general", value: Math.round(teams.reduce((sum, team) => sum + team.promedio, 0) / teams.length), icon: BookOpenCheck, tone: "bg-blue-50 text-blue-700" },
          ] satisfies SummaryMetric[]).map(({ label, value, icon: Icon, tone }) => (
            <Card key={label} className="border-none bg-white shadow-sm shadow-slate-200/70">
              <CardContent className="flex items-start justify-between p-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Lista de equipos registrados</CardTitle>
                <CardDescription>Simula el entregable GET/POST/PUT de equipos mientras el backend queda listo</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Registrar equipo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-9"
                  placeholder="Buscar por equipo, proyecto, lider o carrera"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="riesgo">Requieren seguimiento</SelectItem>
                  <SelectItem value="validado">Validados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {filteredTeams.map((team) => {
                const config = statusConfig[team.estado as keyof typeof statusConfig]
                const StatusIcon = config.icon

                return (
                  <div key={team.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-teal-100 font-semibold text-teal-800">
                            {team.nombre.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-950">{team.nombre}</h3>
                            <Badge className={config.className}>
                              <StatusIcon className="mr-1 h-3.5 w-3.5" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-600">{team.proyecto}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Lider: {team.lider} · {team.correo} · {team.semestre}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {team.materias.map((subject) => (
                              <Badge key={subject} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px]">
                        <div>
                          <p className="text-xs font-medium text-slate-500">Evidencias</p>
                          <div className="mt-2 flex items-center gap-2">
                            <Progress value={team.evidencias} className="h-2" />
                            <span className="text-sm font-semibold">{team.evidencias}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">Integrantes</p>
                          <p className="mt-1 text-xl font-semibold text-slate-950">{team.integrantes.length + 1}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500">Promedio</p>
                          <p className="mt-1 text-xl font-semibold text-slate-950">{team.promedio}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Ver expediente
                      </Button>
                      <Button size="sm">Asignar materia</Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
