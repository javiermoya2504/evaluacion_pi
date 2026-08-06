"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Clock3, Eye, MessageSquareText, TrendingUp } from "lucide-react"

const teams = [
  {
    id: "aurum",
    nombre: "Equipo Aurum",
    proyecto: "Sistema de gestion de laboratorios UPQ",
    lider: "Carlos Mendez",
    avance: 82,
    evaluaciones: [
      { fecha: "2026-06-17", parcial: "Parcial 1", profesor: "Ing. Ana Sofia", calificacion: 84, estado: "Completada" },
      { fecha: "2026-06-24", parcial: "Parcial 2", profesor: "Ing. Ana Sofia", calificacion: 88, estado: "Completada" },
      { fecha: "2026-07-01", parcial: "Final PI", profesor: "Ing. Ana Sofia", calificacion: 91, estado: "En revision" },
    ],
    criterios: [
      { criterio: "Arquitectura", anterior: 12, actual: 14, maximo: 15 },
      { criterio: "Calidad de codigo", anterior: 11, actual: 13, maximo: 15 },
      { criterio: "Base de datos", anterior: 8, actual: 9, maximo: 10 },
      { criterio: "Presentacion", anterior: 7, actual: 9, maximo: 10 },
    ],
    retro: {
      fortalezas: "El equipo mejoro la estructura del proyecto, la organizacion de componentes y la evidencia tecnica.",
      mejoras: "Hace falta cerrar detalles de pruebas automatizadas y documentar mejor los criterios de despliegue.",
      recomendaciones: "Preparar una demo guiada por caso de uso y anexar capturas de validacion para la revision final.",
    },
  },
  {
    id: "nexus",
    nombre: "Equipo Nexus",
    proyecto: "App de seguimiento academico",
    lider: "Laura Ramirez",
    avance: 64,
    evaluaciones: [
      { fecha: "2026-06-18", parcial: "Parcial 1", profesor: "Ing. Ana Sofia", calificacion: 76, estado: "Completada" },
      { fecha: "2026-06-25", parcial: "Parcial 2", profesor: "Ing. Ana Sofia", calificacion: 79, estado: "Completada" },
      { fecha: "2026-07-02", parcial: "Final PI", profesor: "Ing. Ana Sofia", calificacion: 0, estado: "Pendiente" },
    ],
    criterios: [
      { criterio: "Arquitectura", anterior: 10, actual: 11, maximo: 15 },
      { criterio: "Calidad de codigo", anterior: 9, actual: 10, maximo: 15 },
      { criterio: "Base de datos", anterior: 7, actual: 8, maximo: 10 },
      { criterio: "Presentacion", anterior: 6, actual: 7, maximo: 10 },
    ],
    retro: {
      fortalezas: "La idea del producto es clara y el equipo tiene buen avance visual.",
      mejoras: "Necesita cerrar flujo de autenticacion y mejorar consistencia de datos entre pantallas.",
      recomendaciones: "Priorizar bugs bloqueantes antes de agregar nuevas funciones y dividir pendientes por responsable.",
    },
  },
]

export default function RetroalimentacionPage() {
  const { user } = useAuth()
  const [teamId, setTeamId] = useState(teams[0].id)
  const selectedTeam = useMemo(() => teams.find((team) => team.id === teamId) ?? teams[0], [teamId])
  const latest = selectedTeam.evaluaciones[selectedTeam.evaluaciones.length - 1]

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Retroalimentacion por equipo"
        description="Sprint 6: timeline de evaluaciones, comparativa por criterio y vista read-only para seguimiento"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Vista de seguimiento academico</h2>
            <p className="mt-1 text-sm text-slate-500">
              {user?.rol === "profesor"
                ? "Consulta retroalimentacion y avance sin modificar registros ya enviados."
                : "Supervisa la retroalimentacion enviada por profesores y el avance por equipo."}
            </p>
          </div>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger className="w-full bg-white lg:w-[300px]">
              <SelectValue placeholder="Selecciona equipo" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500">Equipo</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{selectedTeam.nombre}</p>
              <p className="mt-1 text-xs text-slate-500">Lider: {selectedTeam.lider}</p>
            </CardContent>
          </Card>
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500">Avance por criterios</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{selectedTeam.avance}%</p>
              <Progress value={selectedTeam.avance} className="mt-3 h-2" />
            </CardContent>
          </Card>
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500">Ultima revision</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{latest.parcial}</p>
              <Badge className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-50">{latest.estado}</Badge>
            </CardContent>
          </Card>
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-500">Modo</p>
              <div className="mt-2 flex items-center gap-2 text-emerald-700">
                <Eye className="h-5 w-5" />
                <span className="text-xl font-semibold">Read-only</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">Sin edicion de calificaciones enviadas</p>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-teal-700" />
                Timeline de evaluaciones
              </CardTitle>
              <CardDescription>Historial de revisiones guardadas por equipo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTeam.evaluaciones.map((item, index) => (
                <div key={`${item.parcial}-${item.fecha}`} className="grid grid-cols-[auto_1fr] gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      {item.estado === "Completada" ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                    </div>
                    {index < selectedTeam.evaluaciones.length - 1 && <div className="h-full w-px bg-slate-200" />}
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{item.parcial}</p>
                        <p className="text-xs text-slate-500">{item.fecha} · {item.profesor}</p>
                      </div>
                      <Badge variant={item.estado === "Completada" ? "default" : "outline"}>{item.estado}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.calificacion ? `Calificacion registrada: ${item.calificacion}` : "Pendiente de captura final"}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-700" />
                Comparativa por criterio
              </CardTitle>
              <CardDescription>Mini tabla para ver progreso entre revisiones</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criterio</TableHead>
                    <TableHead>Anterior</TableHead>
                    <TableHead>Actual</TableHead>
                    <TableHead>Avance</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTeam.criterios.map((criterion) => {
                    const progress = Math.round((criterion.actual / criterion.maximo) * 100)
                    return (
                      <TableRow key={criterion.criterio}>
                        <TableCell className="font-medium">{criterion.criterio}</TableCell>
                        <TableCell>{criterion.anterior}/{criterion.maximo}</TableCell>
                        <TableCell>{criterion.actual}/{criterion.maximo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress value={progress} className="h-2 w-28" />
                            <span className="text-xs font-semibold text-slate-600">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={criterion.actual > criterion.anterior ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-amber-50 text-amber-700 hover:bg-amber-50"}>
                            {criterion.actual > criterion.anterior ? "Mejora" : "Seguimiento"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-teal-700" />
              Retroalimentacion registrada
            </CardTitle>
            <CardDescription>Vista consultiva para alumnos, profesor y coordinacion</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              ["Fortalezas", selectedTeam.retro.fortalezas],
              ["Areas de mejora", selectedTeam.retro.mejoras],
              ["Recomendaciones", selectedTeam.retro.recomendaciones],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
