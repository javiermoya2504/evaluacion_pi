"use client"

import { useEffect, useMemo, useState } from "react"
import { MessageSquareText } from "lucide-react"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authFetch } from "@/lib/client-api"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { Retroalimentacion } from "@/lib/types/retroalimentacion"

export default function RetroalimentacionPage() {
  const [equipos, setEquipos] = useState<EquipoWithRelations[]>([])
  const [items, setItems] = useState<Retroalimentacion[]>([])
  const [equipoId, setEquipoId] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([authFetch("/api/equipos"), authFetch("/api/retroalimentacion")])
        .then(async ([equiposResponse, retroResponse]) => {
          const [equiposData, retroData] = await Promise.all([equiposResponse.json(), retroResponse.json()])
          if (!equiposResponse.ok || !retroResponse.ok) throw new Error(equiposData.error ?? retroData.error ?? "No se pudieron cargar los datos")
          setEquipos(equiposData.equipos)
          setItems(retroData.retroalimentaciones)
          setEquipoId(equiposData.equipos[0]?.id ?? "")
        })
        .catch((error) => toast.error(error instanceof Error ? error.message : "Error al cargar datos"))
        .finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const visibles = useMemo(() => items.filter((item) => item.equipoId === equipoId), [equipoId, items])
  return <div className="flex flex-col">
    <DashboardHeader title="Retroalimentacion por equipo" description="Comentarios guardados por docentes y coordinacion" />
    <div className="space-y-6 p-6">
      <Select value={equipoId} onValueChange={setEquipoId}><SelectTrigger className="w-full bg-white md:w-96"><SelectValue placeholder="Selecciona un equipo" /></SelectTrigger><SelectContent>{equipos.map((equipo) => <SelectItem key={equipo.id} value={equipo.id}>{equipo.nombre}</SelectItem>)}</SelectContent></Select>
      {loading ? <Card><CardContent className="p-6">Cargando retroalimentacion...</CardContent></Card> : visibles.length === 0 ? <Card><CardContent className="p-6 text-muted-foreground">No hay comentarios registrados para este equipo.</CardContent></Card> : visibles.map((item) => <Card key={item.id}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><MessageSquareText className="h-4 w-4" />{new Date(item.createdAt).toLocaleString("es-MX")}</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap">{item.comentario}</p></CardContent></Card>)}
    </div>
  </div>
}
