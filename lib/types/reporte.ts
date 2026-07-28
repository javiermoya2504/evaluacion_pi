import type { Evaluacion } from "@/lib/types/evaluacion"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { Retroalimentacion } from "@/lib/types/retroalimentacion"
import type { Rubrica } from "@/lib/types/rubrica"

export interface ReporteEvaluacionDetalle {
  evaluacion: Evaluacion
  rubrica: Rubrica | null
  retroalimentacion: Retroalimentacion | null
  calificacion: number
  ponderacion: number
  fecha: string
}

export interface ReporteEquipo {
  equipo: EquipoWithRelations | null
  evaluaciones: ReporteEvaluacionDetalle[]
  promedioFinal: number
  calificacionPonderada: number
  retroalimentaciones: Retroalimentacion[]
  fechaCreacion: string
}
