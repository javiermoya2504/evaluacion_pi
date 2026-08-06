import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import { getEquipoById } from "@/lib/equipos/store"
import { getAllEvaluaciones } from "@/lib/evaluaciones/store"
import { getAllRetroalimentaciones } from "@/lib/retroalimentacion/store"
import { getAllRubricas } from "@/lib/rubricas/store"
import type { ReporteEquipo, ReporteEvaluacionDetalle } from "@/lib/types/reporte"

function calculateCalificacion(
  evaluacion: { criterios: Array<{ puntuacion: number }> },
  rubrica: { criterios?: Array<{ porcentaje: number }> } | null,
): number {
  if (!evaluacion.criterios.length) {
    return 0
  }

  if (!rubrica?.criterios?.length) {
    const average =
      evaluacion.criterios.reduce((sum, criterio) => sum + criterio.puntuacion, 0) /
      evaluacion.criterios.length

    return Number(average.toFixed(2))
  }

  const totalPonderado = rubrica.criterios.reduce(
    (sum, criterio) => sum + criterio.porcentaje,
    0,
  )

  if (totalPonderado <= 0) {
    const average =
      evaluacion.criterios.reduce((sum, criterio) => sum + criterio.puntuacion, 0) /
      evaluacion.criterios.length

    return Number(average.toFixed(2))
  }

  const weighted = evaluacion.criterios.reduce((sum, criterio, index) => {
    const rubricaCriterio = rubrica.criterios?.[index]
    const porcentaje = rubricaCriterio?.porcentaje ?? 0

    return sum + criterio.puntuacion * (porcentaje / 100)
  }, 0)

  return Number(weighted.toFixed(2))
}

export async function getReporteEquipo(equipoId: string): Promise<ReporteEquipo | null> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.equipos)

  const equipo = await getEquipoById(equipoId)

  if (!equipo) {
    return null
  }

  const evaluaciones = await getAllEvaluaciones()
  const retroalimentaciones = await getAllRetroalimentaciones()
  const rubricas = await getAllRubricas()

  const evaluacionesDelEquipo = evaluaciones
    .filter((evaluacion) => evaluacion.equipoId === equipoId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const detalles: ReporteEvaluacionDetalle[] = evaluacionesDelEquipo.map((evaluacion) => {
    const rubrica = rubricas.find((item) => item.id === evaluacion.rubricaId) ?? null
    const calificacion = calculateCalificacion(evaluacion, rubrica)
    const ponderacion = rubrica?.totalPorcentaje ?? 100

    return {
      evaluacion,
      rubrica,
      retroalimentacion:
        retroalimentaciones.find(
          (item) =>
            item.evaluacionId === evaluacion.id && item.equipoId === evaluacion.equipoId,
        ) ?? null,
      calificacion,
      ponderacion,
      fecha: evaluacion.createdAt,
    }
  })

  const promedioFinal =
    detalles.length > 0
      ? Number(
          (
            detalles.reduce((sum, item) => sum + item.calificacion, 0) / detalles.length
          ).toFixed(2),
        )
      : 0

  const totalPonderacion = detalles.reduce((sum, item) => sum + item.ponderacion, 0)
  const calificacionPonderada =
    totalPonderacion > 0
      ? Number(
          (
            detalles.reduce(
              (sum, item) => sum + item.calificacion * (item.ponderacion / 100),
              0,
            ) / (totalPonderacion / 100)
          ).toFixed(2),
        )
      : promedioFinal

  return {
    equipo,
    evaluaciones: detalles,
    promedioFinal,
    calificacionPonderada,
    retroalimentaciones: retroalimentaciones.filter(
      (item) => item.equipoId === equipoId,
    ),
    fechaCreacion: new Date().toISOString(),
  }
}
