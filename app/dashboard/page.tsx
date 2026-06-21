"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Gauge,
  Layers3,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react"

type Metric = {
  label: string
  value: string
  detail: string
  icon: typeof ShieldCheck
  tone: string
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon

  return (
    <Card className="border-none bg-white shadow-sm shadow-slate-200/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{metric.detail}</p>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.tone}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function HeroPanel({
  eyebrow,
  title,
  description,
  action,
  href,
}: {
  eyebrow: string
  title: string
  description: string
  action: string
  href: string
}) {
  return (
    <section className="rounded-2xl bg-[#0b2f2f] p-6 text-white shadow-lg shadow-teal-950/10">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <Badge className="border-white/15 bg-white/10 text-teal-50 hover:bg-white/10">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            {eyebrow}
          </Badge>
          <div className="space-y-2">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            <p className="max-w-2xl text-sm leading-6 text-teal-50/75">{description}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-teal-50/72">Avance del periodo</span>
            <span className="font-semibold">76%</span>
          </div>
          <Progress value={76} className="h-2 bg-white/20" />
          <Button asChild className="mt-2 bg-white text-[#0b2f2f] hover:bg-teal-50">
            <Link href={href}>
              {action}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function CoordinadoraDashboard() {