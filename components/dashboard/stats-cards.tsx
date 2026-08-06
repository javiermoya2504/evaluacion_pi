"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  ClipboardList,
  FileCheck,
  BookOpen,
  ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {trend && (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {trend.value}%
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function StatsGrid() {
  const stats = [
    {
      title: "Total Proyectos",
      value: 24,
      description: "Proyectos integradores activos",
      icon: BookOpen,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Equipos Registrados",
      value: 48,
      description: "Equipos en evaluación",
      icon: Users,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Rúbricas Activas",
      value: 15,
      description: "Rúbricas de evaluación",
      icon: ClipboardList,
      trend: { value: 3, isPositive: true },
    },
    {
      title: "Evaluaciones Completadas",
      value: 156,
      description: "Este semestre",
      icon: FileCheck,
      trend: { value: 24, isPositive: true },
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
