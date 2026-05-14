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
  GraduationCap
} from "lucide-react"

const rubricasData = [
  {
    id: 1,
    nombre: "Rúbrica Programación Web",
    materia: "Programación Web",
    parcial: "2do Parcial",
    carrera: "ISC",
    criterios: 5,
    puntajeTotal: 100,
    estado: "activa",
    creador: "Mtra. Laura Martínez",
    fechaCreacion: "2024-01-15",
  },
  {
    id: 2,
    nombre: "Rúbrica Base de Datos",
    materia: "Base de Datos",
    parcial: "3er Parcial",
    carrera: "ISC",
    criterios: 6,
    puntajeTotal: 100,
    estado: "activa",
    creador: "Dr. Roberto Sánchez",
    fechaCreacion: "2024-01-10",
  },
  {
    id: 3,
    nombre: "Rúbrica Redes",
    materia: "Redes de Computadoras",
    parcial: "1er Parcial",
    carrera: "ITI",
    criterios: 4,
    puntajeTotal: 100,
    estado: "borrador",
    creador: "Ing. Carlos Pérez",
    fechaCreacion: "2024-01-20",
  },
  {
    id: 4,
    nombre: "Rúbrica Ingeniería de Software",
    materia: "Ingeniería de Software",
    parcial: "2do Parcial",
    carrera: "ISC",
    criterios: 7,
    puntajeTotal: 100,
    estado: "activa",
    creador: "Dr. Ana García",
    fechaCreacion: "2024-01-05",
  },
  {
    id: 5,
    nombre: "Rúbrica Global PI",
    materia: "Proyecto Integrador",
    parcial: "Final",
    carrera: "ISC/ITI",
    criterios: 10,
    puntajeTotal: 100,
    estado: "activa",
    creador: "Coordinación PI",
    fechaCreacion: "2024-01-01",
  },
]

const estadoConfig = {
  activa: { label: "Activa", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  borrador: { label: "Borrador", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  archivada: { label: "Archivada", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
}

export default function RubricasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCarrera, setFilterCarrera] = useState("todas")
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredRubricas = rubricasData.filter((rubrica) => {
    const matchesSearch = rubrica.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rubrica.materia.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCarrera = filterCarrera === "todas" || rubrica.carrera.includes(filterCarrera)
    return matchesSearch && matchesCarrera
  })

  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Gestión de Rúbricas" 
        description="Crea y administra las rúbricas de evaluación académica"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rúbricas
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rubricasData.length}</div>
              <p className="text-xs text-muted-foreground">Rúbricas registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rúbricas Activas
              </CardTitle>
              <BookOpen className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rubricasData.filter(r => r.estado === "activa").length}
              </div>
              <p className="text-xs text-muted-foreground">Listas para evaluación</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Materias Cubiertas
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(rubricasData.map(r => r.materia)).size}
              </div>
              <p className="text-xs text-muted-foreground">Materias con rúbricas</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Rúbricas Académicas</CardTitle>
                <CardDescription>
                  Administra las rúbricas de evaluación por materia y parcial
                </CardDescription>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Rúbrica
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Rúbrica</DialogTitle>
                    <DialogDescription>
                      Define los criterios y puntajes para la nueva rúbrica de evaluación
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nombre">Nombre de la Rúbrica</Label>
                      <Input id="nombre" placeholder="Ej: Rúbrica Programación Web" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="materia">Materia</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar materia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prog-web">Programación Web</SelectItem>
                            <SelectItem value="bd">Base de Datos</SelectItem>
                            <SelectItem value="redes">Redes de Computadoras</SelectItem>
                            <SelectItem value="ing-soft">Ingeniería de Software</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="parcial">Parcial</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar parcial" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1er Parcial</SelectItem>
                            <SelectItem value="2">2do Parcial</SelectItem>
                            <SelectItem value="3">3er Parcial</SelectItem>
                            <SelectItem value="final">Evaluación Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="carrera">Carrera</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ISC">Ing. en Sistemas Computacionales</SelectItem>
                          <SelectItem value="ITI">Ing. en Tecnologías de la Información</SelectItem>
                          <SelectItem value="ambas">Ambas carreras</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea 
                        id="descripcion" 
                        placeholder="Describe el propósito y alcance de esta rúbrica..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsCreateOpen(false)}>
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
              <Select value={filterCarrera} onValueChange={setFilterCarrera}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar carrera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las carreras</SelectItem>
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
                        <TableCell className="text-center">{rubrica.criterios}</TableCell>
                        <TableCell>
                          <Badge className={config.className}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </div>
    </div>
  )
}
