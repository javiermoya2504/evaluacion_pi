import { DashboardHeader } from "@/components/dashboard-header"
import { StatsGrid } from "@/components/dashboard/stats-cards"
import { EvaluacionesChart, ProyectosPorCarreraChart, CalificacionesChart } from "@/components/dashboard/charts"
import { ProyectosRecientes, ActividadReciente } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader 
        title="Dashboard" 
        description="Vista general del sistema de proyectos integradores"
      />
      
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <StatsGrid />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <EvaluacionesChart />
          <CalificacionesChart />
        </div>

        {/* Projects and Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ProyectosRecientes />
          <ActividadReciente />
        </div>
      </div>
    </div>
  )
}
