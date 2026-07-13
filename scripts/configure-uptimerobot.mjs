#!/usr/bin/env node

const API_URL = "https://api.uptimerobot.com/v2"

const env = process.env
const apiKey = env.UPTIMEROBOT_API_KEY
const monitorName = env.UPTIMEROBOT_MONITOR_NAME ?? "Evaluacion PI Staging"
const monitorUrl = env.UPTIMEROBOT_MONITOR_URL
const intervalSeconds = env.UPTIMEROBOT_INTERVAL_SECONDS ?? "300"
const alertContacts = normalizeAlertContacts(env.UPTIMEROBOT_ALERT_CONTACT_IDS)
const isDryRun = env.DRY_RUN === "1" || env.DRY_RUN === "true"

if (!apiKey && !isDryRun) {
  fail("Falta UPTIMEROBOT_API_KEY.")
}

if (!monitorUrl) {
  fail("Falta UPTIMEROBOT_MONITOR_URL.")
}

if (!alertContacts) {
  fail(
    "Falta UPTIMEROBOT_ALERT_CONTACT_IDS. Agrega al menos un contacto de email de UptimeRobot.",
  )
}

const desiredMonitor = {
  friendly_name: monitorName,
  url: monitorUrl,
  type: "1",
  interval: intervalSeconds,
  alert_contacts: alertContacts,
}

if (isDryRun) {
  console.log("DRY_RUN=1, no se llamo a UptimeRobot.")
  console.log(JSON.stringify(desiredMonitor, null, 2))
  process.exit(0)
}

const existingMonitor = await findExistingMonitor(monitorUrl)

if (existingMonitor) {
  const response = await callUptimeRobot("editMonitor", {
    id: String(existingMonitor.id),
    ...desiredMonitor,
  })

  console.log(
    `Monitor actualizado: ${existingMonitor.friendly_name} (${existingMonitor.id})`,
  )
  console.log(JSON.stringify(response, null, 2))
} else {
  const response = await callUptimeRobot("addMonitor", desiredMonitor)

  console.log(`Monitor creado: ${monitorName}`)
  console.log(JSON.stringify(response, null, 2))
}

async function findExistingMonitor(url) {
  const response = await callUptimeRobot("getMonitors", {
    search: url,
    logs: "0",
    alert_contacts: "1",
  })

  const monitors = response.monitors ?? []
  return monitors.find((monitor) => monitor.url === url)
}

async function callUptimeRobot(method, params) {
  const body = new URLSearchParams({
    api_key: apiKey,
    format: "json",
    ...params,
  })

  const response = await fetch(`${API_URL}/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok || payload?.stat !== "ok") {
    const message = payload?.error?.message ?? response.statusText
    fail(`UptimeRobot ${method} fallo: ${message}`)
  }

  return payload
}

function normalizeAlertContacts(value) {
  if (!value) {
    return ""
  }

  return value
    .split(",")
    .map((contact) => contact.trim())
    .filter(Boolean)
    .map((contact) => {
      const hasThresholds = contact.split("_").length === 3
      return hasThresholds ? contact : `${contact}_0_0`
    })
    .join("-")
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
