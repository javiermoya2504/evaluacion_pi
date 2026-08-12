import { randomUUID } from "crypto"
import { readCollection, writeCollection } from "@/lib/db"
import type { Proyecto } from "@/lib/types/proyecto"
import type { CreateProyectoInput, UpdateProyectoInput } from "@/lib/validations/proyecto"

const SEED: Proyecto[] = [
  { id: "proyecto-sigep", nombre: "SIGEP-PI", descripcion: "Sistema inteligente para la gestion y evaluacion de proyectos integradores", carrera: "ISC", periodo: "2026-2", fechaInicio: "2026-05-01", fechaFin: "2026-08-31", estado: "en-desarrollo", progreso: 76, createdAt: "2026-05-01T00:00:00.000Z" },
]
export async function getAllProyectos() { return readCollection<Proyecto>("proyectos", SEED) }
export async function createProyecto(input: CreateProyectoInput) {
  const proyectos = await getAllProyectos()
  const proyecto: Proyecto = { id: randomUUID(), ...input, createdAt: new Date().toISOString() }
  proyectos.push(proyecto); await writeCollection("proyectos", proyectos); return proyecto
}
export async function updateProyecto(input: UpdateProyectoInput) {
  const proyectos = await getAllProyectos(); const index = proyectos.findIndex((item) => item.id === input.id)
  if (index < 0) throw new Error("PROYECTO_NOT_FOUND")
  proyectos[index] = { ...proyectos[index], ...input }
  await writeCollection("proyectos", proyectos); return proyectos[index]
}
