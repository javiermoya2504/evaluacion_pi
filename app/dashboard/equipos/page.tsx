"use client"

import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, BookOpenCheck, CheckCircle2, Loader2, Pencil, Plus, Search, Trash2, Users } from "lucide-react"

type Materia = {
  id: string
  nombre: string
  cuatrimestre: number
  profesor: string
  activa: boolean
}

type UserOption = {
  id: string
  nombre: string
  email: string
  rol: string
}

type Equipo = {
  id: string
  nombre: string
  materiaId: string
  integranteIds: string[]
  materia?: Materia | null
  integrantes?: UserOption[]
}

const AUTH_TOKEN_STORAGE_KEY = "sigep_token"

export default function EquiposPage() {
  const { user } = useAuth()
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [materias, setMaterias] = useState<Materia[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null)
  const [form, setForm] = useState({ nombre: "", materiaId: "", integranteIds: [] as string[] })

  const canManageEquipos = user?.rol === "admin" || user?.rol === "coordinadora_pi"

  useEffect(() => {
    if (!canManageEquipos) {
      return
    }

    loadData()
  }, [canManageEquipos])

  const filteredEquipos = useMemo(
    () =>
      equipos.filter((equipo) => {
        const text = `${equipo.nombre} ${equipo.materia?.nombre ?? ""} ${equipo.integrantes?.map((item) => item.nombre).join(" ") ?? ""}`.toLowerCase()
        return text.includes(query.toLowerCase())
      }),
    [equipos, query],
  )

  async function loadData() {
    setIsLoading(true)
    setError("")

    try {
      const [equiposResponse, materiasResponse, usersResponse] = await Promise.all([
        authFetch("/api/equipos"),
        authFetch("/api/materias"),
        authFetch("/api/users"),
      ])

      if (!equiposResponse.ok || !materiasResponse.ok || !usersResponse.ok) {
        throw new Error("No se pudieron cargar los datos reales")
      }

      const equiposData = (await equiposResponse.json()) as { equipos: Equipo[] }
      const materiasData = (await materiasResponse.json()) as { materias: Materia[] }
      const usersData = (await usersResponse.json()) as { users: UserOption[] }

      setEquipos(equiposData.equipos)
      setMaterias(materiasData.materias)
      setUsers(usersData.users)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los equipos")
    } finally {
      setIsLoading(false)
    }
  }

  function openEditModal(equipo: Equipo) {
    setEditingEquipo(equipo)
    setForm({
      nombre: equipo.nombre,
      materiaId: equipo.materiaId,
      integranteIds: equipo.integranteIds,
    })
    setMessage("")
    setError("")
  }

  function toggleIntegrante(userId: string) {
    setForm((current) => ({
      ...current,
      integranteIds: current.integranteIds.includes(userId)
        ? current.integranteIds.filter((id) => id !== userId)
        : [...current.integranteIds, userId],
    }))
  }

  async function saveEquipo() {
    if (!editingEquipo) return

    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      const response = await authFetch("/api/equipos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingEquipo.id,
          nombre: form.nombre,
          materiaId: form.materiaId,
          integranteIds: form.integranteIds,
        }),
      })

      const data = (await response.json()) as { equipo?: Equipo; message?: string }

      if (!response.ok || !data.equipo) {
        throw new Error(data.message ?? "No se pudo guardar el equipo")
      }

      setEquipos((current) => current.map((equipo) => (equipo.id === data.equipo?.id ? data.equipo : equipo)))
      setMessage("Equipo actualizado correctamente")
      setEditingEquipo(null)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar el equipo")
    } finally {
      setIsSaving(false)
    }
  }

  async function removeIntegrante(equipo: Equipo, integranteId: string) {
    setMessage("")
    setError("")

    try {
      const response = await authFetch("/api/equipos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: equipo.id,
          integranteIds: equipo.integranteIds.filter((id) => id !== integranteId),
        }),
      })

      const data = (await response.json()) as { equipo?: Equipo; message?: string }

      if (!response.ok || !data.equipo) {
        throw new Error(data.message ?? "No se pudo eliminar el integrante")
      }

      setEquipos((current) => current.map((item) => (item.id === data.equipo?.id ? data.equipo : item)))
      setMessage("Integrante eliminado correctamente")
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "No se pudo eliminar el integrante")
    }
  }

  if (!canManageEquipos) {
    return (
      <div className="flex flex-col">
        <DashboardHeader title="Acceso restringido" description="Tu rol no tiene permisos para administrar equipos" />
        <div className="p-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="font-semibold text-amber-950">Modulo reservado para administracion academica.</p>
              <p className="mt-2 text-sm text-amber-800">
                Alumnos y profesores sin permisos administrativos no pueden editar equipos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Equipos PI" description="Equipos, materias e integrantes conectados a la API" />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Equipos" value={equipos.length} icon={Users} tone="bg-teal-50 text-teal-700" />
          <SummaryCard label="Materias activas" value={materias.filter((materia) => materia.activa).length} icon={BookOpenCheck} tone="bg-blue-50 text-blue-700" />
          <SummaryCard label="Usuarios disponibles" value={users.length} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
        </section>

        {message && <StatusMessage tone="success" message={message} />}
        {error && <StatusMessage tone="error" message={error} />}

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Lista de equipos registrados</CardTitle>
                <CardDescription>Datos cargados desde GET /api/equipos, GET /api/materias y GET /api/users</CardDescription>
              </div>
              <Button onClick={loadData} variant="outline" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Refrescar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
                placeholder="Buscar por equipo, materia o integrante"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando equipos reales...
              </div>
            ) : filteredEquipos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                No hay equipos para mostrar.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEquipos.map((equipo) => (
                  <div key={equipo.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-teal-100 font-semibold text-teal-800">
                            {equipo.nombre.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-slate-950">{equipo.nombre}</h3>
                            <Badge variant="outline">{equipo.materia?.nombre ?? "Sin materia"}</Badge>
                          </div>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            ID: {equipo.id} · MateriaId: {equipo.materiaId}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(equipo.integrantes ?? []).length > 0 ? (
                              equipo.integrantes?.map((integrante) => (
                                <Badge key={integrante.id} variant="outline" className="gap-1">
                                  {integrante.nombre}
                                  <button
                                    type="button"
                                    onClick={() => removeIntegrante(equipo, integrante.id)}
                                    className="ml-1 rounded-full text-slate-500 hover:text-red-600"
                                    aria-label={`Eliminar ${integrante.nombre}`}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-slate-500">Sin integrantes asignados</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(equipo)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar equipo
                        </Button>
                        <Button size="sm" onClick={() => openEditModal(equipo)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Asignar materia/integrantes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(editingEquipo)} onOpenChange={(open) => !open && setEditingEquipo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar equipo</DialogTitle>
            <DialogDescription>Los cambios se guardan con PUT /api/equipos.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="equipo-nombre">Nombre</Label>
              <Input id="equipo-nombre" value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Materia</Label>
              <Select value={form.materiaId} onValueChange={(materiaId) => setForm((current) => ({ ...current, materiaId }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {materias.map((materia) => (
                    <SelectItem key={materia.id} value={materia.id}>
                      {materia.nombre} · {materia.profesor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Integrantes</Label>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-3">
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay usuarios disponibles.</p>
                ) : (
                  users.map((candidate) => (
                    <label key={candidate.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50">
                      <Checkbox checked={form.integranteIds.includes(candidate.id)} onCheckedChange={() => toggleIntegrante(candidate.id)} />
                      <span>
                        <span className="block text-sm font-medium text-slate-950">{candidate.nombre}</span>
                        <span className="block text-xs text-slate-500">{candidate.email} · {candidate.rol}</span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingEquipo(null)} disabled={isSaving}>Cancelar</Button>
            <Button onClick={saveEquipo} disabled={isSaving || !form.nombre.trim() || !form.materiaId}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Users; tone: string }) {
  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
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
  )
}

function StatusMessage({ tone, message }: { tone: "success" | "error"; message: string }) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700"

  return (
    <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${className}`}>
      {tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      {message}
    </div>
  )
}

function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  const headers = new Headers(init.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(input, {
    ...init,
    headers,
  })
}
