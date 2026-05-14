"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowRight, Clock, CheckCircle2, AlertCircle, Users } from "lucide-react"
import Link from "next/link"

const proyectosRecientes = [
  {
    id: 1,
    nombre: "Sistema IoT para Agricultura",
    equipo: "Equipo Alpha",
    carrera: "ISC",
    estado: "en-evaluacion",
    progreso: 75,
    lider: "Carlos Méndez",
  },
  {
    id: 2,
    nombre: "App de Gestión Escolar",
    equipo: "Equipo Beta",
    carrera: "ITI",
    estado: "pendiente",
    progreso: 45,
    lider: "María López",
  },
  {
    id: 3,
    nombre: "Plataforma E-learning",
    equipo: "Equipo Gamma",
    carrera: "ISC",
    estado: "completado",
    progreso: 100,
    lider: "Juan Pérez",
  },
  {
    id: 4,
    nombre: "Sistema de Inventarios",
    equipo: "Equipo Delta",
    carrera: "ITI",
    estado: "en-evaluacion",
    progreso: 60,
    lider: "Ana García",
  },
]

const actividadReciente = [
  {
    id: 1,
    tipo: "evaluacion",
    mensaje: "Evaluación completada para Equipo Alpha",
    tiempo: "Hace 2 horas",
    usuario: "Dr. Roberto Sánchez",
  },
  {
    id: 2,
    tipo: "rubrica",
    mensaje: "Nueva rúbrica creada: Programación Web",
    tiempo: "Hace 5 horas",
    usuario: "Mtra. Laura Martínez",
  },
  {
    id: 3,
    tipo: "equipo",
    mensaje: "Equipo Epsilon registrado exitosamente",
    tiempo: "Hace 1 día",
    usuario: "Admin",
  },
  {
    id: 4,
    tipo: "notificacion",
    mensaje: "Calificaciones enviadas a 12 estudiantes",
    tiempo: "Hace 2 días",
    usuario: "Sistema",
  },
]

const estadoConfig = {
  "en-evaluacion": { label: "En Evaluación", variant: "default" as const, icon: Clock },
  "pendiente": { label: "Pendiente", variant: "secondary" as const, icon: AlertCircle },
  "completado": { label: "Completado", variant: "outline" as const, icon: CheckCircle2 },
}

export function ProyectosRecientes() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Proyectos Recientes</CardTitle>
          <CardDescription>Últimos proyectos integradores</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/proyectos" className="gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proyectosRecientes.map((proyecto) => {
            const config = estadoConfig[proyecto.estado as keyof typeof estadoConfig]
            return (
              <div
                key={proyecto.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{proyecto.nombre}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{proyecto.equipo}</span>
                      <span>•</span>
                      <span>{proyecto.carrera}</span>
                      <span>•</span>
                      <span>{proyecto.lider}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block">
                    <div className="mb-1 text-right text-xs text-muted-foreground">
                      Progreso
                    </div>
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${proyecto.progreso}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant={config.variant} className="gap-1">
                    <config.icon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function ActividadReciente() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actividadReciente.map((actividad) => (
            <div key={actividad.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {actividad.usuario
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">{actividad.mensaje}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{actividad.usuario}</span>
                  <span>•</span>
                  <span>{actividad.tiempo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
