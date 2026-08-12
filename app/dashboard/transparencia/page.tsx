"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, Search, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { authFetch } from "@/lib/client-api"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { Evaluacion } from "@/lib/types/evaluacion"

export default function TransparenciaPage() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [equipos, setEquipos] = useState<EquipoWithRelations[]>([])
  const [query, setQuery] = useState("")
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([authFetch("/api/evaluaciones"), authFetch("/api/equipos")]).then(async ([a, b]) => {
        const [evaluacionesData, equiposData] = await Promise.all([a.json(), b.json()])
        if (!a.ok || !b.ok) throw new Error(evaluacionesData.error ?? equiposData.error ?? "No se pudo cargar la trazabilidad")
        setEvaluaciones(evaluacionesData.evaluaciones)
        setEquipos(equiposData.equipos)
      }).catch((error) => toast.error(error instanceof Error ? error.message : "Error al cargar datos"))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])
  const rows = useMemo(() => evaluaciones.filter((item) => `${item.id} ${equipos.find((equipo) => equipo.id === item.equipoId)?.nombre ?? ""} ${item.observaciones}`.toLowerCase().includes(query.toLowerCase())), [equipos, evaluaciones, query])
  const download = () => {
    const csv = ["id,fecha,equipo,docente,observaciones", ...rows.map((item) => [item.id, item.createdAt, equipos.find((equipo) => equipo.id === item.equipoId)?.nombre ?? "", item.docenteId, item.observaciones].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "trazabilidad-evaluaciones.csv"; anchor.click(); URL.revokeObjectURL(url)
  }
  return <div className="flex flex-col"><DashboardHeader title="Transparencia y trazabilidad" description="Historial real de evaluaciones registradas" /><div className="space-y-6 p-6">
    <Card><CardContent className="flex items-center gap-3 p-5"><ShieldCheck className="h-6 w-6 text-emerald-600" /><div><p className="text-sm text-muted-foreground">Registros auditables</p><p className="text-2xl font-semibold">{evaluaciones.length}</p></div></CardContent></Card>
    <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Evaluaciones</CardTitle><Button onClick={download} disabled={!rows.length}><Download className="mr-2 h-4 w-4" />Exportar CSV</Button></CardHeader><CardContent className="space-y-4"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar equipo, ID u observaciones" /></div>
      <Table><TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Equipo</TableHead><TableHead>Docente</TableHead><TableHead>Observaciones</TableHead></TableRow></TableHeader><TableBody>{rows.map((item) => <TableRow key={item.id}><TableCell>{new Date(item.createdAt).toLocaleString("es-MX")}</TableCell><TableCell>{equipos.find((equipo) => equipo.id === item.equipoId)?.nombre ?? item.equipoId}</TableCell><TableCell>{item.docenteId}</TableCell><TableCell>{item.observaciones || "Sin observaciones"}</TableCell></TableRow>)}</TableBody></Table>
    </CardContent></Card></div></div>
}
