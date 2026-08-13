/**
 * Storage adapter interface - supports both JSON (local) and Vercel KV (production)
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  list(pattern: string): Promise<string[]>
}

/**
 * Get the appropriate storage adapter based on environment
 */
export function getStorageAdapter(): StorageAdapter {
  if (process.env.KV_REST_API_URL) {
    // Use Vercel KV in production
    return new VercelKVAdapter()
  }
  // Use JSON files in development
  return new JSONAdapter()
}

/**
 * JSON-based adapter for local development
 */
import { promises as fs } from "fs"
import path from "path"

class JSONAdapter implements StorageAdapter {
  private dataDir = path.join(process.cwd(), "data")

  private getFilePath(key: string): string {
    // Sanitize key to prevent directory traversal
    const sanitized = key.replace(/[^a-z0-9-_]/gi, "_")
    return path.join(this.dataDir, `${sanitized}.json`)
  }

  async ensureDir(): Promise<void> {
    try {
      await fs.access(this.dataDir)
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true })
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      await this.ensureDir()
      const filePath = this.getFilePath(key)
      const content = await fs.readFile(filePath, "utf-8")
      return JSON.parse(content) as T
    } catch {
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureDir()
    const filePath = this.getFilePath(key)
    await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf-8")
  }

  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key)
      await fs.unlink(filePath)
    } catch {
      // File doesn't exist, that's fine
    }
  }

  async list(pattern: string): Promise<string[]> {
    try {
      await this.ensureDir()
      const files = await fs.readdir(this.dataDir)
      return files
        .filter((file) => file.endsWith(".json"))
        .filter((file) => file.includes(pattern))
        .map((file) => file.replace(".json", ""))
    } catch {
      return []
    }
  }
}

/**
 * Vercel KV adapter for production
 */
class VercelKVAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const { kv } = await import("@vercel/kv")
      const value = await kv.get(key)
      return (value as T) || null
    } catch {
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const { kv } = await import("@vercel/kv")
      await kv.set(key, value)
    } catch (error) {
      console.error(`[Storage] Failed to set key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const { kv } = await import("@vercel/kv")
      await kv.del(key)
    } catch {
      // Key doesn't exist, that's fine
    }
  }

  async list(pattern: string): Promise<string[]> {
    try {
      // KV doesn't support pattern matching - return empty array
      // For production, implement a separate index key if needed
      void pattern // Acknowledge unused parameter
      return []
    } catch {
      return []
    }
  }
}
