import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE } from "@/lib/cache-tags"
import type { Retroalimentacion } from "@/lib/types/retroalimentacion"
import type { CreateRetroalimentacionInput } from "@/lib/validations/retroalimentacion"

const RETROALIMENTACIONES_FILE = path.join(process.cwd(), "data", "retroalimentaciones.json")
const RETROALIMENTACIONES_CACHE_TAG = "retroalimentaciones"

async function ensureRetroalimentacionesFile(): Promise<void> {
  const dir = path.dirname(RETROALIMENTACIONES_FILE)

  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(RETROALIMENTACIONES_FILE)
  } catch {
    await fs.writeFile(RETROALIMENTACIONES_FILE, JSON.stringify([], null, 2), "utf-8")
  }
}

async function readRetroalimentaciones(): Promise<Retroalimentacion[]> {
  await ensureRetroalimentacionesFile()
  const content = await fs.readFile(RETROALIMENTACIONES_FILE, "utf-8")
  const retroalimentaciones = JSON.parse(content) as Retroalimentacion[]
  return Array.isArray(retroalimentaciones) ? retroalimentaciones : []
}

async function writeRetroalimentaciones(retroalimentaciones: Retroalimentacion[]): Promise<void> {
  await ensureRetroalimentacionesFile()
  await fs.writeFile(RETROALIMENTACIONES_FILE, JSON.stringify(retroalimentaciones, null, 2), "utf-8")
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
