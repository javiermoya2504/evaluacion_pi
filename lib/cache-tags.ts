export const CACHE_TAGS = {
  equipos: "equipos",
  evaluaciones: "evaluaciones",
  materias: "materias",
  rubricas: "rubricas-globales",
} as const

export const CACHE_LIFE = {
  sprint8Data: {
    stale: 30,
    revalidate: 120,
    expire: 600,
  },
} as const
