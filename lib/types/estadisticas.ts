export interface EstadisticaMateria {
  materiaId: string
  nombreMateria: string
  totalEquiposEvaluados: number
  totalEvaluaciones: number
  promedioGeneral: number
  calificacionMaxima: number
  calificacionMinima: number
}

export interface EstadisticasMateriasResponse {
  materias: EstadisticaMateria[]
}
