import type { Materia } from "@/lib/types/materia"
import type { AuthUser } from "@/lib/types/auth"

export interface Equipo {
  id: string
  nombre: string
  materiaId: string
  integranteIds: string[]
}

export interface EquipoWithRelations extends Equipo {
  materia?: Materia | null
  integrantes?: AuthUser[]
}
