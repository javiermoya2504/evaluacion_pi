"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  Filter,
  BookOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit
} from "lucide-react"

const proyectosData = [
  {
    id: 1,
    nombre: "Sistema IoT para Agricultura",
    descripcion: "Desarrollo de un sistema de monitoreo agrícola utilizando sensores IoT y análisis de datos en tiempo real",
    carrera: "ISC",
    semestre: "2024-1",
    fechaInicio: "2024-01-15",
    fechaFin: "2024-06-15",
    estado: "en-desarrollo",
    progreso: 65,
    equipos: 3,
    evaluaciones: 8,
  },
  {
    id: 2,
    nombre: "App de Gestión Escolar",
    descripcion: "Aplicación móvil para la gestión de actividades escolares, calificaciones y comunicación padre-maestro",
    carrera: "ITI",
    semestre: "2024-1",
    fechaInicio: "2024-01-10",
    fechaFin: "2024-06-10",
    estado: "en-desarrollo",
    progreso: 45,
    equipos: 2,
    evaluaciones: 4,
  },
  {
    id: 3,
    nombre: "Plataforma E-learning",
    descripcion: "Sistema de aprendizaje en línea con cursos interactivos, evaluaciones automatizadas y seguimiento de progreso",
    carrera: "ISC",
    semestre: "2023-2",
    fechaInicio: "2023-08-15",
    fechaFin: "2023-12-15",
    estado: "finalizado",
    progreso: 100,
    equipos: 4,
    evaluaciones: 16,
  },
  {
    id: 4,
    nombre: "Sistema de Inventarios",
    descripcion: "Sistema web para control de inventarios con código de barras, alertas de stock y reportes automatizados",
    carrera: "ITI",
    semestre: "2024-1",
    fechaInicio: "2024-02-01",
    fechaFin: "2024-06-30",
    estado: "planificacion",
    progreso: 15,
    equipos: 2,
    evaluaciones: 0,
  },
  {
    id: 5,
    nombre: "Sistema de Facturación Electrónica",
    descripcion: "Plataforma de facturación electrónica conforme a las regulaciones del SAT con timbrado CFDI",
    carrera: "ISC",
    semestre: "2024-1",
    fechaInicio: "2024-01-20",
    fechaFin: "2024-06-20",
    estado: "en-desarrollo",
    progreso: 55,
    equipos: 2,
    evaluaciones: 6,
  },
]

const estadoConfig = {
  "planificacion": { label: "Planificación", className: "bg-amber-500/10 text-amber-500", icon: Clock },
  "en-desarrollo": { label: "En Desarrollo", className: "bg-primary/10 text-primary", icon: AlertCircle },
  "finalizado": { label: "Finalizado", className: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
}

export default function ProyectosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [filterEstado, setFilterEstado] = useState("todos")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredProyectos = proyectosData.filter((proyecto) => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proyecto.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCarrera = filterCarrera === "todas" || proyecto.carrera === filterCarrera
    const matchesEstado = filterEstado === "todos" || proyecto.estado === filterEstado
    return matchesSearch && matchesCarrera && matchesEstado
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Proyectos Integradores" 
        description="Gestiona los proyectos integradores de las carreras"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Proyectos
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{proyectosData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En Desarrollo
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {proyectosData.filter(p => p.estado === "en-desarrollo").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Finalizados
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {proyectosData.filter(p => p.estado === "finalizado").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos Activos
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {proyectosData.reduce((acc, p) => acc + p.equipos, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCarrera} onValueChange={setFilterCarrera}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="ISC">ISC</SelectItem>
                <SelectItem value="ITI">ITI</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="planificacion">Planificación</SelectItem>
                <SelectItem value="en-desarrollo">En Desarrollo</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto Integrador</DialogTitle>
                <DialogDescription>
                  Define la información del nuevo proyecto integrador
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre del Proyecto</Label>
                  <Input placeholder="Ej: Sistema de Gestión..." />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Textarea placeholder="Describe el objetivo y alcance del proyecto..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Carrera</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ISC">ISC</SelectItem>
                        <SelectItem value="ITI">ITI</SelectItem>
                        <SelectItem value="ambas">Ambas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Semestre</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-1">2024-1</SelectItem>
                        <SelectItem value="2024-2">2024-2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fecha de Inicio</Label>
                    <Input type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fecha de Fin</Label>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Crear Proyecto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProyectos.map((proyecto) => {
            const config = estadoConfig[proyecto.estado as keyof typeof estadoConfig]
            const StatusIcon = config.icon
            return (
              <Card key={proyecto.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={config.className}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {config.label}
                    </Badge>
                    <Badge variant="outline">{proyecto.carrera}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{proyecto.nombre}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {proyecto.descripcion}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{proyecto.fechaInicio} - {proyecto.fechaFin}</span>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{proyecto.progreso}%</span>
                    </div>
                    <Progress value={proyecto.progreso} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{proyecto.equipos} equipos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span>{proyecto.evaluaciones} evaluaciones</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                    <Button size="sm" className="flex-1 gap-1">
                      <Edit className="h-4 w-4" />
                      Editar
                    </Button>
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
