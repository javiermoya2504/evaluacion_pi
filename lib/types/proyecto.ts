export type ProyectoEstado = "planificacion" | "en-desarrollo" | "finalizado"

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  carrera: string
  periodo: string
  fechaInicio: string
  fechaFin: string
  estado: ProyectoEstado
  progreso: number
  createdAt: string
}
