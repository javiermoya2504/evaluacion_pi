"use client"

import { useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarClock, Download, Eye, Filter, History, Search, ShieldCheck } from "lucide-react"

const auditRows = [
  { id: "AUD-1024", fecha: "2026-07-04 10:42", actor: "Ing. Ana Sofia", rol: "Profesor", accion: "Actualizo evaluacion", materia: "Proyecto Integrador", parcial: "Final", equipo: "Equipo Aurum", cambio: "Puntaje Arquitectura 13 -> 14", estado: "Validado" },
  { id: "AUD-1023", fecha: "2026-07-04 09:18", actor: "Dra. Laura Mendoza", rol: "Coordinadora", accion: "Exporto CSV", materia: "Todas", parcial: "Final", equipo: "Todos", cambio: "Reporte de cierre etapa 2", estado: "Completado" },
  { id: "AUD-1022", fecha: "2026-07-03 16:05", actor: "Mtro. Daniel Hernandez", rol: "Jefe asignatura", accion: "Publico rubrica", materia: "Desarrollo de Software", parcial: "Final", equipo: "Todos", cambio: "Version rubrica v2.0", estado: "Completado" },
  { id: "AUD-1021", fecha: "2026-07-03 13:20", actor: "Ing. Ana Sofia", rol: "Profesor", accion: "Agrego retroalimentacion", materia: "Proyecto Integrador", parcial: "Final", equipo: "Equipo Nexus", cambio: "Fortalezas y areas de mejora", estado: "Pendiente" },
  { id: "AUD-1020", fecha: "2026-07-02 11:12", actor: "Dra. Laura Mendoza", rol: "Coordinadora", accion: "Asigno equipo", materia: "Base de Datos", parcial: "Parcial 2", equipo: "Equipo Innova", cambio: "Equipo vinculado a materia", estado: "Validado" },
]

const filters = {
  materia: ["Todas", "Proyecto Integrador", "Desarrollo de Software", "Base de Datos"],
  parcial: ["Todos", "Parcial 1", "Parcial 2", "Final"],
  equipo: ["Todos", "Equipo Aurum", "Equipo Nexus", "Equipo Innova"],
  estado: ["Todos", "Validado", "Completado", "Pendiente"],
}

export default function TransparenciaPage() {
  const [query, setQuery] = useState("")
  const [materia, setMateria] = useState("Todas")
  const [parcial, setParcial] = useState("Todos")
  const [equipo, setEquipo] = useState("Todos")
  const [estado, setEstado] = useState("Todos")

  const filteredRows = useMemo(
    () => auditRows.filter((row) => {
      const text = `${row.id} ${row.actor} ${row.accion} ${row.equipo} ${row.cambio}`.toLowerCase()
      return (
        text.includes(query.toLowerCase()) &&
        (materia === "Todas" || row.materia === materia) &&
        (parcial === "Todos" || row.parcial === parcial) &&
        (equipo === "Todos" || row.equipo === equipo) &&
        (estado === "Todos" || row.estado === estado)
      )
    }),
    [equipo, estado, materia, parcial, query]
  )

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Transparencia y trazabilidad"
        description="Sprint 7: historial completo de evaluaciones con filtros por materia, parcial, equipo y fecha"
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Eventos auditados", value: String(auditRows.length), icon: History, tone: "bg-teal-50 text-teal-700" },
            { label: "Cambios validados", value: String(auditRows.filter((row) => row.estado === "Validado").length), icon: ShieldCheck, tone: "bg-emerald-50 text-emerald-700" },
            { label: "Pendientes", value: String(auditRows.filter((row) => row.estado === "Pendiente").length), icon: CalendarClock, tone: "bg-amber-50 text-amber-700" },
            { label: "Filtros activos", value: String([materia, parcial, equipo, estado].filter((value) => !["Todas", "Todos"].includes(value)).length), icon: Filter, tone: "bg-blue-50 text-blue-700" },
          ].map(({ label, value, icon: Icon, tone }) => (
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
                <CardTitle>Panel de transparencia</CardTitle>
                <CardDescription>Tabla de auditoria simulada para validar el flujo frontend de cierre de etapa 2</CardDescription>
              </div>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_repeat(4,0.8fr)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar actor, equipo o cambio" className="pl-9" />
              </div>
              <FilterSelect value={materia} onValueChange={setMateria} values={filters.materia} />
              <FilterSelect value={parcial} onValueChange={setParcial} values={filters.parcial} />
              <FilterSelect value={equipo} onValueChange={setEquipo} values={filters.equipo} />
              <FilterSelect value={estado} onValueChange={setEstado} values={filters.estado} />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Accion</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Parcial</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-semibold">{row.id}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-slate-500">{row.fecha}</TableCell>
                      <TableCell>
                        <p className="font-medium text-slate-950">{row.actor}</p>
                        <p className="text-xs text-slate-500">{row.rol}</p>
                      </TableCell>
                      <TableCell>{row.accion}</TableCell>
                      <TableCell>{row.materia}</TableCell>
                      <TableCell>{row.parcial}</TableCell>
                      <TableCell>{row.equipo}</TableCell>
                      <TableCell>
                        <Badge className={row.estado === "Pendiente" ? "bg-amber-50 text-amber-700 hover:bg-amber-50" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"}>
                          {row.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <span className="font-semibold text-slate-950">Trazabilidad visible:</span> cada fila muestra quien hizo el cambio, que modifico, cuando ocurrio y sobre que materia/equipo/parcial aplica.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FilterSelect({ value, onValueChange, values }: { value: string; onValueChange: (value: string) => void; values: string[] }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {values.map((item) => (
          <SelectItem key={item} value={item}>{item}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
