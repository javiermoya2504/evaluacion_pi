"use client"

import { useCallback, useMemo, useState } from "react"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { authFetch } from "@/lib/client-api"
import type { Proyecto, ProyectoEstado } from "@/lib/types/proyecto"
import { Loader2, Pencil, Plus, Search } from "lucide-react"

const emptyForm = { nombre: "", descripcion: "", carrera: "ISC", periodo: "2026-2", fechaInicio: "", fechaFin: "", estado: "planificacion" as ProyectoEstado, progreso: 0 }

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<Proyecto | null | "new">(null)
  const [form, setForm] = useState(emptyForm)

  const load = useCallback(async () => {
    setLoading(true); setError("")
    try { const response = await authFetch("/api/proyectos"); const data = await response.json(); if (!response.ok) throw new Error(data.message); setProyectos(data.proyectos) }
    catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudieron cargar los proyectos") }
    finally { setLoading(false) }
  }, [])
  useAutoRefresh(load)
  const filtered = useMemo(() => proyectos.filter((item) => `${item.nombre} ${item.descripcion} ${item.carrera}`.toLowerCase().includes(query.toLowerCase())), [proyectos, query])
  function openNew() { setForm(emptyForm); setEditing("new"); setError("") }
  function openEdit(item: Proyecto) { const { id: _id, createdAt: _createdAt, ...values } = item; void _id; void _createdAt; setForm(values); setEditing(item); setError("") }
  async function save() {
    setSaving(true); setError("")
    try {
      const method = editing === "new" ? "POST" : "PUT"
      const body = editing === "new" ? form : { id: editing?.id, ...form }
      const response = await authFetch("/api/proyectos", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await response.json(); if (!response.ok) throw new Error(data.message ?? "No se pudo guardar")
      setEditing(null); await load()
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se pudo guardar") }
    finally { setSaving(false) }
  }

  return <div className="flex flex-col">
    <DashboardHeader title="Proyectos Integradores" description="Proyectos persistentes conectados a Neon" />
    <div className="flex-1 space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-3"><Metric label="Total" value={proyectos.length} /><Metric label="En desarrollo" value={proyectos.filter(p => p.estado === "en-desarrollo").length} /><Metric label="Finalizados" value={proyectos.filter(p => p.estado === "finalizado").length} /></div>
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><Input className="pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar proyectos" /></div><Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Nuevo proyecto</Button></div>
      {loading ? <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.map(item => <Card key={item.id}><CardHeader><div className="flex justify-between"><Badge>{item.estado}</Badge><Badge variant="outline">{item.carrera}</Badge></div><CardTitle>{item.nombre}</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-slate-600">{item.descripcion}</p><p className="text-xs text-slate-500">{item.fechaInicio} — {item.fechaFin} · {item.periodo}</p><Progress value={item.progreso} /><div className="flex justify-between text-sm"><span>Progreso</span><strong>{item.progreso}%</strong></div><Button variant="outline" className="w-full" onClick={() => openEdit(item)}><Pencil className="mr-2 h-4 w-4" />Editar</Button></CardContent></Card>)}</div>}
    </div>
    <Dialog open={editing !== null} onOpenChange={open => !open && setEditing(null)}><DialogContent><DialogHeader><DialogTitle>{editing === "new" ? "Nuevo proyecto" : "Editar proyecto"}</DialogTitle></DialogHeader><div className="grid gap-4"><Field label="Nombre"><Input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} /></Field><Field label="Descripcion"><Textarea value={form.descripcion} onChange={e => setForm({...form, descripcion:e.target.value})} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Carrera"><Input value={form.carrera} onChange={e => setForm({...form, carrera:e.target.value})} /></Field><Field label="Periodo"><Input value={form.periodo} onChange={e => setForm({...form, periodo:e.target.value})} /></Field><Field label="Inicio"><Input type="date" value={form.fechaInicio} onChange={e => setForm({...form, fechaInicio:e.target.value})} /></Field><Field label="Fin"><Input type="date" value={form.fechaFin} onChange={e => setForm({...form, fechaFin:e.target.value})} /></Field></div><Field label="Estado"><Select value={form.estado} onValueChange={estado => setForm({...form, estado:estado as ProyectoEstado})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="planificacion">Planificacion</SelectItem><SelectItem value="en-desarrollo">En desarrollo</SelectItem><SelectItem value="finalizado">Finalizado</SelectItem></SelectContent></Select></Field><Field label={`Progreso (${form.progreso}%)`}><Input type="number" min={0} max={100} value={form.progreso} onChange={e => setForm({...form, progreso:Number(e.target.value)})} /></Field></div><DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button><Button onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Guardar</Button></DialogFooter></DialogContent></Dialog>
  </div>
}

function Metric({label,value}:{label:string;value:number}) { return <Card><CardContent className="p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></CardContent></Card> }
function Field({label,children}:{label:string;children:React.ReactNode}) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
