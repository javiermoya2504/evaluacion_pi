import type { Evaluacion } from "@/lib/types/evaluacion"
import type { EquipoWithRelations } from "@/lib/types/equipo"
import type { Materia } from "@/lib/types/materia"
import type { Retroalimentacion } from "@/lib/types/retroalimentacion"

export interface TrazabilidadFilters {
  materiaId?: string
  parcialId?: string
  equipoId?: string
  fechaInicio?: string
  fechaFin?: string
}

export interface TrazabilidadItem {
  evaluacion: Evaluacion
  equipo: EquipoWithRelations | null
  materia: Materia | null
  retroalimentacion: Retroalimentacion | null
  createdAt: string
}
