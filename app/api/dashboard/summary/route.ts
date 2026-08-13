import { jsonResponse } from "@/lib/auth"
import { withAuth } from "@/lib/middleware/role"
import { getAllEquipos } from "@/lib/equipos/store"
import { getAllEvaluaciones } from "@/lib/evaluaciones/store"
import { getAllProyectos } from "@/lib/proyectos/store"
import { getAllRetroalimentaciones } from "@/lib/retroalimentacion/store"
import { getAllRubricas } from "@/lib/rubricas/store"

export const GET = withAuth(async (_request, { user }) => {
  const [proyectos, equipos, evaluaciones, rubricas, retroalimentaciones] = await Promise.all([
    getAllProyectos(), getAllEquipos(), getAllEvaluaciones(), getAllRubricas(), getAllRetroalimentaciones(),
  ])
  const ownEvaluaciones = user.rol === "profesor"
    ? evaluaciones.filter((item) => item.docenteId === user.id)
    : evaluaciones
  const ownRetroalimentaciones = user.rol === "profesor"
    ? retroalimentaciones.filter((item) => item.docenteId === user.id)
    : retroalimentaciones
  const averageProgress = proyectos.length
    ? Math.round(proyectos.reduce((sum, item) => sum + item.progreso, 0) / proyectos.length)
    : 0

  return jsonResponse({
    success: true,
    updatedAt: new Date().toISOString(),
    summary: {
      proyectos: proyectos.length,
      proyectosEnDesarrollo: proyectos.filter((item) => item.estado === "en-desarrollo").length,
      proyectosFinalizados: proyectos.filter((item) => item.estado === "finalizado").length,
      avancePromedio: averageProgress,
      equipos: equipos.length,
      evaluaciones: ownEvaluaciones.length,
      equiposEvaluados: new Set(ownEvaluaciones.map((item) => item.equipoId)).size,
      rubricas: rubricas.length,
      criterios: rubricas.reduce((sum, item) => sum + item.criterios.length, 0),
      rubricasCompletas: rubricas.filter((item) => item.totalPorcentaje === 100).length,
      retroalimentaciones: ownRetroalimentaciones.length,
    },
    proyectos: proyectos.map(({ id, nombre, estado, progreso, carrera }) => ({ id, nombre, estado, progreso, carrera })),
  })
})
