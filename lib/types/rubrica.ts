export interface CriterioRubrica {
  nombre: string
  porcentaje: number
}

export interface Rubrica {
  id: string
  nombre: string
  descripcion: string
  criterios: CriterioRubrica[]
  totalPorcentaje: number
  createdAt: string
}
