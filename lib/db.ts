import { neon } from "@neondatabase/serverless"

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL no esta configurada")
  return neon(databaseUrl)
}

export async function ensureAuthSchema(): Promise<void> {
  const sql = getSql()
  await sql`CREATE TABLE IF NOT EXISTS app_user (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('coordinadora_pi', 'jefe_asignatura', 'profesor')),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`
}

export async function readCollection<T>(key: string, seed: T[]): Promise<T[]> {
  const sql = getSql()
  await sql`CREATE TABLE IF NOT EXISTS app_collection (key TEXT PRIMARY KEY, payload JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  const rows = await sql`SELECT payload FROM app_collection WHERE key = ${key} LIMIT 1`
  if (rows[0]) return rows[0].payload as T[]
  await sql`INSERT INTO app_collection (key, payload) VALUES (${key}, ${JSON.stringify(seed)}::jsonb) ON CONFLICT (key) DO NOTHING`
  return seed.map((item) => structuredClone(item))
}

export async function writeCollection<T>(key: string, items: T[]): Promise<void> {
  const sql = getSql()
  await sql`INSERT INTO app_collection (key, payload, updated_at) VALUES (${key}, ${JSON.stringify(items)}::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`
}
