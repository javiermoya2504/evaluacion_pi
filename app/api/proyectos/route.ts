import { NextRequest } from "next/server"
import { errorResponse, jsonResponse } from "@/lib/auth"
import { withAuth, withRoles } from "@/lib/middleware/role"
import { createProyecto, getAllProyectos, updateProyecto } from "@/lib/proyectos/store"
import { createProyectoSchema, updateProyectoSchema } from "@/lib/validations/proyecto"

export const GET = withAuth(async () => jsonResponse({ success: true, proyectos: await getAllProyectos() }))
export const POST = withRoles(["coordinadora_pi", "jefe_asignatura"], async (request: NextRequest) => {
  const parsed = createProyectoSchema.safeParse(await request.json())
  if (!parsed.success) return errorResponse("Datos de proyecto invalidos", 400, parsed.error.flatten().fieldErrors)
  return jsonResponse({ success: true, proyecto: await createProyecto(parsed.data) }, 201)
})
export const PUT = withRoles(["coordinadora_pi", "jefe_asignatura"], async (request: NextRequest) => {
  const parsed = updateProyectoSchema.safeParse(await request.json())
  if (!parsed.success) return errorResponse("Datos de proyecto invalidos", 400, parsed.error.flatten().fieldErrors)
  try { return jsonResponse({ success: true, proyecto: await updateProyecto(parsed.data) }) }
  catch { return errorResponse("Proyecto no encontrado", 404) }
})
