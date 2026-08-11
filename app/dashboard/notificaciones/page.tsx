"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock3, Eye, Loader2, MailCheck, MailPlus, RefreshCw, Search, Send, UsersRound } from "lucide-react"

type Equipo = {
  id: string
  nombre: string
  materiaId: string
  materia?: { nombre: string; profesor: string } | null
  integrantes?: Array<{ id: string; nombre: string; email: string }>
}

type EmailStatus = "Preparado" | "Enviado" | "Fallido"

type PreparedEmail = {
  id: string
  equipoId: string
  destinatario: string
  equipo: string
  asunto: string
  estado: EmailStatus
  fecha: string
  text: string
  html: string
}

type ReporteEquipo = {
  promedioFinal: number
  calificacionPonderada: number
  evaluaciones: Array<{ calificacion: number; fecha: string }>
}

const AUTH_TOKEN_STORAGE_KEY = "sigep_token"

export default function NotificacionesPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([])
  const [selectedEquipoId, setSelectedEquipoId] = useState("")
  const [preparedRows, setPreparedRows] = useState<PreparedEmail[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPreparing, setIsPreparing] = useState(false)
  const [sendingId, setSendingId] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const selectedEmail = preparedRows.find((row) => row.id === selectedId) ?? preparedRows[0]

  const filteredRows = useMemo(
    () =>
      preparedRows.filter((row) => {
        const searchText = `${row.destinatario} ${row.equipo} ${row.asunto} ${row.estado}`.toLowerCase()
        return searchText.includes(query.toLowerCase())
      }),
    [preparedRows, query],
  )

  const counts = {
    preparados: preparedRows.filter((row) => row.estado === "Preparado").length,
    enviados: preparedRows.filter((row) => row.estado === "Enviado").length,
    fallidos: preparedRows.filter((row) => row.estado === "Fallido").length,
    destinatarios: new Set(preparedRows.map((row) => row.destinatario)).size,
  }

  const loadEquipos = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await authFetch("/api/equipos")
      const data = (await response.json()) as { equipos?: Equipo[]; message?: string }

      if (!response.ok || !data.equipos) {
        throw new Error(data.message ?? "No se pudieron cargar equipos")
      }

      setEquipos(data.equipos)
      setSelectedEquipoId(data.equipos[0]?.id ?? "")
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar equipos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadEquipos()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadEquipos])

  async function prepareFinalEmail() {
    const equipo = equipos.find((item) => item.id === selectedEquipoId)

    if (!equipo) {
      setError("Selecciona un equipo")
      return
    }

    const recipient = equipo.integrantes?.[0]?.email

    if (!recipient) {
      setError("El equipo no tiene integrantes con correo para preparar el envio")
      return
    }

    setIsPreparing(true)
    setError("")
    setMessage("")

    try {
      const reporteResponse = await authFetch(`/api/reportes/${equipo.id}`)
      const reporteData = (await reporteResponse.json()) as { reporte?: ReporteEquipo; message?: string }

      if (!reporteResponse.ok || !reporteData.reporte) {
        throw new Error(reporteData.message ?? "No se pudo obtener el reporte del equipo")
      }

      const promedio = Number.isFinite(reporteData.reporte.promedioFinal)
        ? reporteData.reporte.promedioFinal
        : reporteData.reporte.calificacionPonderada
      const subject = `Resultado final PI - ${equipo.nombre}`
      const text = [
        `Hola, se comparte el resultado final del Proyecto Integrador para ${equipo.nombre}.`,
        `Materia: ${equipo.materia?.nombre ?? "Sin materia asignada"}.`,
        `Calificacion final: ${promedio.toFixed(1)}.`,
        `Evaluaciones registradas: ${reporteData.reporte.evaluaciones.length}.`,
      ].join("\n")
      const html = `
        <p>Hola, se comparte el resultado final del Proyecto Integrador para <strong>${escapeHtml(equipo.nombre)}</strong>.</p>
        <p><strong>Materia:</strong> ${escapeHtml(equipo.materia?.nombre ?? "Sin materia asignada")}</p>
        <p><strong>Calificacion final:</strong> ${promedio.toFixed(1)}</p>
        <p><strong>Evaluaciones registradas:</strong> ${reporteData.reporte.evaluaciones.length}</p>
      `
      const prepared: PreparedEmail = {
        id: `${equipo.id}-${Date.now()}`,
        equipoId: equipo.id,
        destinatario: recipient,
        equipo: equipo.nombre,
        asunto: subject,
        estado: "Preparado",
        fecha: new Date().toISOString(),
        text,
        html,
      }

      setPreparedRows((current) => [prepared, ...current])
      setSelectedId(prepared.id)
      setMessage("Envio final preparado con datos reales del reporte")
    } catch (prepareError) {
      setError(prepareError instanceof Error ? prepareError.message : "No se pudo preparar el envio")
    } finally {
      setIsPreparing(false)
    }
  }

  async function sendEmail(row: PreparedEmail) {
    setSendingId(row.id)
    setError("")
    setMessage("")

    try {
      const response = await authFetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: row.destinatario,
          subject: row.asunto,
          text: row.text,
          html: row.html,
        }),
      })
      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message ?? "No se pudo enviar el correo")
      }

      setPreparedRows((current) =>
        current.map((item) =>
          item.id === row.id ? { ...item, estado: "Enviado", fecha: new Date().toISOString() } : item,
        ),
      )
      setMessage(data.message ?? "Correo encolado correctamente")
    } catch (sendError) {
      setPreparedRows((current) =>
        current.map((item) => (item.id === row.id ? { ...item, estado: "Fallido", fecha: new Date().toISOString() } : item)),
      )
      setError(sendError instanceof Error ? sendError.message : "No se pudo enviar el correo")
    } finally {
      setSendingId("")
    }
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Notificaciones por correo" description="Preparacion, preview y reenvio usando /api/email" />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Preparados" value={String(counts.preparados)} icon={Clock3} tone="bg-amber-50 text-amber-700" />
          <SummaryCard label="Enviados" value={String(counts.enviados)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
          <SummaryCard label="Fallidos" value={String(counts.fallidos)} icon={AlertCircle} tone="bg-rose-50 text-rose-700" />
          <SummaryCard label="Destinatarios" value={String(counts.destinatarios)} icon={UsersRound} tone="bg-blue-50 text-blue-700" />
        </section>

        {message && <StatusMessage tone="success" message={message} />}
        {error && <StatusMessage tone="error" message={error} />}

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle>Envios finales</CardTitle>
                  <CardDescription>Prepara correos desde equipos y reportes reales, luego encola por /api/email</CardDescription>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId} disabled={isLoading || equipos.length === 0}>
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Selecciona equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipos.map((equipo) => (
                        <SelectItem key={equipo.id} value={equipo.id}>
                          {equipo.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="gap-2" onClick={prepareFinalEmail} disabled={isPreparing || isLoading || !selectedEquipoId}>
                    {isPreparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailPlus className="h-4 w-4" />}
                    Preparar envio final
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar correo, equipo o asunto" className="pl-9" />
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Destinatario</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Asunto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
                          No hay envios preparados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRows.map((row) => (
                        <TableRow key={row.id} className={selectedEmail?.id === row.id ? "bg-slate-50/70" : undefined}>
                          <TableCell className="font-medium">{row.destinatario}</TableCell>
                          <TableCell>{row.equipo}</TableCell>
                          <TableCell className="max-w-[230px] truncate">{row.asunto}</TableCell>
                          <TableCell><StatusBadge status={row.estado} /></TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-slate-500">{formatDate(row.fecha)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedId(row.id)}>
                                <Eye className="h-4 w-4" />
                                Preview
                              </Button>
                              <Button variant="outline" size="sm" className="gap-2" onClick={() => sendEmail(row)} disabled={sendingId === row.id}>
                                {sendingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                Reenviar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Preview de plantilla</CardTitle>
              <CardDescription>Contenido exacto que se envia a /api/email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEmail ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                      <MailCheck className="h-4 w-4 text-teal-600" />
                      SIGEP-PI
                    </div>
                    <StatusBadge status={selectedEmail.estado} />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Para</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{selectedEmail.destinatario}</p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Asunto</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{selectedEmail.asunto}</p>
                  <div className="my-4 h-px bg-slate-200" />
                  <pre className="whitespace-pre-wrap rounded-xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">{selectedEmail.text}</pre>
                  <Button className="mt-5 w-full gap-2" onClick={() => sendEmail(selectedEmail)} disabled={sendingId === selectedEmail.id}>
                    {sendingId === selectedEmail.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Reenviar esta plantilla
                  </Button>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Prepara un envio final para ver el preview real.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: EmailStatus }) {
  const className = {
    Preparado: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    Enviado: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    Fallido: "bg-rose-50 text-rose-700 hover:bg-rose-50",
  }[status]

  return <Badge className={className}>{status}</Badge>
}

function SummaryCard({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof CheckCircle2; tone: string }) {
  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusMessage({ tone, message }: { tone: "success" | "error"; message: string }) {
  const className =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700"

  return (
    <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${className}`}>
      {tone === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {message}
    </div>
  )
}

function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  const headers = new Headers(init.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(input, {
    ...init,
    headers,
  })
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}
