"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { 
  Download,
  FileText,
  Mail,
  Printer,
  TrendingUp,
  Users,
  Award,
  Calendar
} from "lucide-react"

const rendimientoData = [
  { parcial: "1er Parcial", ISC: 82, ITI: 78 },
  { parcial: "2do Parcial", ISC: 85, ITI: 82 },
  { parcial: "3er Parcial", ISC: 88, ITI: 85 },
  { parcial: "Final", ISC: 91, ITI: 88 },
]

const tendenciaData = [
  { semestre: "2023-1", promedio: 78, equipos: 35 },
  { semestre: "2023-2", promedio: 82, equipos: 40 },
  { semestre: "2024-1", promedio: 85, equipos: 48 },
]

const topEquipos = [
  { posicion: 1, equipo: "Equipo Gamma", proyecto: "Plataforma E-learning", carrera: "ISC", calificacion: 95.2 },
  { posicion: 2, equipo: "Equipo Beta", proyecto: "App de Gestión Escolar", carrera: "ITI", calificacion: 92.0 },
  { posicion: 3, equipo: "Equipo Alpha", proyecto: "Sistema IoT para Agricultura", carrera: "ISC", calificacion: 87.5 },
  { posicion: 4, equipo: "Equipo Epsilon", proyecto: "Sistema de Facturación", carrera: "ITI", calificacion: 85.3 },
  { posicion: 5, equipo: "Equipo Delta", proyecto: "Sistema de Inventarios", carrera: "ITI", calificacion: 78.3 },
]

const reportesPendientes = [
  { 
    id: 1, 
    tipo: "Calificaciones Finales", 
    destinatarios: 48, 
    estado: "listo",
    fecha: "2024-01-30"
  },
  { 
    id: 2, 
    tipo: "Retroalimentación 2do Parcial", 
    destinatarios: 45, 
    estado: "pendiente",
    fecha: "2024-01-25"
  },
  { 
    id: 3, 
    tipo: "Reporte Semestral", 
    destinatarios: 12, 
    estado: "listo",
    fecha: "2024-01-28"
  },
]

export default function ReportesPage() {
  const [periodo, setPeriodo] = useState("2024-1")

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Reportes y Estadísticas" 
        description="Genera reportes y visualiza el rendimiento de los proyectos integradores"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[200px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-1">Enero - Junio 2024</SelectItem>
              <SelectItem value="2023-2">Agosto - Diciembre 2023</SelectItem>
              <SelectItem value="2023-1">Enero - Junio 2023</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button className="gap-2">
              <Mail className="h-4 w-4" />
              Enviar Reportes
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio General
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85.7</div>
              <p className="text-xs text-emerald-500">+3.2% vs semestre anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos Evaluados
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">De 52 registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Aprobación
              </CardTitle>
              <Award className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Equipos aprobados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reportes Enviados
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Este semestre</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Carrera</CardTitle>
              <CardDescription>Comparativa de promedios ISC vs ITI por parcial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rendimientoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="parcial" 
                      stroke="var(--muted-foreground)" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={12}
                      tickLine={false}
                      domain={[60, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="ISC" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ITI" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia Histórica</CardTitle>
              <CardDescription>Evolución del promedio general por semestre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tendenciaData}>
                    <defs>
                      <linearGradient id="colorPromedio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="semestre" 
                      stroke="var(--muted-foreground)" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)" 
                      fontSize={12}
                      tickLine={false}
                      domain={[70, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="promedio"
                      stroke="var(--chart-1)"
                      fill="url(#colorPromedio)"
                      strokeWidth={2}
                      name="Promedio"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Top 5 Equipos
              </CardTitle>
              <CardDescription>Mejores calificaciones del semestre</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead className="text-right">Calificación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topEquipos.map((equipo) => (
                    <TableRow key={equipo.posicion}>
                      <TableCell>
                        <Badge 
                          variant={equipo.posicion <= 3 ? "default" : "secondary"}
                          className={equipo.posicion === 1 ? "bg-amber-500" : equipo.posicion === 2 ? "bg-gray-400" : equipo.posicion === 3 ? "bg-amber-700" : ""}
                        >
                          {equipo.posicion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{equipo.equipo}</p>
                          <p className="text-xs text-muted-foreground">{equipo.proyecto}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{equipo.carrera}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {equipo.calificacion}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Reportes Pendientes de Envío
              </CardTitle>
              <CardDescription>Notificaciones programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportesPendientes.map((reporte) => (
                  <div 
                    key={reporte.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reporte.tipo}</p>
                        <p className="text-xs text-muted-foreground">
                          {reporte.destinatarios} destinatarios • {reporte.fecha}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={reporte.estado === "listo" ? "default" : "secondary"}
                      disabled={reporte.estado === "pendiente"}
                    >
                      {reporte.estado === "listo" ? "Enviar" : "Pendiente"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
