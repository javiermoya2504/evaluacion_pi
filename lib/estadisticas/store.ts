import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import { getAllEquipos } from "@/lib/equipos/store"
import { getAllMaterias } from "@/lib/materias/store"
import { getReporteEquipo } from "@/lib/reportes/store"
import type { EstadisticaMateria } from "@/lib/types/estadisticas"

type EquipoConCalificaciones = {
  equipoId: string
  calificaciones: number[]
}

export async function getEstadisticasMaterias(): Promise<EstadisticaMateria[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.materias)
  cacheTag(CACHE_TAGS.equipos)
  cacheTag(CACHE_TAGS.evaluaciones)

  const materias = await getAllMaterias()
  const equipos = await getAllEquipos()

  const resultados = await Promise.all(
    materias.map(async (materia) => {
      const equiposMateria = equipos.filter((equipo) => equipo.materiaId === materia.id)

      const equiposEvaluados = (
        await Promise.all(
          equiposMateria.map(async (equipo) => {
            const reporte = await getReporteEquipo(equipo.id)

            if (!reporte || reporte.evaluaciones.length === 0) {
              return null
            }

            return {
              equipoId: equipo.id,
              calificaciones: reporte.evaluaciones.map((item) => item.calificacion),
            } satisfies EquipoConCalificaciones
          }),
        )
      ).filter((item): item is EquipoConCalificaciones => item !== null)

      const calificaciones = equiposEvaluados.flatMap((equipo) => equipo.calificaciones)

      const promedioGeneral =
        calificaciones.length > 0
          ? Number(
              (
                calificaciones.reduce((sum, calificacion) => sum + calificacion, 0) /
                calificaciones.length
              ).toFixed(2),
            )
          : 0

      const calificacionMaxima = calificaciones.length > 0 ? Math.max(...calificaciones) : 0
      const calificacionMinima = calificaciones.length > 0 ? Math.min(...calificaciones) : 0

      return {
        materiaId: materia.id,
        nombreMateria: materia.nombre,
        totalEquiposEvaluados: equiposEvaluados.length,
        totalEvaluaciones: calificaciones.length,
        promedioGeneral,
        calificacionMaxima,
        calificacionMinima,
      } satisfies EstadisticaMateria
    }),
  )

  return resultados
}
