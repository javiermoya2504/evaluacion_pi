"use client"

import { useMemo, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  FileText,
  Layers3,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

type Criterion = {
  id: string
  materia: string
  parcial: string
  nombre: string
  descripcion: string
  peso: number
  competencia: string
}

const criteriaBank: Criterion[] = [
  {
    id: "c-arq",
    materia: "Desarrollo de Software",
    parcial: "Parcial 1",
    nombre: "Arquitectura del sistema",
    descripcion: "Define capas, responsabilidades, patron de organizacion y escalabilidad del proyecto.",
    peso: 15,
    competencia: "Diseno tecnico",
  },
  {
    id: "c-req",
    materia: "Desarrollo de Software",
    parcial: "Parcial 1",
    nombre: "Requerimientos funcionales",
    descripcion: "El proyecto implementa los casos de uso acordados con validaciones y flujo completo.",
    peso: 15,
    competencia: "Analisis",
  },
  {
    id: "c-ui",
    materia: "Interfaces Web",
    parcial: "Parcial 2",
    nombre: "Experiencia de usuario",
    descripcion: "La interfaz es clara, responsive, consistente y permite completar tareas sin friccion.",
    peso: 12,
    competencia: "UI/UX",
  },
  {
    id: "c-db",
    materia: "Base de Datos",
    parcial: "Parcial 2",
    nombre: "Modelo de datos",
    descripcion: "El modelo mantiene integridad, normalizacion y relaciones necesarias para el sistema.",
    peso: 12,
    competencia: "Persistencia",
  },
  {
    id: "c-test",
    materia: "Calidad de Software",
    parcial: "Parcial 3",
    nombre: "Pruebas y evidencias",
    descripcion: "Incluye evidencia de pruebas funcionales, casos principales y correcciones realizadas.",
    peso: 10,
    competencia: "Calidad",
  },
  {
    id: "c-doc",
    materia: "Proyecto Integrador",
    parcial: "Parcial 3",
    nombre: "Documentacion tecnica",
    descripcion: "Presenta README, diagramas, manual de instalacion y decisiones tecnicas relevantes.",
    peso: 10,
    competencia: "Documentacion",
  },
  {
    id: "c-demo",
    materia: "Proyecto Integrador",
    parcial: "Final",
    nombre: "Demostracion funcional",
    descripcion: "El equipo presenta un flujo real, estable y coherente con el problema planteado.",
    peso: 16,
    competencia: "Presentacion",
  },
  {
    id: "c-team",
    materia: "Gestion de Proyectos",
    parcial: "Final",
    nombre: "Trabajo colaborativo",
    descripcion: "Se evidencia organizacion, responsabilidades claras y seguimiento del avance.",
    peso: 10,
    competencia: "Colaboracion",
  },
]

const defaultSelected = ["c-arq", "c-req", "c-ui", "c-db", "c-doc", "c-demo"]

export default function RubricasPage() {
  const { user } = useAuth()
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(defaultSelected)
  const [materia, setMateria] = useState("todas")
  const [parcial, setParcial] = useState("todos")
  const [notes, setNotes] = useState("Priorizar criterios que puedan evaluarse con evidencia durante la presentacion final.")
  const [status, setStatus] = useState<"draft" | "saved" | "published">("draft")

  const filteredCriteria = criteriaBank.filter((criterion) => {
    const matchesMateria = materia === "todas" || criterion.materia === materia
    const matchesParcial = parcial === "todos" || criterion.parcial === parcial
    return matchesMateria && matchesParcial
  })

  const selected = useMemo(
    () => criteriaBank.filter((criterion) => selectedCriteria.includes(criterion.id)),
    [selectedCriteria]
  )

  const totalWeight = selected.reduce((sum, criterion) => sum + criterion.peso, 0)
  const isCoordinator = user?.rol === "coordinadora_pi"

  const toggleCriterion = (criterionId: string) => {
    setStatus("draft")
    setSelectedCriteria((current) =>
      current.includes(criterionId)
        ? current.filter((id) => id !== criterionId)
        : [...current, criterionId]
    )
  }

  const saveDraft = () => {
    setStatus("saved")
  }

  const publishRubric = () => {
    setStatus("published")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={isCoordinator ? "Rubrica global institucional" : "Seleccion de criterios"}
        description={
          isCoordinator
            ? "Consolidado de criterios para la evaluacion final de Proyectos Integradores"
            : "Panel de jefe de asignatura para construir la rubrica del PI"
        }
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Card className="border-none bg-[#0b2f2f] text-white shadow-lg shadow-teal-950/10">
            <CardHeader>
              <Badge className="w-fit border-white/15 bg-white/10 text-teal-50 hover:bg-white/10">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Sprint 3
              </Badge>
              <CardTitle className="mt-3 text-2xl">Panel jefe academia: seleccionar criterios</CardTitle>
              <CardDescription className="text-teal-50/72">
                Selecciona criterios de distintas materias, revisa ponderacion total y genera una rubrica
                global lista para que el profesor la use en evaluaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {[
                ["Criterios seleccionados", String(selected.length), ClipboardList],
                ["Ponderacion actual", `${totalWeight}%`, Layers3],
                ["Estado", status === "published" ? "Publicada" : status === "saved" ? "Guardada" : "Borrador", ShieldCheck],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="rounded-xl border border-white/10 bg-white/10 p-4">
                  <Icon className="mb-3 h-5 w-5 text-teal-200" />
                  <p className="text-2xl font-semibold">{value as string}</p>
                  <p className="text-xs font-medium text-teal-50/65">{label as string}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Balance de rubrica</CardTitle>
              <CardDescription>La meta ideal es 100% de ponderacion total</CardDescription>
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
                  ? "La rubrica esta balanceada y lista para publicarse."
                  : totalWeight < 100
                    ? `Faltan ${100 - totalWeight}% para completar la ponderacion.`
                    : `La ponderacion excede por ${totalWeight - 100}%. Ajusta la seleccion.`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={saveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
                <Button className="flex-1" disabled={totalWeight !== 100} onClick={publishRubric}>
                  <Send className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>Banco de criterios</CardTitle>
                  <CardDescription>Filtra por materia y parcial para seleccionar criterios</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={materia} onValueChange={setMateria}>
                    <SelectTrigger className="w-[210px]">
                      <SelectValue placeholder="Materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las materias</SelectItem>
                      {[...new Set(criteriaBank.map((criterion) => criterion.materia))].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={parcial} onValueChange={setParcial}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Parcial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {[...new Set(criteriaBank.map((criterion) => criterion.parcial))].map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredCriteria.map((criterion) => {
                const checked = selectedCriteria.includes(criterion.id)
                return (
                  <div
                    key={criterion.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCriterion(criterion.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        toggleCriterion(criterion.id)
                      }
                    }}
                    className="grid w-full gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-teal-300 hover:bg-teal-50/40 sm:grid-cols-[auto_1fr_auto]"
                  >
                    <Checkbox
                      checked={checked}
                      onClick={(event) => event.stopPropagation()}
                      onCheckedChange={() => toggleCriterion(criterion.id)}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">{criterion.nombre}</p>
                        <Badge variant="outline">{criterion.competencia}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{criterion.descripcion}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">
                        {criterion.materia} · {criterion.parcial}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-teal-700">{criterion.peso}%</p>
                      <p className="text-xs text-slate-500">peso</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Vista previa de rubrica global</CardTitle>
              <CardDescription>Criterios que se enviaran al formulario de evaluacion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {selected.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                    Selecciona al menos un criterio para construir la rubrica.
                  </div>
                ) : (
                  selected.map((criterion, index) => (
                    <div key={criterion.id} className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{criterion.nombre}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-600">{criterion.descripcion}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{criterion.materia}</Badge>
                            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">{criterion.peso}%</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Notas para coordinacion</Label>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
              </div>

              <div className="rounded-xl bg-teal-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-teal-700" />
                  <div>
                    <p className="text-sm font-semibold text-teal-950">Entrega demostrable</p>
                    <p className="mt-1 text-xs leading-5 text-teal-800">
                      Esta pantalla cubre el sprint de seleccionar criterios y deja preparada la rubrica
                      global que consumira el formulario dinamico de evaluacion.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isCoordinator && (
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-teal-700" />
                Revision de coordinacion PI
              </CardTitle>
              <CardDescription>Resumen institucional de rubricas listas para evaluacion</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {["Rubrica Desarrollo de Software", "Rubrica Base de Datos", "Rubrica Global PI"].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 p-4">
                  <FileText className="mb-3 h-5 w-5 text-teal-700" />
                  <p className="font-semibold text-slate-950">{item}</p>
                  <p className="mt-1 text-sm text-slate-500">Validada para periodo actual</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
