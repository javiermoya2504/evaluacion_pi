const AUTH_TOKEN_STORAGE_KEY = "sigep_token"

export async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(input, { ...init, headers })
  if (response.status === 401) throw new Error("Tu sesion expiro. Inicia sesion nuevamente.")
  return response
}
