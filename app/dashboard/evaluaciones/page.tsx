"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react"

// Rúbrica Global del PI con todas las categorías
const rubricaGlobalPI = {
  nombre: "Rúbrica Global - Evaluación Final del Proyecto Integrador",
  categorias: [
    {
      id: 1,
      nombre: "Desarrollo Técnico",
      ponderacion: 40,
      criterios: [
        {
          id: 1,
          nombre: "Arquitectura del Sistema",
          descripcion: "Diseño y estructura del sistema, patrones utilizados",
          materiaOrigen: "Ingeniería de Software",
          puntajeMax: 15,
        },
        {
          id: 2,
          nombre: "Calidad del Código",
          descripcion: "Legibilidad, mantenibilidad y buenas prácticas",
          materiaOrigen: "Programación Web",
          puntajeMax: 15,
        },
        {
          id: 3,
          nombre: "Base de Datos",
          descripcion: "Normalización, optimización y diseño de esquema",
          materiaOrigen: "Base de Datos",
          puntajeMax: 10,
        },
      ]
    },
    {
      id: 2,
      nombre: "Funcionalidad e Innovación",
      ponderacion: 25,
      criterios: [
        {
          id: 4,
          nombre: "Cumplimiento de Requerimientos",
          descripcion: "El sistema cumple con los requerimientos establecidos",
          materiaOrigen: "Ingeniería de Software",
          puntajeMax: 15,
        },
        {
          id: 5,
          nombre: "Innovación y Creatividad",
          descripcion: "Propuesta de valor y diferenciación del proyecto",
          materiaOrigen: "Taller de Innovación",
          puntajeMax: 10,
        },
      ]
    },
    {
      id: 3,
      nombre: "Documentación y Presentación",
      ponderacion: 20,
      criterios: [
        {
          id: 6,
          nombre: "Documentación Técnica",
          descripcion: "Manual técnico, diagramas y especificaciones",
          materiaOrigen: "Ingeniería de Software",
          puntajeMax: 10,
        },
        {
          id: 7,
          nombre: "Presentación Oral",
          descripcion: "Claridad, dominio del tema y comunicación efectiva",
          materiaOrigen: "Expresión Oral",
          puntajeMax: 10,
        },
      ]
    },
    {
      id: 4,
      nombre: "Gestión y Trabajo en Equipo",
      ponderacion: 15,
      criterios: [
        {
          id: 8,
          nombre: "Organización del Equipo",
          descripcion: "Distribución de tareas y cumplimiento de roles",
          materiaOrigen: "Gestión de Proyectos",
          puntajeMax: 8,
        },
        {
          id: 9,
          nombre: "Colaboración",
          descripcion: "Trabajo colaborativo y comunicación interna",
          materiaOrigen: "Gestión de Proyectos",
          puntajeMax: 7,
        },
      ]
    },
  ]
}

// Equipos para el profesor evaluador
const equiposParaEvaluar = [
  {
    id: 1,
    equipo: "Equipo Alpha",
    proyecto: "Sistema IoT para Agricultura",
    integrantes: ["Juan Pérez", "María García", "Carlos López", "Ana Martínez", "Pedro Sánchez"],
    lider: "Juan Pérez",
    carrera: "ISC",
    estado: "pendiente",
    fechaLimite: "2024-01-30",
  },
  {
    id: 2,
    equipo: "Equipo Beta",
    proyecto: "App de Gestión Escolar",
    integrantes: ["Laura Ramírez", "Diego Torres", "Sofia Hernández", "Miguel Flores"],
    lider: "Laura Ramírez",
    carrera: "ITI",
    estado: "pendiente",
    fechaLimite: "2024-01-30",
  },
  {
    id: 3,
    equipo: "Equipo Gamma",
    proyecto: "Plataforma E-learning",
    integrantes: ["Roberto Díaz", "Carmen Ruiz", "Fernando Vega", "Patricia Luna", "Andrés Castro"],
    lider: "Roberto Díaz",
    carrera: "ISC",
    estado: "evaluado",
    calificacion: 92,
    fechaLimite: "2024-01-30",
  },
]

// Evaluaciones para coordinadora (vista completa)
const evaluacionesCoordinadora = [
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
    rubrica: "Rúbrica Programación Web - P1",
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
]

const estadoConfig = {
  pendiente: { label: "Pendiente", className: "bg-amber-500/10 text-amber-500", icon: AlertCircle },
  "en-progreso": { label: "En Progreso", className: "bg-primary/10 text-primary", icon: Clock },
  completada: { label: "Completada", className: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
  evaluado: { label: "Evaluado", className: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
}

// Vista de evaluación para el Profesor - Solo rúbrica final
function ProfesorEvaluacionPage() {
  const [selectedEquipo, setSelectedEquipo] = useState<typeof equiposParaEvaluar[0] | null>(null)
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2, 3, 4])
  const [puntajes, setPuntajes] = useState<Record<number, number>>({})
  const [observaciones, setObservaciones] = useState<Record<number, string>>({})
  const [retroalimentacion, setRetroalimentacion] = useState({
    fortalezas: "",
    mejoras: "",
    recomendaciones: ""
  })

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const handlePuntajeChange = (criterioId: number, value: number[]) => {
    setPuntajes(prev => ({ ...prev, [criterioId]: value[0] }))
  }

  const handleObservacionChange = (criterioId: number, value: string) => {
    setObservaciones(prev => ({ ...prev, [criterioId]: value }))
  }

  const calcularTotalCategoria = (categoria: typeof rubricaGlobalPI.categorias[0]) => {
    const total = categoria.criterios.reduce((acc, c) => acc + (puntajes[c.id] || 0), 0)
    const max = categoria.criterios.reduce((acc, c) => acc + c.puntajeMax, 0)
    return { total, max }
  }

  const calcularTotalGeneral = () => {
    let total = 0
    let max = 0
    rubricaGlobalPI.categorias.forEach(cat => {
      cat.criterios.forEach(c => {
        total += puntajes[c.id] || 0
        max += c.puntajeMax
      })
    })
    return { total, max }
  }

  const openEvaluation = (equipo: typeof equiposParaEvaluar[0]) => {
    setSelectedEquipo(equipo)
    setPuntajes({})
    setObservaciones({})
    setRetroalimentacion({ fortalezas: "", mejoras: "", recomendaciones: "" })
    setIsEvaluationOpen(true)
  }

  const totales = calcularTotalGeneral()

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Evaluación Final del PI" 
        description="Evalúa los proyectos integradores con la rúbrica global"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos Asignados
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equiposParaEvaluar.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Por Evaluar
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposParaEvaluar.filter(e => e.estado === "pendiente").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Evaluados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposParaEvaluar.filter(e => e.estado === "evaluado").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de equipos */}
        <Card>
          <CardHeader>
            <CardTitle>Equipos a Evaluar</CardTitle>
            <CardDescription>
              Selecciona un equipo para aplicar la rúbrica global del PI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {equiposParaEvaluar.map((equipo) => {
              const config = estadoConfig[equipo.estado as keyof typeof estadoConfig]
              const StatusIcon = config.icon
              return (
                <div 
                  key={equipo.id} 
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      equipo.estado === "evaluado" ? "bg-emerald-500/10" : "bg-primary/10"
                    }`}>
                      <Users className={`h-6 w-6 ${
                        equipo.estado === "evaluado" ? "text-emerald-500" : "text-primary"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{equipo.equipo}</h3>
                        <Badge className={config.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {config.label}
                        </Badge>
                        <Badge variant="outline">{equipo.carrera}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{equipo.proyecto}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Líder: {equipo.lider} • {equipo.integrantes.length} integrantes • Límite: {equipo.fechaLimite}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {equipo.estado === "evaluado" && equipo.calificacion && (
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                          <span className="text-2xl font-bold">{equipo.calificacion}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Calificación</span>
                      </div>
                    )}
                    <Button 
                      onClick={() => openEvaluation(equipo)}
                      variant={equipo.estado === "evaluado" ? "outline" : "default"}
                    >
                      {equipo.estado === "evaluado" ? "Ver Evaluación" : "Evaluar"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Modal de Evaluación con Rúbrica Global */}
        <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Evaluación Final - Rúbrica Global del PI</DialogTitle>
              <DialogDescription>
                {selectedEquipo?.equipo} - {selectedEquipo?.proyecto}
              </DialogDescription>
            </DialogHeader>

            {/* Info del equipo */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Equipo</p>
                    <p className="font-medium">{selectedEquipo?.equipo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Líder</p>
                    <p className="font-medium">{selectedEquipo?.lider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Integrantes</p>
                    <p className="font-medium">{selectedEquipo?.integrantes.join(", ")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="criterios" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="criterios">Criterios de Evaluación</TabsTrigger>
                <TabsTrigger value="retroalimentacion">Retroalimentación</TabsTrigger>
              </TabsList>

              <TabsContent value="criterios" className="space-y-4 mt-4">
                {rubricaGlobalPI.categorias.map((categoria) => {
                  const isExpanded = expandedCategories.includes(categoria.id)
                  const { total, max } = calcularTotalCategoria(categoria)
                  return (
                    <Card key={categoria.id}>
                      <CardHeader 
                        className="cursor-pointer"
                        onClick={() => toggleCategory(categoria.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                              <CardTitle className="text-base">{categoria.nombre}</CardTitle>
                              <CardDescription>
                                Ponderación: {categoria.ponderacion}% • {categoria.criterios.length} criterios
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary">{total}</span>
                            <span className="text-muted-foreground">/{max}</span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="space-y-6 pt-0">
                          {categoria.criterios.map((criterio) => (
                            <div key={criterio.id} className="rounded-lg border p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{criterio.nombre}</p>
                                  <p className="text-sm text-muted-foreground">{criterio.descripcion}</p>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {criterio.materiaOrigen}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <span className="text-xl font-bold text-primary">
                                    {puntajes[criterio.id] || 0}
                                  </span>
                                  <span className="text-muted-foreground">/{criterio.puntajeMax}</span>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Puntaje</Label>
                                <Slider
                                  value={[puntajes[criterio.id] || 0]}
                                  max={criterio.puntajeMax}
                                  step={1}
                                  onValueChange={(value) => handlePuntajeChange(criterio.id, value)}
                                  className="mt-2"
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Observaciones</Label>
                                <Textarea
                                  placeholder="Comentarios específicos para este criterio..."
                                  value={observaciones[criterio.id] || ""}
                                  onChange={(e) => handleObservacionChange(criterio.id, e.target.value)}
                                  className="mt-1"
                                  rows={2}
                                />
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      )}
                    </Card>
                  )
                })}

                {/* Total General */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Calificación Final</h3>
                        <p className="text-sm text-muted-foreground">
                          Suma ponderada de todas las categorías
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold text-primary">{totales.total}</span>
                        <span className="text-xl text-muted-foreground">/{totales.max}</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Equivalente: {Math.round((totales.total / totales.max) * 100)}%
                        </p>
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
                      Proporciona comentarios constructivos para el equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Fortalezas del Proyecto</Label>
                      <Textarea
                        placeholder="Describe los puntos fuertes del proyecto..."
                        className="mt-2"
                        rows={3}
                        value={retroalimentacion.fortalezas}
                        onChange={(e) => setRetroalimentacion(prev => ({ ...prev, fortalezas: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Áreas de Mejora</Label>
                      <Textarea
                        placeholder="Indica aspectos que el equipo podría mejorar..."
                        className="mt-2"
                        rows={3}
                        value={retroalimentacion.mejoras}
                        onChange={(e) => setRetroalimentacion(prev => ({ ...prev, mejoras: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Recomendaciones</Label>
                      <Textarea
                        placeholder="Sugerencias para futuras iteraciones o proyectos..."
                        className="mt-2"
                        rows={3}
                        value={retroalimentacion.recomendaciones}
                        onChange={(e) => setRetroalimentacion(prev => ({ ...prev, recomendaciones: e.target.value }))}
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

// Vista de evaluaciones para la Coordinadora - Vista completa
function CoordinadoraEvaluacionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos")

  const filteredEvaluaciones = evaluacionesCoordinadora.filter((evaluacion) => {
    const matchesSearch = evaluacion.equipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluacion.proyecto.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEstado = filterEstado === "todos" || evaluacion.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Evaluaciones" 
        description="Supervisa todas las evaluaciones de proyectos integradores"
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
              <div className="text-2xl font-bold">{evaluacionesCoordinadora.length}</div>
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
                {evaluacionesCoordinadora.filter(e => e.estado === "pendiente").length}
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
                {evaluacionesCoordinadora.filter(e => e.estado === "en-progreso").length}
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
                {evaluacionesCoordinadora.filter(e => e.estado === "completada").length}
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

                      <Button variant="outline">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function EvaluacionesPage() {
  const { user } = useAuth()

  // Profesor solo ve la vista de evaluación final
  if (user?.role === "profesor") {
    return <ProfesorEvaluacionPage />
  }

  // Coordinadora ve la vista completa de supervisión
  return <CoordinadoraEvaluacionPage />
}
