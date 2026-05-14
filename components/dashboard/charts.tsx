"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const evaluacionesPorMes = [
  { mes: "Ene", evaluaciones: 12, completadas: 10 },
  { mes: "Feb", evaluaciones: 18, completadas: 15 },
  { mes: "Mar", evaluaciones: 25, completadas: 22 },
  { mes: "Abr", evaluaciones: 32, completadas: 28 },
  { mes: "May", evaluaciones: 28, completadas: 25 },
  { mes: "Jun", evaluaciones: 41, completadas: 35 },
]

const proyectosPorCarrera = [
  { carrera: "ISC", proyectos: 14 },
  { carrera: "ITI", proyectos: 10 },
]

const distribucionCalificaciones = [
  { nombre: "Excelente (90-100)", valor: 35, color: "var(--chart-2)" },
  { nombre: "Bueno (80-89)", valor: 40, color: "var(--chart-1)" },
  { nombre: "Regular (70-79)", valor: 18, color: "var(--chart-3)" },
  { nombre: "Deficiente (<70)", valor: 7, color: "var(--chart-4)" },
]

export function EvaluacionesChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Evaluaciones por Mes</CardTitle>
        <CardDescription>Tendencia de evaluaciones realizadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={evaluacionesPorMes}>
              <defs>
                <linearGradient id="colorEvaluaciones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey="mes" 
                stroke="var(--muted-foreground)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--muted-foreground)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="evaluaciones"
                stroke="var(--chart-1)"
                fill="url(#colorEvaluaciones)"
                strokeWidth={2}
                name="Totales"
              />
              <Area
                type="monotone"
                dataKey="completadas"
                stroke="var(--chart-2)"
                fill="url(#colorCompletadas)"
                strokeWidth={2}
                name="Completadas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProyectosPorCarreraChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyectos por Carrera</CardTitle>
        <CardDescription>Distribución ISC vs ITI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={proyectosPorCarrera} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                type="number" 
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="carrera" 
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Bar 
                dataKey="proyectos" 
                fill="var(--chart-1)" 
                radius={[0, 4, 4, 0]}
                name="Proyectos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CalificacionesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Calificaciones</CardTitle>
        <CardDescription>Rendimiento general de equipos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribucionCalificaciones}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="valor"
                nameKey="nombre"
              >
                {distribucionCalificaciones.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span style={{ color: "var(--foreground)", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
