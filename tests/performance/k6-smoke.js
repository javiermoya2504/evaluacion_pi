import http from "k6/http"
import { check, group, sleep } from "k6"

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000"
const API_TOKEN = __ENV.API_TOKEN || ""

export const options = {
  vus: Number(__ENV.K6_VUS || 5),
  duration: __ENV.K6_DURATION || "30s",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<750"],
  },
}

export default function runPerformanceSmoke() {
  group("public smoke", () => {
    const health = http.get(`${BASE_URL}/api/health`)
    check(health, {
      "health responds 200": (response) => response.status === 200,
      "health is not cached": (response) =>
        response.headers["Cache-Control"]?.includes("no-store"),
    })

    const login = http.get(`${BASE_URL}/login`)
    check(login, {
      "login page responds 200": (response) => response.status === 200,
    })
  })

  if (API_TOKEN) {
    group("authenticated reads", () => {
      const params = {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }

      for (const path of ["/api/materias", "/api/equipos", "/api/evaluaciones"]) {
        const response = http.get(`${BASE_URL}${path}`, params)
        check(response, {
          [`${path} responds 200`]: (res) => res.status === 200,
        })
      }
    })
  }

  sleep(1)
}
