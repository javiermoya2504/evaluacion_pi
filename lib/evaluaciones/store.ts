import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Evaluacion } from "@/lib/types/evaluacion"
import type {
  CreateEvaluacionInput,
  UpdateEvaluacionInput,
} from "@/lib/validations/evaluacion"

const EVALUACIONES_FILE = path.join(process.cwd(), "data", "evaluaciones.json")

async function ensureEvaluacionesFile(): Promise<void> {
  const dir = path.dirname(EVALUACIONES_FILE)

  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(EVALUACIONES_FILE)
  } catch {
    await fs.writeFile(EVALUACIONES_FILE, JSON.stringify([], null, 2), "utf-8")
  }
}

async function readEvaluaciones(): Promise<Evaluacion[]> {
  await ensureEvaluacionesFile()
  const content = await fs.readFile(EVALUACIONES_FILE, "utf-8")
  const evaluaciones = JSON.parse(content) as Evaluacion[]
  return Array.isArray(evaluaciones) ? evaluaciones : []
}

async function writeEvaluaciones(evaluaciones: Evaluacion[]): Promise<void> {
  await ensureEvaluacionesFile()
  await fs.writeFile(EVALUACIONES_FILE, JSON.stringify(evaluaciones, null, 2), "utf-8")
}

export async function getAllEvaluaciones(): Promise<Evaluacion[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.evaluaciones)

  const evaluaciones = await readEvaluaciones()
  return evaluaciones.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createEvaluacion(input: CreateEvaluacionInput): Promise<Evaluacion> {
  const evaluaciones = await readEvaluaciones()

  const nuevaEvaluacion: Evaluacion = {
    id: randomUUID(),
    equipoId: input.equipoId,
    rubricaId: input.rubricaId,
    docenteId: input.docenteId,
    observaciones: input.observaciones ?? "",
    criterios: input.criterios,
    createdAt: new Date().toISOString(),
  }

  evaluaciones.push(nuevaEvaluacion)
  await writeEvaluaciones(evaluaciones)

  return nuevaEvaluacion
}

export async function updateEvaluacion(
  id: string,
  input: UpdateEvaluacionInput,
): Promise<Evaluacion> {
  const evaluaciones = await readEvaluaciones()
  const index = evaluaciones.findIndex((evaluacion) => evaluacion.id === id)

  if (index === -1) {
    throw new Error("EVALUACION_NOT_FOUND")
  }

  const updates = input
  const updated: Evaluacion = {
    ...evaluaciones[index],
    ...(updates.equipoId !== undefined ? { equipoId: updates.equipoId } : {}),
    ...(updates.rubricaId !== undefined ? { rubricaId: updates.rubricaId } : {}),
    ...(updates.docenteId !== undefined ? { docenteId: updates.docenteId } : {}),
    ...(updates.observaciones !== undefined ? { observaciones: updates.observaciones } : {}),
    ...(updates.criterios !== undefined ? { criterios: updates.criterios } : {}),
  }

  evaluaciones[index] = updated
  await writeEvaluaciones(evaluaciones)

  return updated
}
