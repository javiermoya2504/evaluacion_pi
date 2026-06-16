import { randomUUID } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import type { AuthUser, Role, StoredUser } from "@/lib/types/auth"

const USERS_FILE = path.join(process.cwd(), "data", "users.json")

async function ensureUsersFile(): Promise<void> {
  const dir = path.dirname(USERS_FILE)

  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }

  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf-8")
  }
}

async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile()
  const content = await fs.readFile(USERS_FILE, "utf-8")
  const users = JSON.parse(content) as StoredUser[]
  return Array.isArray(users) ? users : []
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await ensureUsersFile()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8")
}

export function toPublicUser(user: StoredUser): AuthUser {
  const { passwordHash, ...publicUser } = user
  void passwordHash
  return publicUser
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await readUsers()
  return users.find((user) => user.email === email.toLowerCase()) ?? null
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await readUsers()
  return users.find((user) => user.id === id) ?? null
}

export async function createUser(input: {
  email: string
  nombre: string
  rol: Role
  passwordHash: string
}): Promise<AuthUser> {
  const users = await readUsers()
  const email = input.email.toLowerCase()

  if (users.some((user) => user.email === email)) {
    throw new Error("EMAIL_ALREADY_EXISTS")
  }

  const newUser: StoredUser = {
    id: randomUUID(),
    email,
    nombre: input.nombre,
    rol: input.rol,
    passwordHash: input.passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  await writeUsers(users)

  return toPublicUser(newUser)
}
