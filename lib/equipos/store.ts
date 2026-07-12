import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import { getMateriaById } from "@/lib/materias/store"
import type { Equipo, EquipoWithRelations } from "@/lib/types/equipo"
import type {
  CreateEquipoInput,
  UpdateEquipoInput,
} from "@/lib/validations/equipo"
import { findUserById, toPublicUser } from "@/lib/users/store"

const EQUIPOS_FILE = path.join(process.cwd(), "data", "equipos.json")

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

async function ensureEquiposFile(): Promise<void> {
  const dir = path.dirname(EQUIPOS_FILE)

  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(EQUIPOS_FILE)
  } catch {
    await fs.writeFile(EQUIPOS_FILE, JSON.stringify(SEED_EQUIPOS, null, 2), "utf-8")
  }
}

async function readEquipos(): Promise<Equipo[]> {
  await ensureEquiposFile()
  const content = await fs.readFile(EQUIPOS_FILE, "utf-8")
  const equipos = JSON.parse(content) as Equipo[]
  return Array.isArray(equipos) ? equipos : []
}

async function writeEquipos(equipos: Equipo[]): Promise<void> {
  await ensureEquiposFile()
  await fs.writeFile(EQUIPOS_FILE, JSON.stringify(equipos, null, 2), "utf-8")
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
  const equipos = await readEquipos()
  const sorted = equipos.sort((a, b) => a.nombre.localeCompare(b.nombre))

  return Promise.all(sorted.map((equipo) => withRelations(equipo)))
}

export async function getEquipoById(id: string): Promise<EquipoWithRelations | null> {
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
