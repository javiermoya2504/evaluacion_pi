"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Award, Download, FileText, Printer, RefreshCw, Send, TrendingUp } from "lucide-react"

const reports = [
  {
    id: "aurum",
    equipo: "Equipo Aurum",
    proyecto: "Sistema de gestion de laboratorios UPQ",
    lider: "Carlos Mendez",
    carrera: "Ingenieria en Software",
    calificacionFinal: 91.4,
    avance: 100,
    estado: "Listo para emitir",
    materias: [
      { materia: "Desarrollo de Software", parcial: "Final", calificacion: 93, peso: 35 },
      { materia: "Base de Datos", parcial: "Final", calificacion: 89, peso: 25 },
      { materia: "Interfaces Web", parcial: "Final", calificacion: 92, peso: 25 },
      { materia: "Gestion de Proyectos", parcial: "Final", calificacion: 90, peso: 15 },
    ],
    criterios: [
      { criterio: "Arquitectura", valor: 92 },
      { criterio: "Codigo", valor: 88 },
      { criterio: "BD", valor: 89 },
      { criterio: "UI/UX", valor: 94 },
      { criterio: "Documentacion", valor: 90 },
    ],
  },
  {
    id: "nexus",
    equipo: "Equipo Nexus",
    proyecto: "App de seguimiento academico",
    lider: "Laura Ramirez",
    carrera: "Ingenieria en Software",
    calificacionFinal: 79.8,
    avance: 82,
    estado: "Pendiente de cierre",
    materias: [
      { materia: "Desarrollo de Software", parcial: "Final", calificacion: 81, peso: 35 },
      { materia: "Base de Datos", parcial: "Final", calificacion: 78, peso: 25 },
      { materia: "Interfaces Web", parcial: "Final", calificacion: 84, peso: 25 },
      { materia: "Gestion de Proyectos", parcial: "Final", calificacion: 73, peso: 15 },
    ],
    criterios: [
      { criterio: "Arquitectura", valor: 76 },
      { criterio: "Codigo", valor: 78 },
      { criterio: "BD", valor: 80 },
      { criterio: "UI/UX", valor: 86 },
      { criterio: "Documentacion", valor: 72 },
    ],
  },
  {
    id: "innova",
    equipo: "Equipo Innova",
    proyecto: "Panel IoT para eficiencia energetica",
    lider: "Roberto Diaz",
    carrera: "Tecnologias de Manufactura",
    calificacionFinal: 94.2,
    avance: 100,
    estado: "Listo para emitir",
    materias: [
      { materia: "Sistemas Embebidos", parcial: "Final", calificacion: 96, peso: 35 },
      { materia: "Base de Datos", parcial: "Final", calificacion: 91, peso: 20 },
      { materia: "Analitica", parcial: "Final", calificacion: 95, peso: 30 },
      { materia: "Gestion de Proyectos", parcial: "Final", calificacion: 93, peso: 15 },
    ],
    criterios: [
      { criterio: "Arquitectura", valor: 95 },
      { criterio: "Codigo", valor: 92 },
      { criterio: "BD", valor: 91 },
      { criterio: "UI/UX", valor: 90 },
      { criterio: "Documentacion", valor: 97 },
    ],
  },
]

export default function ReportesPage() {
  const { user } = useAuth()
  const [teamId, setTeamId] = useState(reports[0].id)
  const selectedReport = useMemo(() => reports.find((report) => report.id === teamId) ?? reports[0], [teamId])
  const weightedRows = selectedReport.materias.map((row) => ({
    ...row,
    ponderado: Number(((row.calificacion * row.peso) / 100).toFixed(2)),
  }))
  const readyReports = reports.filter((report) => report.avance === 100).length

  if (user?.rol !== "coordinadora_pi") {
    return (
      <div className="flex flex-col">
        <DashboardHeader title="Acceso restringido" description="Tu rol no tiene permisos para consultar reportes globales" />
        <div className="p-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="font-semibold text-amber-950">Modulo reservado para Coordinadora PI.</p>
              <p className="mt-2 text-sm text-amber-800">Los reportes finales concentran informacion institucional del proceso PI.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Reporte final por equipo"
        description="Sprint 8: calificacion ponderada total, desglose por materia y descarga del reporte"
      />

      <div className="flex-1 space-y-6 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger className="w-full bg-white lg:w-[360px]">
              <SelectValue placeholder="Seleccionar equipo" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((report) => (
                <SelectItem key={report.id} value={report.id}>{report.equipo} - {report.proyecto}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generar reporte
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Calificacion final" value={selectedReport.calificacionFinal.toFixed(1)} detail="Promedio ponderado" icon={Award} tone="bg-teal-50 text-teal-700" />
          <SummaryCard label="Avance del reporte" value={`${selectedReport.avance}%`} detail={selectedReport.estado} icon={FileText} tone="bg-blue-50 text-blue-700" />
          <SummaryCard label="Reportes listos" value={`${readyReports}/${reports.length}`} detail="Equipos con cierre completo" icon={TrendingUp} tone="bg-emerald-50 text-emerald-700" />
          <SummaryCard label="Notificacion" value="Email" detail="Preparado para Sprint 9" icon={Send} tone="bg-amber-50 text-amber-700" />
        </section>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>{selectedReport.equipo}</CardTitle>
                <CardDescription>{selectedReport.proyecto} · Lider: {selectedReport.lider} · {selectedReport.carrera}</CardDescription>
              </div>
              <Badge className={selectedReport.avance === 100 ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50" : "bg-amber-50 text-amber-700 hover:bg-amber-50"}>
                {selectedReport.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Completitud del reporte final</span>
              <span className="font-semibold text-slate-950">{selectedReport.avance}%</span>
            </div>
            <Progress value={selectedReport.avance} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Desglose por materia</CardTitle>
              <CardDescription>Calificacion, peso y aporte ponderado al resultado final</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Parcial</TableHead>
                    <TableHead>Calificacion</TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead className="text-right">Aporte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weightedRows.map((row) => (
                    <TableRow key={row.materia}>
                      <TableCell className="font-medium">{row.materia}</TableCell>
                      <TableCell>{row.parcial}</TableCell>
                      <TableCell>{row.calificacion}</TableCell>
                      <TableCell>{row.peso}%</TableCell>
                      <TableCell className="text-right font-semibold">{row.ponderado}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Radar por criterio</CardTitle>
              <CardDescription>Vista tipo Sprint 8 para explicar fortalezas del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={selectedReport.criterios}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="criterio" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Resultado" dataKey="valor" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.28} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle>Comparativa de materias</CardTitle>
            <CardDescription>Grafica de barras para validar visualmente el desglose del reporte final</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedReport.materias}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="materia" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calificacion" name="Calificacion" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="peso" name="Peso" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof Award; tone: string }) {
  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
