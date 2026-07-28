import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import { getAllEvaluaciones } from "@/lib/evaluaciones/store"
import { getEquipoById } from "@/lib/equipos/store"
import { getAllRetroalimentaciones } from "@/lib/retroalimentacion/store"
import type { Evaluacion } from "@/lib/types/evaluacion"
import type { TrazabilidadFilters, TrazabilidadItem } from "@/lib/types/trazabilidad"

type EvaluacionConParcial = Evaluacion & {
  parcialId?: string
}

async function applyFilters(
  evaluacion: EvaluacionConParcial,
  filters: TrazabilidadFilters,
): Promise<boolean> {
  if (filters.materiaId) {
    const equipo = await getEquipoById(evaluacion.equipoId)
    if (equipo?.materiaId !== filters.materiaId) {
      return false
    }
  }

  if (filters.equipoId && evaluacion.equipoId !== filters.equipoId) {
    return false
  }

  if (filters.parcialId && evaluacion.parcialId !== filters.parcialId) {
    return false
  }

  const fechaInicio = parseDate(filters.fechaInicio)
  const fechaFin = parseDate(filters.fechaFin)
  const fechaEvaluacion = parseDate(evaluacion.createdAt)

  if (fechaInicio && fechaEvaluacion && fechaEvaluacion < fechaInicio) {
    return false
  }

  if (fechaFin && fechaEvaluacion && fechaEvaluacion > fechaFin) {
    return false
  }

  return true
}

function parseDate(value?: string): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function getTrazabilidad(
  filters: TrazabilidadFilters = {},
): Promise<TrazabilidadItem[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.evaluaciones)

  const evaluaciones = await getAllEvaluaciones()
  const retroalimentaciones = await getAllRetroalimentaciones()

  const filtradas = await Promise.all(
    evaluaciones.map(async (evaluacion) => {
      const matches = await applyFilters(evaluacion as EvaluacionConParcial, filters)
      return matches ? evaluacion : null
    }),
  )

  const trazabilidad = await Promise.all(
    filtradas
      .filter((evaluacion): evaluacion is Evaluacion => evaluacion !== null)
      .map(async (evaluacion) => {
        const equipo = await getEquipoById(evaluacion.equipoId)
        const retroalimentacion =
          retroalimentaciones.find(
            (item) =>
              item.evaluacionId === evaluacion.id && item.equipoId === evaluacion.equipoId,
          ) ?? null

        return {
          evaluacion,
          equipo,
          materia: equipo?.materia ?? null,
          retroalimentacion,
          createdAt: evaluacion.createdAt,
        }
      }),
  )

  return trazabilidad.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
