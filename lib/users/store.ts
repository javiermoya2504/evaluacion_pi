import { randomUUID } from "crypto"
import type { AuthUser, Role, StoredUser } from "@/lib/types/auth"
import { getStorageAdapter } from "@/lib/storage/adapter"

const USERS_KEY = "users:all"

async function readUsers(): Promise<StoredUser[]> {
  const storage = getStorageAdapter()
  const users = await storage.get<StoredUser[]>(USERS_KEY)
  return Array.isArray(users) ? users : []
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  const storage = getStorageAdapter()
  await storage.set<StoredUser[]>(USERS_KEY, users)
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

export async function getAllUsers(): Promise<AuthUser[]> {
  const users = await readUsers()
  return users
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((user) => toPublicUser(user))
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
