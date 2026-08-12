"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { authFetch } from "@/lib/client-api"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { Evaluacion } from "@/lib/types/evaluacion"
import type { Rubrica } from "@/lib/types/rubrica"
import { CheckCircle2, Loader2, Plus } from "lucide-react"

export default function EvaluacionesPage() {
  const { user } = useAuth()
  const [equipos, setEquipos] = useState<EquipoWithRelations[]>([])
  const [rubricas, setRubricas] = useState<Rubrica[]>([])
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [equipoId, setEquipoId] = useState("")
  const [rubricaId, setRubricaId] = useState("")
  const [scores, setScores] = useState<Record<number, number>>({})
  const [observaciones, setObservaciones] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => { void load() }, [])
  async function load() {
    setLoading(true); setError("")
    try {
      const [a,b,c] = await Promise.all([authFetch("/api/equipos"), authFetch("/api/rubricas/global"), authFetch("/api/evaluaciones")])
      const [ea,rb,ev] = await Promise.all([a.json(),b.json(),c.json()]); if (!a.ok || !b.ok || !c.ok) throw new Error("No se pudieron cargar las evaluaciones")
      setEquipos(ea.equipos); setRubricas(rb.rubricas); setEvaluaciones(ev.evaluaciones)
      setEquipoId(current => current || ea.equipos[0]?.id || ""); setRubricaId(current => current || rb.rubricas[0]?.id || "")
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Error de carga") }
    finally { setLoading(false) }
  }
  const rubric = useMemo(() => rubricas.find(item => item.id === rubricaId), [rubricas, rubricaId])
  const teamName = (id:string) => equipos.find(item => item.id === id)?.nombre ?? id
  const rubricName = (id:string) => rubricas.find(item => item.id === id)?.nombre ?? id
  async function submit() {
    if (!rubric || !equipoId || !user) return
    setSaving(true); setError(""); setMessage("")
    try {
      const criterios = rubric.criterios.map((_, index) => ({ criterioId: String(index), puntuacion: scores[index] ?? 0 }))
      const response = await authFetch("/api/evaluaciones", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({equipoId,rubricaId,docenteId:user.id,observaciones,criterios}) })
      const data = await response.json(); if (!response.ok) throw new Error(data.message ?? "No se pudo guardar")
      setScores({}); setObservaciones(""); setMessage("Evaluacion guardada correctamente"); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar") }
    finally { setSaving(false) }
  }
  const canCreate = user?.rol === "profesor" || user?.rol === "coordinadora_pi"

  return <div className="flex flex-col"><DashboardHeader title="Evaluaciones" description="Captura y supervision conectadas a Neon" /><div className="flex-1 space-y-6 p-6">
    {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}{message ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p> : null}
    {canCreate ? <Card><CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" />Nueva evaluacion</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><Field label="Equipo"><Select value={equipoId} onValueChange={setEquipoId}><SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger><SelectContent>{equipos.map(item => <SelectItem key={item.id} value={item.id}>{item.nombre}</SelectItem>)}</SelectContent></Select></Field><Field label="Rubrica"><Select value={rubricaId} onValueChange={setRubricaId}><SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger><SelectContent>{rubricas.map(item => <SelectItem key={item.id} value={item.id}>{item.nombre}</SelectItem>)}</SelectContent></Select></Field></div>{rubric?.criterios.map((criterion,index) => <Field key={criterion.nombre} label={`${criterion.nombre} (${criterion.porcentaje}%)`}><Input type="number" min={0} max={100} value={scores[index] ?? ""} onChange={e => setScores({...scores,[index]:Number(e.target.value)})} /></Field>)}<Field label="Observaciones"><Textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} /></Field><Button onClick={submit} disabled={saving || !rubric || rubric.criterios.some((_,i) => scores[i] === undefined)}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Guardar evaluacion</Button></CardContent></Card> : null}
    <Card><CardHeader><CardTitle>Evaluaciones registradas ({evaluaciones.length})</CardTitle></CardHeader><CardContent>{loading ? <Loader2 className="animate-spin" /> : evaluaciones.length === 0 ? <p className="text-sm text-slate-500">Aun no hay evaluaciones.</p> : <div className="space-y-3">{evaluaciones.map(item => <div key={item.id} className="flex flex-col justify-between gap-3 rounded-xl border p-4 md:flex-row"><div><strong>{teamName(item.equipoId)}</strong><p className="text-sm text-slate-500">{rubricName(item.rubricaId)} · {new Date(item.createdAt).toLocaleString("es-MX")}</p><p className="mt-2 text-sm">{item.observaciones || "Sin observaciones"}</p></div><Badge className="h-fit bg-emerald-50 text-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3" />Guardada</Badge></div>)}</div>}</CardContent></Card>
  </div></div>
}
function Field({label,children}:{label:string;children:React.ReactNode}) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
