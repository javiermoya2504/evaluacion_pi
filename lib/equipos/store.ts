import { randomUUID } from "crypto"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE_LIFE, CACHE_TAGS } from "@/lib/cache-tags"
import { getMateriaById } from "@/lib/materias/store"
import type { Equipo, EquipoWithRelations } from "@/lib/types/equipo"
import type {
  CreateEquipoInput,
  UpdateEquipoInput,
} from "@/lib/validations/equipo"
import { findUserById, toPublicUser } from "@/lib/users/store"
import { getStorageAdapter } from "@/lib/storage/adapter"

const EQUIPOS_KEY = "equipos:all"

const SEED_EQUIPOS: Equipo[] = [
  {
    id: "equipo-aurum",
    nombre: "Equipo Aurum",
    materiaId: "ing-soft",
    integranteIds: [],
  },
  {
    id: "equipo-nexus",
    nombre: "Equipo Nexus",
    materiaId: "prog-web",
    integranteIds: [],
  },
]

async function readEquipos(): Promise<Equipo[]> {
  const storage = getStorageAdapter()
  let equipos = await storage.get<Equipo[]>(EQUIPOS_KEY)
  
  // Initialize with seed data on first run
  if (!equipos || !Array.isArray(equipos) || equipos.length === 0) {
    equipos = SEED_EQUIPOS
    await storage.set<Equipo[]>(EQUIPOS_KEY, equipos)
  }
  
  return Array.isArray(equipos) ? equipos : []
}

async function writeEquipos(equipos: Equipo[]): Promise<void> {
  const storage = getStorageAdapter()
  await storage.set<Equipo[]>(EQUIPOS_KEY, equipos)
}

async function validateMateria(materiaId: string): Promise<void> {
  const materia = await getMateriaById(materiaId)

  if (!materia) {
    throw new Error("MATERIA_NOT_FOUND")
  }
}

async function validateIntegrantes(integranteIds: string[]): Promise<void> {
  for (const integranteId of integranteIds) {
    const integrante = await findUserById(integranteId)

    if (!integrante) {
      throw new Error("INTEGRANTE_NOT_FOUND")
    }
  }
}

async function withRelations(equipo: Equipo): Promise<EquipoWithRelations> {
  const materia = await getMateriaById(equipo.materiaId)
  const integrantes = await Promise.all(
    equipo.integranteIds.map(async (integranteId) => {
      const integrante = await findUserById(integranteId)
      return integrante ? toPublicUser(integrante) : null
    }),
  )

  return {
    ...equipo,
    materia,
    integrantes: integrantes.filter((integrante) => integrante !== null),
  }
}

export async function getAllEquipos(): Promise<EquipoWithRelations[]> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.equipos)

  const equipos = await readEquipos()
  const sorted = equipos.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return Promise.all(sorted.map((equipo) => withRelations(equipo)))
}

export async function getEquipoById(id: string): Promise<EquipoWithRelations | null> {
  "use cache"

  cacheLife(CACHE_LIFE.sprint8Data)
  cacheTag(CACHE_TAGS.equipos)

  const equipos = await readEquipos()
  const equipo = equipos.find((item) => item.id === id)

  return equipo ? withRelations(equipo) : null
}

export async function createEquipo(input: CreateEquipoInput): Promise<EquipoWithRelations> {
  const equipos = await readEquipos()
  const nombre = input.nombre.trim()
  const materiaId = input.materiaId.trim()
  const integranteIds = input.integranteIds.map((id) => id.trim())

  if (equipos.some((equipo) => equipo.nombre.toLowerCase() === nombre.toLowerCase())) {
    throw new Error("EQUIPO_ALREADY_EXISTS")
  }

  await validateMateria(materiaId)
  await validateIntegrantes(integranteIds)

  const newEquipo: Equipo = {
    id: randomUUID(),
    nombre,
    materiaId,
    integranteIds,
  }

  equipos.push(newEquipo)
  await writeEquipos(equipos)

  return withRelations(newEquipo)
}

export async function updateEquipo(input: UpdateEquipoInput): Promise<EquipoWithRelations> {
  const equipos = await readEquipos()
  const id = input.id.trim()
  const index = equipos.findIndex((equipo) => equipo.id === id)

  if (index === -1) {
    throw new Error("EQUIPO_NOT_FOUND")
  }

  const current = equipos[index]

  if (input.nombre) {
    const nombre = input.nombre.trim()
    const duplicate = equipos.some(
      (equipo) =>
        equipo.id !== id && equipo.nombre.toLowerCase() === nombre.toLowerCase(),
    )

    if (duplicate) {
      throw new Error("EQUIPO_ALREADY_EXISTS")
    }
  }

  if (input.materiaId !== undefined) {
    await validateMateria(input.materiaId.trim())
  }

  if (input.integranteIds !== undefined) {
    await validateIntegrantes(input.integranteIds)
  }

  const updated: Equipo = {
    ...current,
    ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
    ...(input.materiaId !== undefined ? { materiaId: input.materiaId.trim() } : {}),
    ...(input.integranteIds !== undefined ? { integranteIds: input.integranteIds } : {}),
  }

  equipos[index] = updated
  await writeEquipos(equipos)

  return withRelations(updated)
}
