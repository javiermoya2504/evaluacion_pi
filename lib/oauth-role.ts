import { REGISTER_ROLES, type Role } from "./types/auth"

export type RegisterRole = Extract<Role, "coordinadora_pi" | "jefe_asignatura" | "profesor">

export function parseOAuthRole(value: unknown): RegisterRole | null {
  return typeof value === "string" && (REGISTER_ROLES as readonly string[]).includes(value)
    ? (value as RegisterRole)
    : null
}
