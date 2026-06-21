import { z } from "zod"
import { ROLES } from "@/lib/types/auth"

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Correo electrónico inválido")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres"),
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  rol: z.enum(ROLES).optional().default("alumno"),
})

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Correo electrónico inválido")
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
