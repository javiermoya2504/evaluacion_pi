import { randomUUID } from "crypto"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import type { Materia } from "@/lib/types/materia"
import type {
  CreateMateriaInput,
  UpdateMateriaInput,
} from "@/lib/validations/materia"
import { getStorageAdapter } from "@/lib/storage/adapter"

const MATERIAS_KEY = "materias:all"

const SEED_MATERIAS: Materia[] = [
  {
    id: "prog-web",
    nombre: "Programación Web",
    cuatrimestre: 5,
    profesor: "Ing. Ana Martinez Ruiz",
    activa: true,
  },
  {
    id: "bd",
    nombre: "Base de Datos",
    cuatrimestre: 4,
    profesor: "Mtro. Roberto Sanchez Perez",
    activa: true,
  },
  {
    id: "redes",
    nombre: "Redes de Computadoras",
    cuatrimestre: 6,
    profesor: "Ing. Carlos Ramirez Lopez",
    activa: true,
  },
  {
    id: "ing-soft",
    nombre: "Ingeniería de Software",
    cuatrimestre: 7,
    profesor: "Ing. Carlos Ramirez Lopez",
    activa: true,
  },
  {
    id: "sistemas-op",
    nombre: "Sistemas Operativos",
    cuatrimestre: 5,
    profesor: "Ing. Ana Martinez Ruiz",
    activa: true,
  },
  {
    id: "seguridad",
    nombre: "Seguridad Informática",
    cuatrimestre: 8,
    profesor: "Mtro. Roberto Sanchez Perez",
    activa: false,
  },
]

async function readMaterias(): Promise<Materia[]> {
  const storage = getStorageAdapter()
  let materias = await storage.get<Materia[]>(MATERIAS_KEY)

  // Initialize with seed data on first run
  if (!materias || !Array.isArray(materias) || materias.length === 0) {
    materias = SEED_MATERIAS
    await storage.set<Materia[]>(MATERIAS_KEY, materias)
  }

  return Array.isArray(materias) ? materias : []
}

async function writeMaterias(materias: Materia[]): Promise<void> {
  const storage = getStorageAdapter()
  await storage.set<Materia[]>(MATERIAS_KEY, materias)
}

export async function getAllMaterias(): Promise<Materia[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.materias)

  const materias = await readMaterias()
  return materias.sort((a, b) => a.nombre.localeCompare(b.nombre))
}

export async function getMateriaById(id: string): Promise<Materia | null> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.materias)

  const materias = await readMaterias()
  return materias.find((materia) => materia.id === id) ?? null
}

export async function createMateria(input: CreateMateriaInput): Promise<Materia> {
  const materias = await readMaterias()
  const nombre = input.nombre.trim()

  if (materias.some((materia) => materia.nombre.toLowerCase() === nombre.toLowerCase())) {
    throw new Error("MATERIA_ALREADY_EXISTS")
  }

  const newMateria: Materia = {
    id: randomUUID(),
    nombre,
    cuatrimestre: input.cuatrimestre,
    profesor: input.profesor.trim(),
    activa: input.activa,
  }

  materias.push(newMateria)
  await writeMaterias(materias)

  return newMateria
}

export async function updateMateria(
  id: string,
  input: UpdateMateriaInput,
): Promise<Materia> {
  const materias = await readMaterias()
  const index = materias.findIndex((materia) => materia.id === id)

  if (index === -1) {
    throw new Error("MATERIA_NOT_FOUND")
  }

  const current = materias[index]

  if (input.nombre) {
    const nombre = input.nombre.trim()
    const duplicate = materias.some(
      (materia) =>
        materia.id !== id && materia.nombre.toLowerCase() === nombre.toLowerCase(),
    )

    if (duplicate) {
      throw new Error("MATERIA_ALREADY_EXISTS")
    }
  }

  const updated: Materia = {
    ...current,
    ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
    ...(input.cuatrimestre !== undefined ? { cuatrimestre: input.cuatrimestre } : {}),
    ...(input.profesor !== undefined ? { profesor: input.profesor.trim() } : {}),
    ...(input.activa !== undefined ? { activa: input.activa } : {}),
  }

  materias[index] = updated
  await writeMaterias(materias)

  return updated
}

export async function deleteMateria(id: string): Promise<Materia> {
  const materias = await readMaterias()
  const index = materias.findIndex((materia) => materia.id === id)

  if (index === -1) {
    throw new Error("MATERIA_NOT_FOUND")
  }

  const [deleted] = materias.splice(index, 1)
  await writeMaterias(materias)

  return deleted
}
