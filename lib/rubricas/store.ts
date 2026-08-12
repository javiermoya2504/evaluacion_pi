import { randomUUID } from "crypto"
import { readCollection, writeCollection } from "@/lib/db"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Rubrica } from "@/lib/types/rubrica"
import type { CreateRubricaInput } from "@/lib/validations/rubrica"

const DEFAULT_RUBRICAS: Rubrica[] = [{
  id: "rubrica-global-pi",
  nombre: "Rubrica global PI",
  descripcion: "Evaluacion integral del proyecto",
  criterios: [
    { nombre: "Solucion tecnica", porcentaje: 30 },
    { nombre: "Funcionalidad", porcentaje: 30 },
    { nombre: "Documentacion", porcentaje: 20 },
    { nombre: "Presentacion", porcentaje: 20 },
  ],
  totalPorcentaje: 100,
  createdAt: "2026-05-01T00:00:00.000Z",
}]

async function readRubricas(): Promise<Rubrica[]> {
  const rubricas = await readCollection("rubricas", DEFAULT_RUBRICAS)
  if (rubricas.length > 0) return rubricas

  await writeCollection("rubricas", DEFAULT_RUBRICAS)
  return structuredClone(DEFAULT_RUBRICAS)
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
