import { randomUUID } from "crypto"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE } from "@/lib/cache-tags"
import type { Retroalimentacion } from "@/lib/types/retroalimentacion"
import type { CreateRetroalimentacionInput } from "@/lib/validations/retroalimentacion"
import { getStorageAdapter } from "@/lib/storage/adapter"

const RETROALIMENTACIONES_KEY = "retroalimentaciones:all"
const RETROALIMENTACIONES_CACHE_TAG = "retroalimentaciones"

async function readRetroalimentaciones(): Promise<Retroalimentacion[]> {
  const storage = getStorageAdapter()
  const content = await storage.get<Retroalimentacion[]>(RETROALIMENTACIONES_KEY)
  return Array.isArray(content) ? content : []
}

async function writeRetroalimentaciones(retroalimentaciones: Retroalimentacion[]): Promise<void> {
  const storage = getStorageAdapter()
  await storage.set<Retroalimentacion[]>(RETROALIMENTACIONES_KEY, retroalimentaciones)
}

export async function getAllRetroalimentaciones(): Promise<Retroalimentacion[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(RETROALIMENTACIONES_CACHE_TAG)

  const retroalimentaciones = await readRetroalimentaciones()
  return retroalimentaciones.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createRetroalimentacion(
  input: CreateRetroalimentacionInput,
): Promise<Retroalimentacion> {
  const retroalimentaciones = await readRetroalimentaciones()

  const nuevaRetroalimentacion: Retroalimentacion = {
    id: randomUUID(),
    equipoId: input.equipoId,
    evaluacionId: input.evaluacionId,
    docenteId: input.docenteId,
    comentario: input.comentario,
    createdAt: new Date().toISOString(),
  }

  retroalimentaciones.push(nuevaRetroalimentacion)
  await writeRetroalimentaciones(retroalimentaciones)

  return nuevaRetroalimentacion
}
