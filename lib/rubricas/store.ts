import { randomUUID } from "crypto"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Rubrica } from "@/lib/types/rubrica"
import type { CreateRubricaInput } from "@/lib/validations/rubrica"
import { getStorageAdapter } from "@/lib/storage/adapter"

const RUBRICAS_KEY = "rubricas:all"

async function readRubricas(): Promise<Rubrica[]> {
  const storage = getStorageAdapter()
  const rubricas = await storage.get<Rubrica[]>(RUBRICAS_KEY)
  return Array.isArray(rubricas) ? rubricas : []
}

async function writeRubricas(rubricas: Rubrica[]): Promise<void> {
  const storage = getStorageAdapter()
  await storage.set<Rubrica[]>(RUBRICAS_KEY, rubricas)
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
