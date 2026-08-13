/**
 * Storage adapter interface - supports both JSON (local) and Upstash Redis (production)
 * 
 * Production uses Upstash Redis (via Vercel Marketplace integration)
 * Local development uses JSON files
 */

import { promises as fs } from "fs"
import path from "path"
import type { Redis as UpstashRedisClient } from "@upstash/redis"

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  list(pattern: string): Promise<string[]>
}

/**
 * Get the appropriate storage adapter based on environment
 * 
 * Production: Upstash Redis requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * Local: JSON files in data/ directory
 */
export function getStorageAdapter(): StorageAdapter {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Use Upstash Redis in production (from Vercel Marketplace integration)
    return new UpstashRedisAdapter()
  }
  // Use JSON files in development
  return new JSONAdapter()
}

/**
 * JSON-based adapter for local development
 */

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
 * Upstash Redis adapter for production (Vercel Marketplace)
 * 
 * Requires:
 * - UPSTASH_REDIS_REST_URL: REST API URL
 * - UPSTASH_REDIS_REST_TOKEN: Authentication token
 * 
 * These are automatically set by Vercel when you add Upstash Redis integration
 */

class UpstashRedisAdapter implements StorageAdapter {
  private client: UpstashRedisClient | null = null

  private async getClient(): Promise<UpstashRedisClient> {
    if (this.client) return this.client

    const { Redis } = await import("@upstash/redis")
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        "Upstash Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
      )
    }

    this.client = new Redis({ url, token })
    return this.client
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const client = await this.getClient()
      const value = await client.get(key)
      return (value as T) || null
    } catch (error) {
      console.error(`[Storage] Failed to get key ${key}:`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const client = await this.getClient()
      await client.set(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[Storage] Failed to set key ${key}:`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const client = await this.getClient()
      await client.del(key)
    } catch (error) {
      console.error(`[Storage] Failed to delete key ${key}:`, error)
      // Don't throw - key might not exist
    }
  }

  async list(pattern: string): Promise<string[]> {
    try {
      // Redis SCAN/KEYS are not available in Upstash REST API
      // For now, return empty array
      // In production, consider maintaining a separate keys index
      void pattern // Acknowledge unused parameter
      return []
    } catch {
      return []
    }
  }
}
