"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Filter,
  ClipboardList,
  BookOpen,
  GraduationCap,
  Globe,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Layers,
  Target,
  Settings2
} from "lucide-react"

// Datos de materias disponibles
const materiasDisponibles = [
  { id: "prog-web", nombre: "Programación Web", carrera: "ISC" },
  { id: "bd", nombre: "Base de Datos", carrera: "ISC" },
  { id: "redes", nombre: "Redes de Computadoras", carrera: "ITI" },
  { id: "ing-soft", nombre: "Ingeniería de Software", carrera: "ISC" },
  { id: "sistemas-op", nombre: "Sistemas Operativos", carrera: "ISC/ITI" },
  { id: "seguridad", nombre: "Seguridad Informática", carrera: "ITI" },
]

// Rúbricas por materia/parcial
const rubricasMateria = [
  {
    id: 1,
    nombre: "Rúbrica Programación Web",
    materia: "Programación Web",
    materiaId: "prog-web",
    parcial: "2do Parcial",
    carrera: "ISC",
    criterios: [
      { id: 1, nombre: "Funcionalidad del código", descripcion: "El código cumple con los requerimientos funcionales", puntaje: 25 },
      { id: 2, nombre: "Diseño responsivo", descripcion: "La interfaz se adapta correctamente a diferentes dispositivos", puntaje: 20 },
      { id: 3, nombre: "Buenas prácticas", descripcion: "Uso de estándares y convenciones de código", puntaje: 20 },
      { id: 4, nombre: "Documentación", descripcion: "Código documentado y README completo", puntaje: 15 },
      { id: 5, nombre: "Creatividad", descripcion: "Soluciones innovadoras y valor agregado", puntaje: 20 },
    ],
    puntajeTotal: 100,
    estado: "activa",
    creador: "Mtra. Laura Martínez",
    fechaCreacion: "2024-01-15",
  },
  {
    id: 2,
    nombre: "Rúbrica Base de Datos",
    materia: "Base de Datos",
    materiaId: "bd",
    parcial: "3er Parcial",
    carrera: "ISC",
    criterios: [
      { id: 1, nombre: "Modelo E-R", descripcion: "Diseño correcto del modelo entidad-relación", puntaje: 20 },
      { id: 2, nombre: "Normalización", descripcion: "Base de datos normalizada hasta 3FN", puntaje: 20 },
      { id: 3, nombre: "Consultas SQL", descripcion: "Queries optimizados y funcionales", puntaje: 25 },
      { id: 4, nombre: "Integridad de datos", descripcion: "Restricciones y validaciones correctas", puntaje: 15 },
      { id: 5, nombre: "Procedimientos almacenados", descripcion: "Uso correcto de stored procedures", puntaje: 10 },
      { id: 6, nombre: "Documentación técnica", descripcion: "Diccionario de datos completo", puntaje: 10 },
    ],
    puntajeTotal: 100,
    estado: "activa",
    creador: "Dr. Roberto Sánchez",
    fechaCreacion: "2024-01-10",
  },
  {
    id: 3,
    nombre: "Rúbrica Redes",
    materia: "Redes de Computadoras",
    materiaId: "redes",
    parcial: "1er Parcial",
    carrera: "ITI",
    criterios: [
      { id: 1, nombre: "Diseño de red", descripcion: "Topología y arquitectura adecuada", puntaje: 30 },
      { id: 2, nombre: "Configuración", descripcion: "Configuración correcta de equipos", puntaje: 30 },
      { id: 3, nombre: "Seguridad", descripcion: "Implementación de medidas de seguridad", puntaje: 20 },
      { id: 4, nombre: "Documentación", descripcion: "Diagramas y manuales técnicos", puntaje: 20 },
    ],
    puntajeTotal: 100,
    estado: "borrador",
    creador: "Ing. Carlos Pérez",
    fechaCreacion: "2024-01-20",
  },
  {
    id: 4,
    nombre: "Rúbrica Ingeniería de Software",
    materia: "Ingeniería de Software",
    materiaId: "ing-soft",
    parcial: "2do Parcial",
    carrera: "ISC",
    criterios: [
      { id: 1, nombre: "Análisis de requerimientos", descripcion: "Documentación clara de requisitos", puntaje: 15 },
      { id: 2, nombre: "Diseño de arquitectura", descripcion: "Patrones y estructura del sistema", puntaje: 20 },
      { id: 3, nombre: "Implementación", descripcion: "Código funcional y limpio", puntaje: 20 },
      { id: 4, nombre: "Pruebas", descripcion: "Plan de pruebas y casos de test", puntaje: 15 },
      { id: 5, nombre: "Gestión del proyecto", descripcion: "Uso de metodologías ágiles", puntaje: 10 },
      { id: 6, nombre: "Presentación", descripcion: "Defensa y demostración del proyecto", puntaje: 10 },
      { id: 7, nombre: "Trabajo en equipo", descripcion: "Colaboración efectiva del equipo", puntaje: 10 },
    ],
    puntajeTotal: 100,
    estado: "activa",
    creador: "Dr. Ana García",
    fechaCreacion: "2024-01-05",
  },
]

// Rúbrica Global del PI
const rubricaGlobalPI = {
  id: "global-pi",
  nombre: "Rúbrica Global - Proyecto Integrador",
  descripcion: "Evaluación final que integra los criterios más importantes de cada materia participante en el Proyecto Integrador",
  carrera: "ISC/ITI",
  periodo: "2024-A",
  estado: "activa",
  creador: "Coordinación de Proyecto Integrador",
  fechaCreacion: "2024-01-01",
  categorias: [
    {
      id: "cat-1",
      nombre: "Desarrollo Técnico",
      peso: 40,
      descripcion: "Aspectos técnicos del desarrollo del proyecto",
      criterios: [
        { 
          id: "c1", 
          nombre: "Calidad del código", 
          descripcion: "Código limpio, documentado y siguiendo buenas prácticas",
          materiaOrigen: "Programación Web",
          peso: 15,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Código ejemplar con documentación completa", puntos: "15-13" },
            { nivel: 3, descripcion: "Bueno: Código bien estructurado con documentación adecuada", puntos: "12-10" },
            { nivel: 2, descripcion: "Regular: Código funcional pero con áreas de mejora", puntos: "9-7" },
            { nivel: 1, descripcion: "Deficiente: Código con problemas significativos", puntos: "6-0" },
          ]
        },
        { 
          id: "c2", 
          nombre: "Base de datos", 
          descripcion: "Diseño y optimización de la base de datos",
          materiaOrigen: "Base de Datos",
          peso: 15,
          niveles: [
            { nivel: 4, descripcion: "Excelente: BD normalizada, optimizada y bien documentada", puntos: "15-13" },
            { nivel: 3, descripcion: "Bueno: BD correctamente diseñada", puntos: "12-10" },
            { nivel: 2, descripcion: "Regular: BD funcional con algunas deficiencias", puntos: "9-7" },
            { nivel: 1, descripcion: "Deficiente: BD con problemas de diseño", puntos: "6-0" },
          ]
        },
        { 
          id: "c3", 
          nombre: "Arquitectura del sistema", 
          descripcion: "Estructura y patrones de diseño utilizados",
          materiaOrigen: "Ingeniería de Software",
          peso: 10,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Arquitectura sólida y escalable", puntos: "10-9" },
            { nivel: 3, descripcion: "Bueno: Arquitectura bien definida", puntos: "8-7" },
            { nivel: 2, descripcion: "Regular: Arquitectura básica pero funcional", puntos: "6-5" },
            { nivel: 1, descripcion: "Deficiente: Sin arquitectura clara", puntos: "4-0" },
          ]
        },
      ]
    },
    {
      id: "cat-2",
      nombre: "Funcionalidad e Innovación",
      peso: 25,
      descripcion: "Cumplimiento de requerimientos y valor agregado",
      criterios: [
        { 
          id: "c4", 
          nombre: "Cumplimiento de requerimientos", 
          descripcion: "El sistema cumple con todos los requisitos planteados",
          materiaOrigen: "Ingeniería de Software",
          peso: 15,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Supera los requerimientos", puntos: "15-13" },
            { nivel: 3, descripcion: "Bueno: Cumple todos los requerimientos", puntos: "12-10" },
            { nivel: 2, descripcion: "Regular: Cumple parcialmente", puntos: "9-7" },
            { nivel: 1, descripcion: "Deficiente: No cumple los requerimientos", puntos: "6-0" },
          ]
        },
        { 
          id: "c5", 
          nombre: "Innovación y creatividad", 
          descripcion: "Soluciones creativas y valor agregado al proyecto",
          materiaOrigen: "General",
          peso: 10,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Altamente innovador", puntos: "10-9" },
            { nivel: 3, descripcion: "Bueno: Incluye elementos creativos", puntos: "8-7" },
            { nivel: 2, descripcion: "Regular: Creatividad limitada", puntos: "6-5" },
            { nivel: 1, descripcion: "Deficiente: Sin innovación", puntos: "4-0" },
          ]
        },
      ]
    },
    {
      id: "cat-3",
      nombre: "Documentación y Presentación",
      peso: 20,
      descripcion: "Calidad de la documentación y exposición del proyecto",
      criterios: [
        { 
          id: "c6", 
          nombre: "Documentación técnica", 
          descripcion: "Manuales, diagramas y documentación del sistema",
          materiaOrigen: "Ingeniería de Software",
          peso: 10,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Documentación completa y profesional", puntos: "10-9" },
            { nivel: 3, descripcion: "Bueno: Documentación adecuada", puntos: "8-7" },
            { nivel: 2, descripcion: "Regular: Documentación básica", puntos: "6-5" },
            { nivel: 1, descripcion: "Deficiente: Documentación insuficiente", puntos: "4-0" },
          ]
        },
        { 
          id: "c7", 
          nombre: "Presentación y defensa", 
          descripcion: "Calidad de la exposición y dominio del tema",
          materiaOrigen: "General",
          peso: 10,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Presentación profesional con dominio total", puntos: "10-9" },
            { nivel: 3, descripcion: "Bueno: Buena presentación y conocimiento", puntos: "8-7" },
            { nivel: 2, descripcion: "Regular: Presentación aceptable", puntos: "6-5" },
            { nivel: 1, descripcion: "Deficiente: Presentación deficiente", puntos: "4-0" },
          ]
        },
      ]
    },
    {
      id: "cat-4",
      nombre: "Gestión y Trabajo en Equipo",
      peso: 15,
      descripcion: "Organización del equipo y metodología de trabajo",
      criterios: [
        { 
          id: "c8", 
          nombre: "Gestión del proyecto", 
          descripcion: "Uso de metodologías y herramientas de gestión",
          materiaOrigen: "Ingeniería de Software",
          peso: 8,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Gestión ejemplar del proyecto", puntos: "8-7" },
            { nivel: 3, descripcion: "Bueno: Buena gestión", puntos: "6-5" },
            { nivel: 2, descripcion: "Regular: Gestión básica", puntos: "4-3" },
            { nivel: 1, descripcion: "Deficiente: Sin gestión clara", puntos: "2-0" },
          ]
        },
        { 
          id: "c9", 
          nombre: "Colaboración del equipo", 
          descripcion: "Trabajo efectivo y distribución equitativa",
          materiaOrigen: "General",
          peso: 7,
          niveles: [
            { nivel: 4, descripcion: "Excelente: Equipo altamente colaborativo", puntos: "7-6" },
            { nivel: 3, descripcion: "Bueno: Buena colaboración", puntos: "5-4" },
            { nivel: 2, descripcion: "Regular: Colaboración limitada", puntos: "3-2" },
            { nivel: 1, descripcion: "Deficiente: Sin colaboración efectiva", puntos: "1-0" },
          ]
        },
      ]
    },
  ]
}

const estadoConfig = {
  activa: { label: "Activa", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  borrador: { label: "Borrador", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  archivada: { label: "Archivada", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
}

export default function RubricasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [filterParcial, setFilterParcial] = useState("todos")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isGlobalEditOpen, setIsGlobalEditOpen] = useState(false)
  const [selectedRubrica, setSelectedRubrica] = useState<typeof rubricasMateria[0] | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["cat-1"])
  const [activeTab, setActiveTab] = useState("materias")
  
  // Estado para crear nueva rúbrica
  const [nuevaRubrica, setNuevaRubrica] = useState({
    nombre: "",
    materia: "",
    parcial: "",
    carrera: "",
    descripcion: "",
    criterios: [
      { id: 1, nombre: "", descripcion: "", puntaje: 20 }
    ]
  })

  const filteredRubricas = rubricasMateria.filter((rubrica) => {
    const matchesSearch = rubrica.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubrica.materia.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCarrera = filterCarrera === "todas" || rubrica.carrera.includes(filterCarrera)
    const matchesParcial = filterParcial === "todos" || rubrica.parcial.includes(filterParcial)
    return matchesSearch && matchesCarrera && matchesParcial
  })

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const addCriterio = () => {
    setNuevaRubrica(prev => ({
      ...prev,
      criterios: [
        ...prev.criterios,
        { id: prev.criterios.length + 1, nombre: "", descripcion: "", puntaje: 20 }
      ]
    }))
  }

  const removeCriterio = (id: number) => {
    setNuevaRubrica(prev => ({
      ...prev,
      criterios: prev.criterios.filter(c => c.id !== id)
    }))
  }

  const updateCriterio = (id: number, field: string, value: string | number) => {
    setNuevaRubrica(prev => ({
      ...prev,
      criterios: prev.criterios.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }))
  }

  const totalPuntaje = nuevaRubrica.criterios.reduce((sum, c) => sum + c.puntaje, 0)

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Gestión de Rúbricas" 
        description="Crea y administra las rúbricas de evaluación académica"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rúbricas por Materia
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rubricasMateria.length}</div>
              <p className="text-xs text-muted-foreground">Por parcial</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rúbricas Activas
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rubricasMateria.filter(r => r.estado === "activa").length}
              </div>
              <p className="text-xs text-muted-foreground">Listas para evaluación</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Materias Cubiertas
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(rubricasMateria.map(r => r.materia)).size}
              </div>
              <p className="text-xs text-muted-foreground">Con rúbricas definidas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rúbrica Global PI
              </CardTitle>
              <Globe className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rubricaGlobalPI.categorias.length}</div>
              <p className="text-xs text-muted-foreground">Categorías de evaluación</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different rubric types */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="materias" className="gap-2">
              <FileText className="h-4 w-4" />
              Por Materia/Parcial
            </TabsTrigger>
            <TabsTrigger value="global" className="gap-2">
              <Globe className="h-4 w-4" />
              Rúbrica Global PI
            </TabsTrigger>
          </TabsList>

          {/* Tab: Rúbricas por Materia */}
          <TabsContent value="materias" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Rúbricas por Materia y Parcial</CardTitle>
                    <CardDescription>
                      Cada materia tiene su propia rúbrica por parcial con criterios específicos
                    </CardDescription>
                  </div>
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nueva Rúbrica
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Crear Rúbrica por Materia</DialogTitle>
                        <DialogDescription>
                          Define los criterios y puntajes para evaluar esta materia en el parcial seleccionado
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="grid gap-6 py-4">
                          {/* Información básica */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                              Información General
                            </h4>
                            <div className="grid gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre de la Rúbrica</Label>
                                <Input 
                                  id="nombre" 
                                  placeholder="Ej: Rúbrica Programación Web - 2do Parcial"
                                  value={nuevaRubrica.nombre}
                                  onChange={(e) => setNuevaRubrica(prev => ({ ...prev, nombre: e.target.value }))}
                                />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="materia">Materia</Label>
                                  <Select 
                                    value={nuevaRubrica.materia}
                                    onValueChange={(value) => setNuevaRubrica(prev => ({ ...prev, materia: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {materiasDisponibles.map(m => (
                                        <SelectItem key={m.id} value={m.id}>
                                          {m.nombre}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="parcial">Parcial</Label>
                                  <Select
                                    value={nuevaRubrica.parcial}
                                    onValueChange={(value) => setNuevaRubrica(prev => ({ ...prev, parcial: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1er Parcial</SelectItem>
                                      <SelectItem value="2">2do Parcial</SelectItem>
                                      <SelectItem value="3">3er Parcial</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="carrera">Carrera</Label>
                                  <Select
                                    value={nuevaRubrica.carrera}
                                    onValueChange={(value) => setNuevaRubrica(prev => ({ ...prev, carrera: value }))}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ISC">ISC</SelectItem>
                                      <SelectItem value="ITI">ITI</SelectItem>
                                      <SelectItem value="ISC/ITI">Ambas</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea 
                                  id="descripcion" 
                                  placeholder="Describe el propósito de esta rúbrica..."
                                  rows={2}
                                  value={nuevaRubrica.descripcion}
                                  onChange={(e) => setNuevaRubrica(prev => ({ ...prev, descripcion: e.target.value }))}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Criterios de evaluación */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                                  Criterios de Evaluación
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Puntaje total: <span className={totalPuntaje === 100 ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>{totalPuntaje}/100</span>
                                </p>
                              </div>
                              <Button variant="outline" size="sm" onClick={addCriterio} className="gap-1">
                                <Plus className="h-3 w-3" />
                                Agregar Criterio
                              </Button>
                            </div>
                            
                            <div className="space-y-3">
                              {nuevaRubrica.criterios.map((criterio, index) => (
                                <Card key={criterio.id} className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                                      {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-1">
                                          <Label className="text-xs">Nombre del criterio</Label>
                                          <Input 
                                            placeholder="Ej: Funcionalidad del código"
                                            value={criterio.nombre}
                                            onChange={(e) => updateCriterio(criterio.id, "nombre", e.target.value)}
                                          />
                                        </div>
                                        <div className="grid gap-1">
                                          <Label className="text-xs">Puntaje ({criterio.puntaje} pts)</Label>
                                          <Slider
                                            value={[criterio.puntaje]}
                                            onValueChange={([value]) => updateCriterio(criterio.id, "puntaje", value)}
                                            max={50}
                                            min={5}
                                            step={5}
                                            className="mt-2"
                                          />
                                        </div>
                                      </div>
                                      <div className="grid gap-1">
                                        <Label className="text-xs">Descripción</Label>
                                        <Input 
                                          placeholder="Describe qué se evalúa en este criterio"
                                          value={criterio.descripcion}
                                          onChange={(e) => updateCriterio(criterio.id, "descripcion", e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    {nuevaRubrica.criterios.length > 1 && (
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive shrink-0"
                                        onClick={() => removeCriterio(criterio.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>

                            {totalPuntaje !== 100 && (
                              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-amber-500 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                La suma de los puntajes debe ser 100. Actualmente: {totalPuntaje}
                              </div>
                            )}
                          </div>
                        </div>
                      </ScrollArea>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancelar
                        </Button>
                        <Button 
                          onClick={() => setIsCreateOpen(false)}
                          disabled={totalPuntaje !== 100}
                        >
                          Crear Rúbrica
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar rúbricas..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterParcial} onValueChange={setFilterParcial}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Parcial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="1er">1er Parcial</SelectItem>
                      <SelectItem value="2do">2do Parcial</SelectItem>
                      <SelectItem value="3er">3er Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterCarrera} onValueChange={setFilterCarrera}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="ISC">ISC</SelectItem>
                      <SelectItem value="ITI">ITI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Rúbrica</TableHead>
                        <TableHead>Materia</TableHead>
                        <TableHead>Parcial</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead className="text-center">Criterios</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRubricas.map((rubrica) => {
                        const config = estadoConfig[rubrica.estado as keyof typeof estadoConfig]
                        return (
                          <TableRow key={rubrica.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{rubrica.nombre}</p>
                                <p className="text-xs text-muted-foreground">{rubrica.creador}</p>
                              </div>
                            </TableCell>
                            <TableCell>{rubrica.materia}</TableCell>
                            <TableCell>{rubrica.parcial}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{rubrica.carrera}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{rubrica.criterios.length}</TableCell>
                            <TableCell>
                              <Badge className={config.className}>{config.label}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => {
                                    setSelectedRubrica(rubrica)
                                    setIsViewOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Dialog para ver rúbrica */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedRubrica?.nombre}</DialogTitle>
                  <DialogDescription>
                    {selectedRubrica?.materia} - {selectedRubrica?.parcial} | {selectedRubrica?.carrera}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="text-sm text-muted-foreground">
                    Creada por: {selectedRubrica?.creador} | Fecha: {selectedRubrica?.fechaCreacion}
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-medium">Criterios de Evaluación</h4>
                    {selectedRubrica?.criterios.map((criterio, index) => (
                      <div key={criterio.id} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{criterio.nombre}</p>
                            <Badge variant="secondary">{criterio.puntaje} pts</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{criterio.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2">
                    <div className="text-sm">
                      Puntaje Total: <span className="font-bold text-primary">{selectedRubrica?.puntajeTotal} pts</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tab: Rúbrica Global PI */}
          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{rubricaGlobalPI.nombre}</CardTitle>
                      <Badge className={estadoConfig.activa.className}>Activa</Badge>
                    </div>
                    <CardDescription>{rubricaGlobalPI.descripcion}</CardDescription>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>Período: {rubricaGlobalPI.periodo}</span>
                      <span>Carreras: {rubricaGlobalPI.carrera}</span>
                      <span>Creada: {rubricaGlobalPI.fechaCreacion}</span>
                    </div>
                  </div>
                  <Dialog open={isGlobalEditOpen} onOpenChange={setIsGlobalEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Settings2 className="h-4 w-4" />
                        Editar Rúbrica Global
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Editar Rúbrica Global del PI</DialogTitle>
                        <DialogDescription>
                          Modifica las categorías, criterios y ponderaciones de la evaluación final
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-6 py-4">
                          {rubricaGlobalPI.categorias.map((categoria) => (
                            <Card key={categoria.id}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                      <Layers className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <Input 
                                        className="font-semibold text-base h-8 w-64" 
                                        defaultValue={categoria.nombre}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">{categoria.descripcion}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label className="text-xs text-muted-foreground">Peso:</Label>
                                    <Input 
                                      type="number" 
                                      className="w-16 h-8 text-center" 
                                      defaultValue={categoria.peso}
                                    />
                                    <span className="text-xs text-muted-foreground">%</span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {categoria.criterios.map((criterio) => (
                                  <div key={criterio.id} className="flex items-center gap-4 rounded-lg border p-3 bg-muted/30">
                                    <div className="flex-1">
                                      <Input 
                                        className="font-medium h-7 text-sm" 
                                        defaultValue={criterio.nombre}
                                      />
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Origen: {criterio.materiaOrigen}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        type="number" 
                                        className="w-14 h-7 text-center text-sm" 
                                        defaultValue={criterio.peso}
                                      />
                                      <span className="text-xs text-muted-foreground">pts</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full gap-1 mt-2">
                                  <Plus className="h-3 w-3" />
                                  Agregar Criterio
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                          <Button variant="outline" className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            Agregar Nueva Categoría
                          </Button>
                        </div>
                      </ScrollArea>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGlobalEditOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setIsGlobalEditOpen(false)}>
                          Guardar Cambios
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Resumen de pesos */}
                <div className="mb-6 grid gap-2 sm:grid-cols-4">
                  {rubricaGlobalPI.categorias.map((categoria) => (
                    <div key={categoria.id} className="rounded-lg border p-3 bg-muted/30">
                      <p className="text-xs text-muted-foreground">{categoria.nombre}</p>
                      <p className="text-xl font-bold text-primary">{categoria.peso}%</p>
                    </div>
                  ))}
                </div>

                {/* Categorías expandibles */}
                <div className="space-y-4">
                  {rubricaGlobalPI.categorias.map((categoria) => (
                    <Card key={categoria.id} className="overflow-hidden">
                      <button
                        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        onClick={() => toggleCategory(categoria.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{categoria.nombre}</h3>
                            <p className="text-sm text-muted-foreground">{categoria.descripcion}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-base">
                            {categoria.peso}%
                          </Badge>
                          {expandedCategories.includes(categoria.id) ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      
                      {expandedCategories.includes(categoria.id) && (
                        <div className="border-t bg-muted/20 p-4">
                          <div className="space-y-4">
                            {categoria.criterios.map((criterio) => (
                              <div key={criterio.id} className="rounded-lg border bg-background p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{criterio.nombre}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        {criterio.materiaOrigen}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {criterio.descripcion}
                                    </p>
                                  </div>
                                  <Badge className="bg-primary/10 text-primary border-primary/20">
                                    {criterio.peso} pts
                                  </Badge>
                                </div>
                                
                                {/* Niveles de desempeño */}
                                <div className="grid gap-2 sm:grid-cols-4">
                                  {criterio.niveles.map((nivel) => (
                                    <div 
                                      key={nivel.nivel} 
                                      className={`rounded-md border p-2 text-xs ${
                                        nivel.nivel === 4 ? 'bg-emerald-500/5 border-emerald-500/20' :
                                        nivel.nivel === 3 ? 'bg-blue-500/5 border-blue-500/20' :
                                        nivel.nivel === 2 ? 'bg-amber-500/5 border-amber-500/20' :
                                        'bg-red-500/5 border-red-500/20'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">Nivel {nivel.nivel}</span>
                                        <span className="text-muted-foreground">{nivel.puntos}</span>
                                      </div>
                                      <p className="text-muted-foreground leading-relaxed">
                                        {nivel.descripcion}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 flex items-center justify-between rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <div>
                    <p className="text-sm text-muted-foreground">Puntaje Total de la Rúbrica Global</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Suma de todos los criterios: {rubricaGlobalPI.categorias.reduce((sum, cat) => 
                        sum + cat.criterios.reduce((s, c) => s + c.peso, 0), 0
                      )} puntos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">100%</p>
                    <p className="text-xs text-muted-foreground">
                      {rubricaGlobalPI.categorias.reduce((sum, cat) => sum + cat.criterios.length, 0)} criterios totales
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
