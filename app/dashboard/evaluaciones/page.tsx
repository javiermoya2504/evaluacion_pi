"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Star,
  Send,
  Save,
  MessageSquare
} from "lucide-react"

const evaluacionesData = [
  {
    id: 1,
    equipo: "Equipo Alpha",
    proyecto: "Sistema IoT para Agricultura",
    rubrica: "Rúbrica Global PI",
    docente: "Dr. Roberto Sánchez",
    fechaAsignacion: "2024-01-15",
    fechaLimite: "2024-01-30",
    estado: "en-progreso",
    progreso: 60,
    calificacion: null,
  },
  {
    id: 2,
    equipo: "Equipo Beta",
    proyecto: "App de Gestión Escolar",
    rubrica: "Rúbrica Programación Web",
    docente: "Mtra. Laura Martínez",
    fechaAsignacion: "2024-01-10",
    fechaLimite: "2024-01-25",
    estado: "pendiente",
    progreso: 0,
    calificacion: null,
  },
  {
    id: 3,
    equipo: "Equipo Gamma",
    proyecto: "Plataforma E-learning",
    rubrica: "Rúbrica Global PI",
    docente: "Dr. Ana García",
    fechaAsignacion: "2024-01-05",
    fechaLimite: "2024-01-20",
    estado: "completada",
    progreso: 100,
    calificacion: 95,
  },
  {
    id: 4,
    equipo: "Equipo Delta",
    proyecto: "Sistema de Inventarios",
    rubrica: "Rúbrica Base de Datos",
    docente: "Ing. Carlos Pérez",
    fechaAsignacion: "2024-01-12",
    fechaLimite: "2024-01-27",
    estado: "en-progreso",
    progreso: 40,
    calificacion: null,
  },
]

const criteriosEvaluacion = [
  {
    id: 1,
    nombre: "Funcionalidad del Sistema",
    descripcion: "El sistema cumple con los requerimientos funcionales establecidos",
    puntajeMax: 25,
    puntaje: 0,
    observaciones: "",
  },
  {
    id: 2,
    nombre: "Diseño de Interfaz",
    descripcion: "La interfaz es intuitiva, accesible y estéticamente agradable",
    puntajeMax: 20,
    puntaje: 0,
    observaciones: "",
  },
  {
    id: 3,
    nombre: "Base de Datos",
    descripcion: "El modelo de datos está normalizado y optimizado",
    puntajeMax: 20,
    puntaje: 0,
    observaciones: "",
  },
  {
    id: 4,
    nombre: "Documentación",
    descripcion: "La documentación técnica y de usuario está completa",
    puntajeMax: 15,
    puntaje: 0,
    observaciones: "",
  },
  {
    id: 5,
    nombre: "Presentación",
    descripcion: "Claridad y dominio del tema durante la exposición",
    puntajeMax: 20,
    puntaje: 0,
    observaciones: "",
  },
]

const estadoConfig = {
  "pendiente": { label: "Pendiente", className: "bg-amber-500/10 text-amber-500", icon: AlertCircle },
  "en-progreso": { label: "En Progreso", className: "bg-primary/10 text-primary", icon: Clock },
  "completada": { label: "Completada", className: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
}

export default function EvaluacionesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<typeof evaluacionesData[0] | null>(null)
  const [criterios, setCriterios] = useState(criteriosEvaluacion)

  const filteredEvaluaciones = evaluacionesData.filter((evaluacion) => {
    const matchesSearch = evaluacion.equipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluacion.proyecto.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEstado = filterEstado === "todos" || evaluacion.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  const totalPuntaje = criterios.reduce((acc, c) => acc + c.puntaje, 0)
  const maxPuntaje = criterios.reduce((acc, c) => acc + c.puntajeMax, 0)

  const handlePuntajeChange = (id: number, value: number[]) => {
    setCriterios(criterios.map(c => 
      c.id === id ? { ...c, puntaje: value[0] } : c
    ))
  }

  const handleObservacionChange = (id: number, value: string) => {
    setCriterios(criterios.map(c => 
      c.id === id ? { ...c, observaciones: value } : c
    ))
  }

  const openEvaluation = (evaluacion: typeof evaluacionesData[0]) => {
    setSelectedEvaluacion(evaluacion)
    setCriterios(criteriosEvaluacion.map(c => ({ ...c, puntaje: 0, observaciones: "" })))
    setIsEvaluationOpen(true)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Evaluaciones" 
        description="Evalúa los proyectos integradores con las rúbricas asignadas"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Evaluaciones
              </CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{evaluacionesData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendientes
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {evaluacionesData.filter(e => e.estado === "pendiente").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Progreso
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {evaluacionesData.filter(e => e.estado === "en-progreso").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completadas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {evaluacionesData.filter(e => e.estado === "completada").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar evaluaciones..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterEstado} onValueChange={setFilterEstado}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="en-progreso">En Progreso</SelectItem>
              <SelectItem value="completada">Completadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Evaluations List */}
        <div className="grid gap-4">
          {filteredEvaluaciones.map((evaluacion) => {
            const config = estadoConfig[evaluacion.estado as keyof typeof estadoConfig]
            const StatusIcon = config.icon
            return (
              <Card key={evaluacion.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{evaluacion.equipo}</h3>
                          <Badge className={config.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{evaluacion.proyecto}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            {evaluacion.rubrica}
                          </span>
                          <span>•</span>
                          <span>{evaluacion.docente}</span>
                          <span>•</span>
                          <span>Límite: {evaluacion.fechaLimite}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {evaluacion.estado !== "completada" ? (
                        <div className="w-32">
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{evaluacion.progreso}%</span>
                          </div>
                          <Progress value={evaluacion.progreso} className="h-2" />
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                            <span className="text-2xl font-bold">{evaluacion.calificacion}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Calificación</span>
                        </div>
                      )}

                      <Button 
                        onClick={() => openEvaluation(evaluacion)}
                        disabled={evaluacion.estado === "completada"}
                      >
                        {evaluacion.estado === "completada" ? "Ver Resultado" : "Evaluar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Evaluation Modal */}
        <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Evaluación de Proyecto Integrador</DialogTitle>
              <DialogDescription>
                {selectedEvaluacion?.equipo} - {selectedEvaluacion?.proyecto}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="criterios" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="criterios">Criterios de Evaluación</TabsTrigger>
                <TabsTrigger value="retroalimentacion">Retroalimentación General</TabsTrigger>
              </TabsList>

              <TabsContent value="criterios" className="space-y-6 mt-4">
                {criterios.map((criterio) => (
                  <Card key={criterio.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{criterio.nombre}</CardTitle>
                          <CardDescription className="mt-1">{criterio.descripcion}</CardDescription>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">{criterio.puntaje}</span>
                          <span className="text-muted-foreground">/{criterio.puntajeMax}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Puntaje</Label>
                        <Slider
                          value={[criterio.puntaje]}
                          max={criterio.puntajeMax}
                          step={1}
                          onValueChange={(value) => handlePuntajeChange(criterio.id, value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Observaciones</Label>
                        <Textarea
                          placeholder="Agrega comentarios específicos para este criterio..."
                          value={criterio.observaciones}
                          onChange={(e) => handleObservacionChange(criterio.id, e.target.value)}
                          className="mt-2"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Total Score */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Calificación Total</h3>
                        <p className="text-sm text-muted-foreground">
                          Suma de todos los criterios evaluados
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold text-primary">{totalPuntaje}</span>
                        <span className="text-xl text-muted-foreground">/{maxPuntaje}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="retroalimentacion" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Retroalimentación General
                    </CardTitle>
                    <CardDescription>
                      Proporciona comentarios generales sobre el desempeño del equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Fortalezas del Proyecto</Label>
                      <Textarea
                        placeholder="Describe los puntos fuertes del proyecto..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Áreas de Mejora</Label>
                      <Textarea
                        placeholder="Indica aspectos que el equipo podría mejorar..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Recomendaciones</Label>
                      <Textarea
                        placeholder="Sugerencias para futuras iteraciones..."
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-6 gap-2">
              <Button variant="outline" onClick={() => setIsEvaluationOpen(false)}>
                Cancelar
              </Button>
              <Button variant="secondary" className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Borrador
              </Button>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Enviar Evaluación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
