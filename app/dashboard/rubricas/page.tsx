"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, BookOpenCheck, CheckCircle2, ClipboardList, FileText, Layers3, Loader2, Plus, Save, Send, ShieldCheck, Trash2 } from "lucide-react"

type CriterioRubrica = {
  nombre: string
  porcentaje: number
}

type Rubrica = {
  id: string
  nombre: string
  descripcion: string
  criterios: CriterioRubrica[]
  totalPorcentaje: number
  createdAt: string
}

const AUTH_TOKEN_STORAGE_KEY = "sigep_token"

const defaultCriteria: CriterioRubrica[] = [
  { nombre: "Arquitectura del sistema", porcentaje: 20 },
  { nombre: "Requerimientos funcionales", porcentaje: 20 },
  { nombre: "Calidad del codigo", porcentaje: 20 },
  { nombre: "Documentacion tecnica", porcentaje: 20 },
  { nombre: "Presentacion final", porcentaje: 20 },
]

export default function RubricasPage() {
  const { user } = useAuth()
  const [rubricas, setRubricas] = useState<Rubrica[]>([])
  const [nombre, setNombre] = useState("Rubrica PI")
  const [descripcion, setDescripcion] = useState("Criterios configurados para la evaluacion del Proyecto Integrador.")
  const [criterios, setCriterios] = useState<CriterioRubrica[]>(defaultCriteria)
  const [status, setStatus] = useState<"draft" | "saved" | "published">("draft")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const canManageRubricas = user?.rol === "admin" || user?.rol === "profesor" || user?.rol === "coordinadora_pi" || user?.rol === "jefe_asignatura"
  const canPersistRubricas = user?.rol === "coordinadora_pi" || user?.rol === "jefe_asignatura"
  const totalWeight = useMemo(
    () => criterios.reduce((sum, criterio) => sum + Number(criterio.porcentaje || 0), 0),
    [criterios],
  )

  const loadRubricas = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await authFetch("/api/rubricas/global")
      const data = (await response.json()) as { rubricas?: Rubrica[]; message?: string }

      if (!response.ok || !data.rubricas) {
        throw new Error(data.message ?? "No se pudieron cargar las rubricas")
      }

      setRubricas(data.rubricas)

      if (data.rubricas[0]) {
        loadRubricaIntoForm(data.rubricas[0])
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las rubricas")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!canManageRubricas) {
      return
    }

    const timer = window.setTimeout(() => {
      loadRubricas()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [canManageRubricas, loadRubricas])

  function loadRubricaIntoForm(rubrica: Rubrica) {
    setNombre(rubrica.nombre)
    setDescripcion(rubrica.descripcion)
    setCriterios(rubrica.criterios.length > 0 ? rubrica.criterios : defaultCriteria)
    setStatus("saved")
    setMessage(`Rubrica cargada: ${rubrica.nombre}`)
    setError("")
  }

  function updateCriterio(index: number, field: keyof CriterioRubrica, value: string) {
    setStatus("draft")
    setCriterios((current) =>
      current.map((criterio, currentIndex) =>
        currentIndex === index
          ? {
              ...criterio,
              [field]: field === "porcentaje" ? Number(value) : value,
            }
          : criterio,
      ),
    )
  }

  function addCriterio() {
    setStatus("draft")
    setCriterios((current) => [...current, { nombre: "", porcentaje: 0 }])
  }

  function removeCriterio(index: number) {
    setStatus("draft")
    setCriterios((current) => current.filter((_, currentIndex) => currentIndex !== index))
  }

  async function saveRubrica(nextStatus: "saved" | "published") {
    if (!canPersistRubricas) {
      setError("Tu rol tiene acceso de consulta; solo Coordinacion PI y Jefatura de asignatura pueden guardar rubricas")
      return
    }

    setIsSaving(true)
    setMessage("")
    setError("")

    try {
      const payload = {
        nombre,
        descripcion,
        criterios: criterios.map((criterio) => ({
          nombre: criterio.nombre,
          porcentaje: Number(criterio.porcentaje),
        })),
      }
      const response = await authFetch("/api/rubricas/global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as { rubrica?: Rubrica; message?: string; errors?: unknown }

      if (!response.ok || !data.rubrica) {
        throw new Error(data.message ?? "No se pudo guardar la rubrica")
      }

      setRubricas((current) => [data.rubrica as Rubrica, ...current])
      setStatus(nextStatus)
      setMessage(nextStatus === "published" ? "Rubrica publicada correctamente" : "Rubrica guardada correctamente")
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "No se pudo guardar la rubrica")
    } finally {
      setIsSaving(false)
    }
  }

  if (!canManageRubricas) {
    return (
      <div className="flex flex-col">
        <DashboardHeader title="Acceso restringido" description="Tu rol no puede administrar rubricas" />
        <div className="p-6">
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <p className="font-semibold text-amber-950">Modulo reservado para administracion academica y profesores.</p>
              <p className="mt-2 text-sm text-amber-800">Los alumnos no pueden configurar rubricas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={user?.rol === "profesor" ? "Consulta de rubricas" : "Rubrica global institucional"}
        description="Configuracion conectada a GET/POST /api/rubricas/global"
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-none bg-[#0b2f2f] text-white shadow-lg shadow-teal-950/10">
            <CardHeader>
              <Badge className="w-fit border-white/15 bg-white/10 text-teal-50 hover:bg-white/10">
                <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                API real
              </Badge>
              <CardTitle className="mt-3 text-2xl">Configurar rubrica</CardTitle>
              <CardDescription className="text-teal-50/72">
                Agrega criterios, ajusta porcentajes y guarda con la validacion existente del backend.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Metric label="Criterios" value={String(criterios.length)} icon={ClipboardList} />
              <Metric label="Ponderacion" value={`${totalWeight}%`} icon={Layers3} />
              <Metric label="Estado" value={status === "published" ? "Publicada" : status === "saved" ? "Guardada" : "Borrador"} icon={ShieldCheck} />
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Balance de rubrica</CardTitle>
              <CardDescription>La API exige que la suma sea exactamente 100%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Ponderacion acumulada</span>
                  <span className="font-semibold text-slate-950">{totalWeight}%</span>
                </div>
                <Progress value={Math.min(totalWeight, 100)} className="h-2" />
              </div>
              <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                {totalWeight === 100
                  ? "La rubrica cumple la validacion de porcentaje."
                  : totalWeight < 100
                    ? `Faltan ${100 - totalWeight}% para completar la ponderacion.`
                    : `La ponderacion excede por ${totalWeight - 100}%.`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => saveRubrica("saved")} disabled={!canPersistRubricas || isSaving || totalWeight !== 100}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Guardar
                </Button>
                <Button className="flex-1" disabled={!canPersistRubricas || isSaving || totalWeight !== 100} onClick={() => saveRubrica("published")}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {message && <StatusMessage tone="success" message={message} />}
        {error && <StatusMessage tone="error" message={error} />}

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Editor de criterios</CardTitle>
                  <CardDescription>Contrato: nombre, descripcion y criterios con porcentaje</CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addCriterio} disabled={!canPersistRubricas}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar criterio
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rubrica-nombre">Nombre</Label>
                  <Input id="rubrica-nombre" value={nombre} disabled={!canPersistRubricas} onChange={(event) => { setStatus("draft"); setNombre(event.target.value) }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rubrica-descripcion">Descripcion</Label>
                  <Input id="rubrica-descripcion" value={descripcion} disabled={!canPersistRubricas} onChange={(event) => { setStatus("draft"); setDescripcion(event.target.value) }} />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {criterios.map((criterio, index) => (
                  <div key={`${criterio.nombre}-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_130px_auto] md:items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`criterio-${index}`}>Criterio</Label>
                      <Input
                        id={`criterio-${index}`}
                        value={criterio.nombre}
                        disabled={!canPersistRubricas}
                        onChange={(event) => updateCriterio(index, "nombre", event.target.value)}
                        placeholder="Nombre del criterio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`porcentaje-${index}`}>Porcentaje</Label>
                      <Input
                        id={`porcentaje-${index}`}
                        type="number"
                        min={0}
                        max={100}
                        value={criterio.porcentaje}
                        disabled={!canPersistRubricas}
                        onChange={(event) => updateCriterio(index, "porcentaje", event.target.value)}
                      />
                    </div>
                    <Button type="button" variant="outline" size="icon" onClick={() => removeCriterio(index)} disabled={!canPersistRubricas || criterios.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Rubricas persistidas</CardTitle>
              <CardDescription>Cargadas desde GET /api/rubricas/global</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 p-8 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando rubricas...
                </div>
              ) : rubricas.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  No hay rubricas persistidas todavia.
                </div>
              ) : (
                rubricas.map((rubrica) => (
                  <button
                    key={rubrica.id}
                    type="button"
                    onClick={() => loadRubricaIntoForm(rubrica)}
                    className="w-full rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/40"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-5 w-5 text-teal-700" />
                      <div>
                        <p className="font-semibold text-slate-950">{rubrica.nombre}</p>
                        <p className="mt-1 text-sm text-slate-500">{rubrica.descripcion}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="outline">{rubrica.criterios.length} criterios</Badge>
                          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{rubrica.totalPorcentaje}%</Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}

              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                No existe un campo materia/profesor en el contrato actual de rubrica, por lo que no se puede restringir por materia sin ampliar el modelo.
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-teal-700" />
              Vista previa
            </CardTitle>
            <CardDescription>Contenido que se enviara al endpoint al guardar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {criterios.map((criterio, index) => (
              <div key={`${criterio.nombre}-preview-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-950">{criterio.nombre || "Criterio sin nombre"}</p>
                <Badge variant="outline">{criterio.porcentaje}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof ClipboardList }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4">
      <Icon className="mb-3 h-5 w-5 text-teal-200" />
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs font-medium text-teal-50/65">{label}</p>
    </div>
  )
}

function StatusMessage({ tone, message }: { tone: "success" | "error"; message: string }) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700"

  return (
    <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${className}`}>
      {tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
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
