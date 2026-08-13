"use client"

import { useCallback, useEffect, useState } from "react"
import { Award, FileSpreadsheet, FileText, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { authFetch } from "@/lib/client-api"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { ReporteEquipo } from "@/lib/types/reporte"

export default function ReportesPage() {
  const { user } = useAuth()
  const [equipos, setEquipos] = useState<EquipoWithRelations[]>([])
  const [equipoId, setEquipoId] = useState("")
  const [reporte, setReporte] = useState<ReporteEquipo | null>(null)
  const [loading, setLoading] = useState(true)

  const loadEquipos = useCallback(async () => {
    try {
      const response = await authFetch("/api/equipos")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "No se pudieron cargar los equipos")
      setEquipos(data.equipos)
      setEquipoId((current) => current || data.equipos[0]?.id || "")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cargar equipos")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadReporte = useCallback(async (id: string) => {
    if (!id) return
    setLoading(true)
    try {
      const response = await authFetch(`/api/reportes/${id}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? "No se pudo generar el reporte")
      setReporte(data.reporte)
    } catch (error) {
      setReporte(null)
      toast.error(error instanceof Error ? error.message : "Error al generar el reporte")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => void loadEquipos(), 0)
    return () => window.clearTimeout(timer)
  }, [loadEquipos])
  useEffect(() => {
    const timer = window.setTimeout(() => void loadReporte(equipoId), 0)
    return () => window.clearTimeout(timer)
  }, [equipoId, loadReporte])

  if (user?.rol !== "coordinadora_pi") {
    return <div><DashboardHeader title="Acceso restringido" description="Modulo reservado para Coordinacion PI" /></div>
  }

  const descargar = async (format: "csv" | "xlsx" | "pdf") => {
    if (!reporte || !equipoId) return
    try {
      const response = await authFetch(`/api/reportes/${equipoId}/export?format=${format}`)
      if (!response.ok) throw new Error("No se pudo generar el archivo")
      const blob = await response.blob()
      const disposition = response.headers.get("content-disposition") ?? ""
      const filename = disposition.match(/filename="([^"]+)"/)?.[1] ?? `reporte.${format}`
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url)
      toast.success(`Reporte ${format.toUpperCase()} descargado`)
    } catch (error) { toast.error(error instanceof Error ? error.message : "Error de descarga") }
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Reportes por equipo" description="Resultados calculados con evaluaciones y rubricas almacenadas" />
      <div className="space-y-6 p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
          <Select value={equipoId} onValueChange={setEquipoId}>
            <SelectTrigger className="w-full bg-white lg:w-96"><SelectValue placeholder="Selecciona un equipo" /></SelectTrigger>
            <SelectContent>{equipos.map((equipo) => <SelectItem key={equipo.id} value={equipo.id}>{equipo.nombre}</SelectItem>)}</SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void loadReporte(equipoId)} disabled={!equipoId || loading}><RefreshCw className="mr-2 h-4 w-4" />Actualizar</Button>
            <Button variant="outline" onClick={() => void descargar("csv")} disabled={!reporte}><FileText className="mr-2 h-4 w-4" />CSV</Button>
            <Button variant="outline" onClick={() => void descargar("xlsx")} disabled={!reporte}><FileSpreadsheet className="mr-2 h-4 w-4" />Excel</Button>
            <Button onClick={() => void descargar("pdf")} disabled={!reporte}><FileText className="mr-2 h-4 w-4" />PDF</Button>
          </div>
        </div>

        {!loading && equipos.length === 0 && <Card><CardContent className="p-6">Primero registra un equipo para generar su reporte.</CardContent></Card>}
        {loading && <Card><CardContent className="p-6">Calculando reporte...</CardContent></Card>}
        {!loading && reporte && (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <Metric label="Equipo" value={reporte.equipo?.nombre ?? "Sin nombre"} />
              <Metric label="Evaluaciones" value={String(reporte.evaluaciones.length)} />
              <Metric label="Calificacion final" value={reporte.calificacionPonderada.toFixed(2)} />
            </section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Detalle de evaluaciones</CardTitle>
                <CardDescription>Materia: {reporte.equipo?.materia?.nombre ?? "Sin materia asignada"}</CardDescription>
              </CardHeader>
              <CardContent>
                {reporte.evaluaciones.length === 0 ? <p className="text-sm text-muted-foreground">Este equipo aun no tiene evaluaciones registradas.</p> : (
                  <Table><TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Rubrica</TableHead><TableHead>Calificacion</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                    <TableBody>{reporte.evaluaciones.map((detalle) => <TableRow key={detalle.evaluacion.id}><TableCell>{new Date(detalle.fecha).toLocaleDateString("es-MX")}</TableCell><TableCell>{detalle.rubrica?.nombre ?? "Rubrica no disponible"}</TableCell><TableCell>{detalle.calificacion.toFixed(2)}</TableCell><TableCell><Badge variant="secondary">Registrada</Badge></TableCell></TableRow>)}</TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>
}
