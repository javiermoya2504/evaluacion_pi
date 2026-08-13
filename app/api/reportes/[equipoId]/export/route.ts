import * as XLSX from "xlsx"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { NextResponse } from "next/server"
import { errorResponse } from "@/lib/auth"
import { withRoles } from "@/lib/middleware/role"
import { getReporteEquipo } from "@/lib/reportes/store"

const FORMATS = ["csv", "xlsx", "pdf"] as const
const REPORT_HEADERS = ["Fecha", "Rubrica", "Calificacion", "Ponderacion", "Observaciones"]

export const GET = withRoles(["admin", "coordinadora_pi"], async (request, { params }) => {
  const { equipoId } = await params
  const format = new URL(request.url).searchParams.get("format")
  if (!FORMATS.includes(format as (typeof FORMATS)[number])) return errorResponse("Formato no soportado", 400)
  const reporte = await getReporteEquipo(equipoId)
  if (!reporte?.equipo) return errorResponse("Equipo no encontrado", 404)

  const rows = reporte.evaluaciones.map((item) => ({
    Fecha: new Date(item.fecha).toLocaleDateString("es-MX"),
    Rubrica: item.rubrica?.nombre ?? "No disponible",
    Calificacion: Number(item.calificacion.toFixed(2)),
    Ponderacion: Number(item.ponderacion.toFixed(2)),
    Observaciones: item.evaluacion.observaciones || "",
  }))
  const safeName = reporte.equipo.nombre.replace(/[^a-z0-9_-]+/gi, "-").toLowerCase()

  if (format === "csv") {
    const sheet = XLSX.utils.json_to_sheet(rows, { header: REPORT_HEADERS })
    const csv = `\uFEFF${XLSX.utils.sheet_to_csv(sheet)}`
    return new NextResponse(csv, { headers: downloadHeaders(`reporte-${safeName}.csv`, "text/csv; charset=utf-8") })
  }

  if (format === "xlsx") {
    const workbook = XLSX.utils.book_new()
    const summary = XLSX.utils.aoa_to_sheet([
      ["Reporte de equipo", reporte.equipo.nombre],
      ["Materia", reporte.equipo.materia?.nombre ?? "Sin materia"],
      ["Evaluaciones", reporte.evaluaciones.length],
      ["Promedio final", reporte.promedioFinal],
      ["Calificacion ponderada", reporte.calificacionPonderada],
      ["Fecha", new Date(reporte.fechaCreacion)],
    ])
    summary["!cols"] = [{ wch: 24 }, { wch: 34 }]
    const detail = XLSX.utils.json_to_sheet(rows, { header: REPORT_HEADERS })
    detail["!cols"] = [{ wch: 14 }, { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 50 }]
    XLSX.utils.book_append_sheet(workbook, summary, "Resumen")
    XLSX.utils.book_append_sheet(workbook, detail, "Evaluaciones")
    const bytes = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }) as Buffer
    return new NextResponse(bytes, { headers: downloadHeaders(`reporte-${safeName}.xlsx`, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") })
  }

  const pdf = await createPdf(reporte.equipo.nombre, reporte.equipo.materia?.nombre ?? "Sin materia", reporte.calificacionPonderada, rows)
  return new NextResponse(pdf, { headers: downloadHeaders(`reporte-${safeName}.pdf`, "application/pdf") })
})

function downloadHeaders(filename: string, contentType: string) {
  return { "Content-Type": contentType, "Content-Disposition": `attachment; filename="${filename}"`, "Cache-Control": "no-store" }
}

async function createPdf(team: string, subject: string, score: number, rows: Array<Record<string, string | number>>) {
  const document = await PDFDocument.create()
  const regular = await document.embedFont(StandardFonts.Helvetica)
  const bold = await document.embedFont(StandardFonts.HelveticaBold)
  let page = document.addPage([612, 792])
  let y = 742
  const line = (text: string, size = 10, isBold = false) => {
    if (y < 54) { page = document.addPage([612, 792]); y = 742 }
    page.drawText(text.slice(0, 105), { x: 48, y, size, font: isBold ? bold : regular, color: rgb(0.05, 0.18, 0.18) })
    y -= size + 8
  }
  line("SIGEP-PI - Reporte de evaluacion", 18, true)
  line(`Equipo: ${team}`, 12, true)
  line(`Materia: ${subject}`)
  line(`Calificacion final: ${score.toFixed(2)}`)
  line(`Evaluaciones registradas: ${rows.length}`)
  y -= 8
  line("Detalle de evaluaciones", 13, true)
  if (!rows.length) line("Sin evaluaciones registradas.")
  rows.forEach((row, index) => {
    line(`${index + 1}. ${row.Fecha} | ${row.Rubrica} | Calificacion: ${row.Calificacion}`, 10, true)
    if (row.Observaciones) line(`Observaciones: ${row.Observaciones}`)
    y -= 4
  })
  return document.save()
}
