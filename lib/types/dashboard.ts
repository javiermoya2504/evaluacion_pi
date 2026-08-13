export interface DashboardSummary {
  proyectos: number
  proyectosEnDesarrollo: number
  proyectosFinalizados: number
  avancePromedio: number
  equipos: number
  evaluaciones: number
  equiposEvaluados: number
  rubricas: number
  criterios: number
  rubricasCompletas: number
  retroalimentaciones: number
}

export interface DashboardProject {
  id: string
  nombre: string
  estado: string
  progreso: number
  carrera: string
}

export interface DashboardData {
  summary: DashboardSummary
  proyectos: DashboardProject[]
  updatedAt: string
}
