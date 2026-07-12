import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import type { Rubrica } from "@/lib/types/rubrica"
import type { CreateRubricaInput } from "@/lib/validations/rubrica"

const RUBRICAS_FILE = path.join(
  process.cwd(),
  "data",
  "rubricas_globales.json",
)

async function ensureRubricasFile(): Promise<void> {
  const dir = path.dirname(RUBRICAS_FILE)

  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(RUBRICAS_FILE)
  } catch {
    await fs.writeFile(RUBRICAS_FILE, JSON.stringify([], null, 2), "utf-8")
  }
}

async function readRubricas(): Promise<Rubrica[]> {
  await ensureRubricasFile()
  const content = await fs.readFile(RUBRICAS_FILE, "utf-8")
  const rubricas = JSON.parse(content) as Rubrica[]
  return Array.isArray(rubricas) ? rubricas : []
}

async function writeRubricas(rubricas: Rubrica[]): Promise<void> {
  await ensureRubricasFile()
  await fs.writeFile(RUBRICAS_FILE, JSON.stringify(rubricas, null, 2), "utf-8")
}

export async function getAllRubricas(): Promise<Rubrica[]> {
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
