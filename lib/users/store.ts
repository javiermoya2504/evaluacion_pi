import { randomUUID } from "crypto"
import { ensureAuthSchema, getSql } from "@/lib/db"
import type { AuthUser, Role, StoredUser } from "@/lib/types/auth"

type UserRow = { id: string; email: string; nombre: string; rol: Role; password_hash: string; created_at: string | Date }

function fromRow(row: UserRow): StoredUser {
  return { id: row.id, email: row.email, nombre: row.nombre, rol: row.rol, passwordHash: row.password_hash, createdAt: new Date(row.created_at).toISOString() }
}

export function toPublicUser(user: StoredUser): AuthUser {
  const { passwordHash, ...publicUser } = user
  void passwordHash
  return publicUser
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  await ensureAuthSchema()
  const rows = await getSql()`SELECT * FROM app_user WHERE email = ${email.toLowerCase()} LIMIT 1`
  return rows[0] ? fromRow(rows[0] as UserRow) : null
}

export async function getAllUsers(): Promise<AuthUser[]> {
  await ensureAuthSchema()
  const rows = await getSql()`SELECT * FROM app_user ORDER BY nombre`
  return rows.map((row) => toPublicUser(fromRow(row as UserRow)))
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  await ensureAuthSchema()
  const rows = await getSql()`SELECT * FROM app_user WHERE id = ${id} LIMIT 1`
  return rows[0] ? fromRow(rows[0] as UserRow) : null
}

export async function createUser(input: {
  email: string
  nombre: string
  rol: Role
  passwordHash: string
}): Promise<AuthUser> {
  await ensureAuthSchema()
  const sql = getSql()
  const email = input.email.toLowerCase()
  try {
    const rows = await sql`INSERT INTO app_user (id, email, nombre, rol, password_hash)
      VALUES (${randomUUID()}, ${email}, ${input.nombre}, ${input.rol}, ${input.passwordHash}) RETURNING *`
    return toPublicUser(fromRow(rows[0] as UserRow))
  } catch (error) {
    if (error instanceof Error && /unique|duplicate/i.test(error.message)) throw new Error("EMAIL_ALREADY_EXISTS")
    throw error
  }
}

export async function findOrCreateOAuthUser(input: {
  email: string
  nombre: string
  rol: Extract<Role, "coordinadora_pi" | "jefe_asignatura" | "profesor">
  passwordHash: string
}): Promise<AuthUser> {
  const existingUser = await findUserByEmail(input.email)
  if (existingUser) return toPublicUser(existingUser)

  try {
    return await createUser(input)
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      const concurrentUser = await findUserByEmail(input.email)
      if (concurrentUser) return toPublicUser(concurrentUser)
    }
    throw error
  }
}
