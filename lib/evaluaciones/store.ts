import { randomUUID } from "crypto"
import { readCollection, writeCollection } from "@/lib/db"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Evaluacion } from "@/lib/types/evaluacion"
import type {
  CreateEvaluacionInput,
  UpdateEvaluacionInput,
} from "@/lib/validations/evaluacion"

async function readEvaluaciones(): Promise<Evaluacion[]> {
  return readCollection("evaluaciones", [])
}

async function writeEvaluaciones(evaluaciones: Evaluacion[]): Promise<void> {
  await writeCollection("evaluaciones", evaluaciones)
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
