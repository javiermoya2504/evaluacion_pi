
"use client"

import { useMemo, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock3, Eye, MailCheck, MailPlus, RefreshCw, Search, Send, UsersRound } from "lucide-react"

type EmailStatus = "Enviado" | "Pendiente" | "Fallido"

type EmailRow = {
  id: string
  destinatario: string
  tipo: "Lider" | "Profesor"
  equipo: string
  asunto: string
  estado: EmailStatus
  fecha: string
  calificacion: number
  retroalimentacion: string
}

const initialEmailLog: EmailRow[] = [
  {
    id: "MAIL-1042",
    destinatario: "carlos.mendez@upq.edu.mx",
    tipo: "Lider",
    equipo: "Equipo Aurum",
    asunto: "Resultado final PI - Equipo Aurum",
    estado: "Enviado",
    fecha: "2026-07-13 09:35",
    calificacion: 91.4,
    retroalimentacion: "El equipo demuestra una solucion completa, con buena arquitectura y evidencias claras de cierre.",
  },
  {
    id: "MAIL-1041",
    destinatario: "ana.sofia@upq.edu.mx",
    tipo: "Profesor",
    equipo: "Equipo Aurum",
    asunto: "Cierre de evaluacion PI - Equipo Aurum",
    estado: "Enviado",
    fecha: "2026-07-13 09:34",
    calificacion: 91.4,
    retroalimentacion: "Se notifico el desglose final y la retroalimentacion consolidada para validacion docente.",
  },
  {
    id: "MAIL-1040",
    destinatario: "laura.ramirez@upq.edu.mx",
    tipo: "Lider",
    equipo: "Equipo Nexus",
    asunto: "Resultado final PI - Equipo Nexus",
    estado: "Pendiente",
    fecha: "2026-07-13 09:22",
    calificacion: 79.8,
    retroalimentacion: "El reporte esta en cola porque falta confirmar el cierre de una rubrica final.",
  },
  {
    id: "MAIL-1039",
    destinatario: "daniel.hernandez@upq.edu.mx",
    tipo: "Profesor",
    equipo: "Equipo Nexus",
    asunto: "Cierre de evaluacion PI - Equipo Nexus",
    estado: "Fallido",
    fecha: "2026-07-13 08:58",
    calificacion: 79.8,
    retroalimentacion: "El envio fallo por respuesta SMTP. Se recomienda reenviar despues de validar el correo institucional.",
  },
  {
    id: "MAIL-1038",
    destinatario: "roberto.diaz@upq.edu.mx",
    tipo: "Lider",
    equipo: "Equipo Innova",
    asunto: "Resultado final PI - Equipo Innova",
    estado: "Enviado",
    fecha: "2026-07-12 17:44",
    calificacion: 94.2,
    retroalimentacion: "Proyecto sobresaliente, con integracion tecnica consistente y documentacion suficiente para entrega final.",
  },
]

const statusOptions = ["Todos", "Enviado", "Pendiente", "Fallido"]
const teamOptions = ["Todos", "Equipo Aurum", "Equipo Nexus", "Equipo Innova"]

export default function NotificacionesPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("Todos")
  const [team, setTeam] = useState("Todos")
  const [emailRows, setEmailRows] = useState(initialEmailLog)
  const [selectedId, setSelectedId] = useState(initialEmailLog[0].id)

  const selectedEmail = emailRows.find((row) => row.id === selectedId) ?? emailRows[0]

  const filteredRows = useMemo(
    () => emailRows.filter((row) => {
      const searchText = `${row.destinatario} ${row.equipo} ${row.asunto} ${row.estado}`.toLowerCase()
      return (
        searchText.includes(query.toLowerCase()) &&
        (status === "Todos" || row.estado === status) &&
        (team === "Todos" || row.equipo === team)
      )
    }),
    [emailRows, query, status, team]
  )

  const counts = {
    enviados: emailRows.filter((row) => row.estado === "Enviado").length,
    pendientes: emailRows.filter((row) => row.estado === "Pendiente").length,
    fallidos: emailRows.filter((row) => row.estado === "Fallido").length,
    destinatarios: new Set(emailRows.map((row) => row.destinatario)).size,
  }

  const resendEmail = (id: string) => {
    setEmailRows((rows) => rows.map((row) => row.id === id ? { ...row, estado: "Pendiente", fecha: "2026-07-13 10:10" } : row))
    setSelectedId(id)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Notificaciones por correo"
        description="Sprint 9: historial de envios, preview de plantilla y reenvio de calificaciones finales"
      />

      <div className="flex-1 space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Correos enviados" value={String(counts.enviados)} detail="Notificaciones confirmadas" icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" />
          <SummaryCard label="Pendientes" value={String(counts.pendientes)} detail="En cola de envio" icon={Clock3} tone="bg-amber-50 text-amber-700" />
          <SummaryCard label="Fallidos" value={String(counts.fallidos)} detail="Requieren reenvio" icon={AlertCircle} tone="bg-rose-50 text-rose-700" />
          <SummaryCard label="Destinatarios" value={String(counts.destinatarios)} detail="Lideres y profesores" icon={UsersRound} tone="bg-blue-50 text-blue-700" />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <CardTitle>Historial de correos enviados</CardTitle>
                  <CardDescription>Vista frontend de la tabla email_log: destinatario, asunto, estado y fecha de envio</CardDescription>
                </div>
                <Button className="gap-2">
                  <MailPlus className="h-4 w-4" />
                  Preparar envio final
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-[1.2fr_0.7fr_0.7fr]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar correo, equipo o asunto" className="pl-9" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Destinatario</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Asunto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((row) => (
                      <TableRow key={row.id} className={selectedEmail.id === row.id ? "bg-slate-50/70" : undefined}>
                        <TableCell className="font-semibold">{row.id}</TableCell>
                        <TableCell>
                          <p className="font-medium text-slate-950">{row.destinatario}</p>
                          <p className="text-xs text-slate-500">{row.tipo}</p>
                        </TableCell>
                        <TableCell>{row.equipo}</TableCell>
                        <TableCell className="max-w-[230px] truncate">{row.asunto}</TableCell>
                        <TableCell><StatusBadge status={row.estado} /></TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-slate-500">{row.fecha}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedId(row.id)}>
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => resendEmail(row.id)}>
                              <RefreshCw className="h-4 w-4" />
                              Reenviar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
            <CardHeader>
              <CardTitle>Preview de plantilla</CardTitle>
              <CardDescription>Vista previa antes de enviar al lider o profesor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <p className="text-sm leading-6 text-slate-700">
                  Hola, se comparte el resultado final del Proyecto Integrador para <span className="font-semibold text-slate-950">{selectedEmail.equipo}</span>.
                </p>
                <div className="my-4 rounded-xl bg-white p-4 text-center shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Calificacion final</p>
                  <p className="mt-2 text-4xl font-semibold text-slate-950">{selectedEmail.calificacion.toFixed(1)}</p>
                </div>
                <p className="text-sm leading-6 text-slate-700">{selectedEmail.retroalimentacion}</p>
                <Button className="mt-5 w-full gap-2" onClick={() => resendEmail(selectedEmail.id)}>
                  <Send className="h-4 w-4" />
                  Reenviar esta plantilla
                </Button>
              </div>

              <div className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">
                <span className="font-semibold">Entrega Sprint 9:</span> esta pantalla deja listo el consumo visual para el endpoint POST /notificaciones/enviar/:evaluacionId y la tabla email_log.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: EmailStatus }) {
  const className = {
    Enviado: "bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
    Pendiente: "bg-amber-50 text-amber-700 hover:bg-amber-50",
    Fallido: "bg-rose-50 text-rose-700 hover:bg-rose-50",
  }[status]

  return <Badge className={className}>{status}</Badge>
}

function SummaryCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof CheckCircle2; tone: string }) {
  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}
