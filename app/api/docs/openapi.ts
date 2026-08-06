const bearerSecurity = [{ bearerAuth: [] }]

const jsonBody = (schema: Record<string, unknown>) => ({
  required: true,
  content: {
    "application/json": { schema },
  },
})

const responses = {
  200: { description: "Operacion exitosa" },
  201: { description: "Recurso creado" },
  400: { description: "Solicitud invalida" },
  401: { description: "Token ausente o invalido" },
  403: { description: "Rol sin permisos suficientes" },
  404: { description: "Recurso no encontrado" },
  409: { description: "Conflicto con un recurso existente" },
  500: { description: "Error interno del servidor" },
}

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Evaluacion PI API",
    version: "0.2.0",
    description:
      "API para autenticacion, materias, equipos, rubricas, evaluaciones y retroalimentacion.",
  },
  servers: [{ url: "/", description: "Servidor actual" }],
  tags: [
    { name: "Sistema" },
    { name: "Autenticacion" },
    { name: "Materias" },
    { name: "Equipos" },
    { name: "Rubricas" },
    { name: "Evaluaciones" },
    { name: "Retroalimentacion" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Sistema"],
        summary: "Verifica la salud del servicio",
        responses: { 200: responses[200] },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticacion"],
        summary: "Inicia sesion y devuelve un JWT",
        requestBody: jsonBody({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", format: "password" },
          },
        }),
        responses: { 200: responses[200], 400: responses[400], 401: responses[401] },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Autenticacion"],
        summary: "Registra un usuario",
        requestBody: jsonBody({
          type: "object",
          required: ["email", "password", "nombre"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 8, maxLength: 128 },
            nombre: { type: "string", minLength: 2, maxLength: 100 },
            rol: { type: "string", enum: ["admin", "profesor", "alumno"], default: "alumno" },
          },
        }),
        responses: { 201: responses[201], 400: responses[400], 409: responses[409] },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Autenticacion"],
        summary: "Devuelve el usuario autenticado",
        security: bearerSecurity,
        responses: { 200: responses[200], 401: responses[401] },
      },
    },
    "/api/materias": {
      get: {
        tags: ["Materias"],
        summary: "Lista materias",
        security: bearerSecurity,
        responses: { 200: responses[200], 401: responses[401] },
      },
      post: {
        tags: ["Materias"],
        summary: "Crea una materia",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/MateriaInput" }),
        responses,
      },
    },
    "/api/materias/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Materias"],
        summary: "Obtiene una materia",
        security: bearerSecurity,
        responses,
      },
      put: {
        tags: ["Materias"],
        summary: "Actualiza una materia",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/MateriaInput" }),
        responses,
      },
      delete: {
        tags: ["Materias"],
        summary: "Elimina una materia",
        security: bearerSecurity,
        responses,
      },
    },
    "/api/equipos": {
      get: {
        tags: ["Equipos"],
        summary: "Lista equipos",
        security: bearerSecurity,
        responses,
      },
      post: {
        tags: ["Equipos"],
        summary: "Crea un equipo",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/EquipoInput" }),
        responses,
      },
      put: {
        tags: ["Equipos"],
        summary: "Actualiza un equipo",
        security: bearerSecurity,
        requestBody: jsonBody({
          allOf: [
            { $ref: "#/components/schemas/EquipoInput" },
            { type: "object", required: ["id"], properties: { id: { type: "string" } } },
          ],
        }),
        responses,
      },
    },
    "/api/rubricas/global": {
      get: {
        tags: ["Rubricas"],
        summary: "Lista rubricas globales",
        security: bearerSecurity,
        responses,
      },
      post: {
        tags: ["Rubricas"],
        summary: "Crea una rubrica global",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/RubricaInput" }),
        responses,
      },
    },
    "/api/evaluaciones": {
      get: {
        tags: ["Evaluaciones"],
        summary: "Lista evaluaciones",
        security: bearerSecurity,
        responses,
      },
      post: {
        tags: ["Evaluaciones"],
        summary: "Crea una evaluacion",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/EvaluacionInput" }),
        responses,
      },
      put: {
        tags: ["Evaluaciones"],
        summary: "Actualiza una evaluacion",
        security: bearerSecurity,
        requestBody: jsonBody({
          allOf: [
            { $ref: "#/components/schemas/EvaluacionInput" },
            { type: "object", required: ["id"], properties: { id: { type: "string" } } },
          ],
        }),
        responses,
      },
    },
    "/api/retroalimentacion": {
      get: {
        tags: ["Retroalimentacion"],
        summary: "Lista retroalimentaciones",
        security: bearerSecurity,
        responses,
      },
      post: {
        tags: ["Retroalimentacion"],
        summary: "Crea una retroalimentacion",
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/RetroalimentacionInput" }),
        responses,
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      MateriaInput: {
        type: "object",
        required: ["nombre", "cuatrimestre", "profesor"],
        properties: {
          nombre: { type: "string", minLength: 2, maxLength: 150 },
          cuatrimestre: { type: "integer", minimum: 1, maximum: 12 },
          profesor: { type: "string", minLength: 2, maxLength: 100 },
          activa: { type: "boolean", default: true },
        },
      },
      EquipoInput: {
        type: "object",
        required: ["nombre", "materiaId"],
        properties: {
          nombre: { type: "string", minLength: 2, maxLength: 150 },
          materiaId: { type: "string" },
          integranteIds: { type: "array", items: { type: "string" } },
        },
      },
      RubricaInput: {
        type: "object",
        required: ["nombre", "descripcion", "criterios"],
        properties: {
          nombre: { type: "string" },
          descripcion: { type: "string" },
          criterios: {
            type: "array",
            items: {
              type: "object",
              required: ["nombre", "porcentaje"],
              properties: {
                nombre: { type: "string" },
                porcentaje: { type: "number", exclusiveMinimum: 0, maximum: 100 },
              },
            },
          },
        },
      },
      EvaluacionInput: {
        type: "object",
        required: ["equipoId", "rubricaId", "docenteId", "criterios"],
        properties: {
          equipoId: { type: "string" },
          rubricaId: { type: "string" },
          docenteId: { type: "string" },
          observaciones: { type: "string", maxLength: 2000 },
          criterios: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              required: ["criterioId", "puntuacion"],
              properties: {
                criterioId: { type: "string" },
                puntuacion: { type: "number", minimum: 0 },
              },
            },
          },
        },
      },
      RetroalimentacionInput: {
        type: "object",
        required: ["equipoId", "evaluacionId", "docenteId", "comentario"],
        properties: {
          equipoId: { type: "string" },
          evaluacionId: { type: "string" },
          docenteId: { type: "string" },
          comentario: { type: "string", minLength: 10, maxLength: 1000 },
        },
      },
    },
  },
} as const
