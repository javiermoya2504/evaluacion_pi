import { randomUUID } from "crypto"
import { readCollection, writeCollection } from "@/lib/db"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Rubrica } from "@/lib/types/rubrica"
import type { CreateRubricaInput } from "@/lib/validations/rubrica"

async function readRubricas(): Promise<Rubrica[]> {
  return readCollection("rubricas", [])
}

async function writeRubricas(rubricas: Rubrica[]): Promise<void> {
  await writeCollection("rubricas", rubricas)
}

export async function getAllRubricas(): Promise<Rubrica[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.rubricas)

  return readRubricas()
}

export async function createRubrica(
  input: CreateRubricaInput,
): Promise<Rubrica> {
  const rubricas = await readRubricas()
  const criterios = input.criterios.map((criterio) => ({
    nombre: criterio.nombre.trim(),
    porcentaje: criterio.porcentaje,
  }))

  const newRubrica: Rubrica = {
    id: randomUUID(),
    nombre: input.nombre.trim(),
    descripcion: input.descripcion.trim(),
    criterios,
    totalPorcentaje: criterios.reduce(
      (sum, criterio) => sum + criterio.porcentaje,
      0,
    ),
    createdAt: new Date().toISOString(),
  }

  rubricas.push(newRubrica)
  await writeRubricas(rubricas)

  return newRubrica
}
