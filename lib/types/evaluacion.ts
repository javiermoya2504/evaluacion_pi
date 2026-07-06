export interface EvaluacionCriterio {
  criterioId: string
  puntuacion: number
}

export interface Evaluacion {
  id: string
  equipoId: string
  rubricaId: string
  docenteId: string
  observaciones: string
  criterios: EvaluacionCriterio[]
  createdAt: string
}
