import http from "k6/http"
import { check, group, sleep } from "k6"

const BASE_URL = (__ENV.BASE_URL || "http://localhost:3000").replace(/\/$/, "")
const API_TOKEN = __ENV.API_TOKEN || ""

export const options = {
  scenarios: {
    public_journey: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: __ENV.K6_RAMP_UP || "30s", target: Number(__ENV.K6_VUS || 20) },
        { duration: __ENV.K6_STEADY || "2m", target: Number(__ENV.K6_VUS || 20) },
        { duration: __ENV.K6_RAMP_DOWN || "30s", target: 0 },
      ],
      gracefulRampDown: "15s",
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<750", "p(99)<1500"],
    "http_req_duration{endpoint:health}": ["p(95)<300"],
    "http_req_duration{endpoint:page}": ["p(95)<1000"],
    "http_req_duration{endpoint:api}": ["p(95)<750"],
  },
}

function expectStatus(response, expected, label) {
  check(response, {
    [`${label}: status ${expected}`]: (result) => result.status === expected,
  })
}

export default function runFinalSystemPerformance() {
  group("public system journey", () => {
    const health = http.get(`${BASE_URL}/api/health`, {
      tags: { endpoint: "health" },
    })
    expectStatus(health, 200, "health")

    const docs = http.get(`${BASE_URL}/api/docs`, {
      tags: { endpoint: "page" },
    })
    expectStatus(docs, 200, "swagger")

    const spec = http.get(`${BASE_URL}/api/docs/openapi`, {
      tags: { endpoint: "api" },
    })
    expectStatus(spec, 200, "openapi")

    const login = http.get(`${BASE_URL}/login`, {
      tags: { endpoint: "page" },
    })
    expectStatus(login, 200, "login")
  })

  if (API_TOKEN) {
    group("authenticated full API read journey", () => {
      const params = {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        tags: { endpoint: "api" },
      }

      for (const path of [
        "/api/auth/me",
        "/api/materias",
        "/api/equipos",
        "/api/rubricas/global",
        "/api/evaluaciones",
        "/api/retroalimentacion",
      ]) {
        expectStatus(http.get(`${BASE_URL}${path}`, params), 200, path)
      }
    })
  }

  sleep(Number(__ENV.K6_SLEEP || 1))
}
