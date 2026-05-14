"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Mail,
  Phone,
  User,
  BookOpen
} from "lucide-react"

const equiposData = [
  {
    id: 1,
    nombre: "Equipo Alpha",
    proyecto: "Sistema IoT para Agricultura",
    carrera: "ISC",
    semestre: "7mo",
    lider: { nombre: "Carlos Méndez", email: "carlos@universidad.edu", matricula: "20190001" },
    integrantes: [
      { nombre: "María López", email: "maria@universidad.edu", matricula: "20190002" },
      { nombre: "Juan Pérez", email: "juan@universidad.edu", matricula: "20190003" },
      { nombre: "Ana García", email: "ana@universidad.edu", matricula: "20190004" },
    ],
    estado: "activo",
    evaluaciones: 3,
    promedioActual: 87.5,
  },
  {
    id: 2,
    nombre: "Equipo Beta",
    proyecto: "App de Gestión Escolar",
    carrera: "ITI",
    semestre: "6to",
    lider: { nombre: "Laura Martínez", email: "laura@universidad.edu", matricula: "20200001" },
    integrantes: [
      { nombre: "Pedro Sánchez", email: "pedro@universidad.edu", matricula: "20200002" },
      { nombre: "Rosa Díaz", email: "rosa@universidad.edu", matricula: "20200003" },
    ],
    estado: "activo",
    evaluaciones: 2,
    promedioActual: 92.0,
  },
  {
    id: 3,
    nombre: "Equipo Gamma",
    proyecto: "Plataforma E-learning",
    carrera: "ISC",
    semestre: "8vo",
    lider: { nombre: "Roberto Hernández", email: "roberto@universidad.edu", matricula: "20180001" },
    integrantes: [
      { nombre: "Sofía Ruiz", email: "sofia@universidad.edu", matricula: "20180002" },
      { nombre: "Diego Torres", email: "diego@universidad.edu", matricula: "20180003" },
      { nombre: "Carmen Flores", email: "carmen@universidad.edu", matricula: "20180004" },
      { nombre: "Luis Morales", email: "luis@universidad.edu", matricula: "20180005" },
    ],
    estado: "finalizado",
    evaluaciones: 5,
    promedioActual: 95.2,
  },
  {
    id: 4,
    nombre: "Equipo Delta",
    proyecto: "Sistema de Inventarios",
    carrera: "ITI",
    semestre: "7mo",
    lider: { nombre: "Andrea Vega", email: "andrea@universidad.edu", matricula: "20190005" },
    integrantes: [
      { nombre: "Miguel Castillo", email: "miguel@universidad.edu", matricula: "20190006" },
      { nombre: "Patricia Luna", email: "patricia@universidad.edu", matricula: "20190007" },
    ],
    estado: "activo",
    evaluaciones: 2,
    promedioActual: 78.3,
  },
]

const estadoConfig = {
  activo: { label: "Activo", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  pendiente: { label: "Pendiente", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  finalizado: { label: "Finalizado", className: "bg-primary/10 text-primary border-primary/20" },
}

export default function EquiposPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedEquipo, setSelectedEquipo] = useState<typeof equiposData[0] | null>(null)

  const filteredEquipos = equiposData.filter((equipo) => {
    const matchesSearch = equipo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipo.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipo.lider.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCarrera = filterCarrera === "todas" || equipo.carrera === filterCarrera
    return matchesSearch && matchesCarrera
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Gestión de Equipos" 
        description="Administra los equipos de proyectos integradores"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Equipos
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{equiposData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos Activos
              </CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposData.filter(e => e.estado === "activo").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Estudiantes
              </CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {equiposData.reduce((acc, e) => acc + e.integrantes.length + 1, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Promedio General
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(equiposData.reduce((acc, e) => acc + e.promedioActual, 0) / equiposData.length).toFixed(1)}
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
                placeholder="Buscar equipos..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterCarrera} onValueChange={setFilterCarrera}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Carrera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="ISC">ISC</SelectItem>
                <SelectItem value="ITI">ITI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Equipo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Equipo</DialogTitle>
                <DialogDescription>
                  Ingresa la información del nuevo equipo de proyecto integrador
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Nombre del Equipo</Label>
                  <Input placeholder="Ej: Equipo Epsilon" />
                </div>
                <div className="grid gap-2">
                  <Label>Nombre del Proyecto</Label>
                  <Input placeholder="Ej: Sistema de Gestión..." />
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
                        <SelectItem value="5">5to Semestre</SelectItem>
                        <SelectItem value="6">6to Semestre</SelectItem>
                        <SelectItem value="7">7mo Semestre</SelectItem>
                        <SelectItem value="8">8vo Semestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Email del Líder</Label>
                  <Input type="email" placeholder="lider@universidad.edu" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Registrar Equipo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredEquipos.map((equipo) => {
            const config = estadoConfig[equipo.estado as keyof typeof estadoConfig]
            return (
              <Card key={equipo.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                      <CardDescription className="mt-1">{equipo.proyecto}</CardDescription>
                    </div>
                    <Badge className={config.className}>{config.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="outline">{equipo.carrera}</Badge>
                    <span className="text-muted-foreground">{equipo.semestre} Semestre</span>
                  </div>

                  {/* Leader */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Líder del Equipo
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {equipo.lider.nombre.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{equipo.lider.nombre}</p>
                        <p className="text-xs text-muted-foreground">{equipo.lider.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                      Integrantes ({equipo.integrantes.length})
                    </p>
                    <div className="flex -space-x-2">
                      {equipo.integrantes.map((integrante, idx) => (
                        <Avatar key={idx} className="h-8 w-8 border-2 border-background">
                          <AvatarFallback className="bg-secondary text-xs">
                            {integrante.nombre.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-2xl font-bold text-primary">{equipo.promedioActual}</p>
                      <p className="text-xs text-muted-foreground">Promedio actual</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{equipo.evaluaciones}</p>
                      <p className="text-xs text-muted-foreground">Evaluaciones</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Button size="sm" className="flex-1 gap-2">
                      <Edit className="h-4 w-4" />
                      Evaluar
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
