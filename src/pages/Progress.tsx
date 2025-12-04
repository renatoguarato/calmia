import { useEffect, useState, useMemo } from 'react'
import { feelingsService } from '@/services/feelings'
import { FeelingLog, SuggestedAction } from '@/types/db'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  Loader2,
  TrendingUp,
  CheckCircle2,
  BrainCircuit,
  CalendarDays,
} from 'lucide-react'
import {
  format,
  subDays,
  isAfter,
  parseISO,
  startOfDay,
  isEqual,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

type TimeRange = '7days' | '30days' | 'all'

export default function Progress() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<FeelingLog[]>([])
  const [actions, setActions] = useState<SuggestedAction[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>('7days')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsData, actionsData] = await Promise.all([
          feelingsService.getHistory(),
          feelingsService.getAllActions(),
        ])
        setLogs(logsData)
        setActions(actionsData)
      } catch (error) {
        console.error('Error loading progress data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = new Date()
    let startDate: Date | null = null

    if (timeRange === '7days') startDate = subDays(now, 7)
    if (timeRange === '30days') startDate = subDays(now, 30)

    const filteredLogs = startDate
      ? logs.filter((log) => isAfter(parseISO(log.created_at), startDate!))
      : logs

    const filteredActions = startDate
      ? actions.filter((action) =>
          isAfter(parseISO(action.created_at), startDate!),
        )
      : actions

    return { filteredLogs, filteredActions }
  }, [logs, actions, timeRange])

  // Prepare Activity Chart Data (Logs vs Completed Actions over time)
  const activityChartData = useMemo(() => {
    const { filteredLogs, filteredActions } = filteredData
    const dataMap = new Map<
      string,
      { date: string; feelings: number; completedActions: number }
    >()

    // Initialize map with logs
    filteredLogs.forEach((log) => {
      const dateKey = format(parseISO(log.created_at), 'yyyy-MM-dd')
      if (!dataMap.has(dateKey)) {
        dataMap.set(dateKey, {
          date: dateKey,
          feelings: 0,
          completedActions: 0,
        })
      }
      dataMap.get(dateKey)!.feelings += 1
    })

    // Add actions to map
    filteredActions.forEach((action) => {
      // We use created_at for actions to show when they were suggested/created,
      // OR completed_at to show when they were done.
      // For "Progress", showing when they were completed makes more sense for "Action" metric.
      if (action.is_completed && action.completed_at) {
        const dateKey = format(parseISO(action.completed_at), 'yyyy-MM-dd')
        // Filter logic applied above was on created_at, we should double check completed_at
        // But for simplicity let's assume we track activity on the day it happened
        if (!dataMap.has(dateKey)) {
          // If date is not in range (e.g. completed today but created 31 days ago), we might miss it if strict.
          // But here we build the map dynamically.
          dataMap.set(dateKey, {
            date: dateKey,
            feelings: 0,
            completedActions: 0,
          })
        }
        dataMap.get(dateKey)!.completedActions += 1
      }
    })

    // Sort by date
    return Array.from(dataMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    )
  }, [filteredData])

  // Prepare Emotions Summary Data
  const emotionsData = useMemo(() => {
    const { filteredLogs } = filteredData
    const emotionCounts = new Map<string, number>()

    filteredLogs.forEach((log) => {
      let category = 'Geral'
      if (log.feeling_category && log.feeling_category !== 'general') {
        category = log.feeling_category
      } else if (log.ai_response && typeof log.ai_response === 'object') {
        // Try to extract from AI response metadata
        const metadata = (log.ai_response as any)?.metadata
        if (metadata?.primary_categories?.[0]) {
          category = metadata.primary_categories[0]
        }
      }

      // Capitalize first letter
      category = category.charAt(0).toUpperCase() + category.slice(1)

      emotionCounts.set(category, (emotionCounts.get(category) || 0) + 1)
    })

    return Array.from(emotionCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5
  }, [filteredData])

  const stats = useMemo(() => {
    const { filteredLogs, filteredActions } = filteredData
    const completed = filteredActions.filter((a) => a.is_completed).length
    const total = filteredActions.length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      feelingsCount: filteredLogs.length,
      completedActions: completed,
      completionRate: rate,
    }
  }, [filteredData])

  const chartConfig = {
    feelings: {
      label: 'Sentimentos Registrados',
      color: 'hsl(var(--primary))',
    },
    completedActions: {
      label: 'Ações Concluídas',
      color: 'hsl(var(--secondary))',
    },
  }

  const barChartConfig = {
    value: {
      label: 'Ocorrências',
      color: 'hsl(var(--chart-2))',
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const hasData = logs.length > 0

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Seu Progresso
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua jornada de bem-estar e evolução emocional.
            </p>
          </div>

          <Select
            value={timeRange}
            onValueChange={(val: TimeRange) => setTimeRange(val)}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="all">Todo o período</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hasData ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <BrainCircuit size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Nenhum registro encontrado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Comece a registrar seus sentimentos para visualizar seu
                  progresso e receber insights personalizados.
                </p>
              </div>
              <Link to="/dashboard">
                <Button size="lg" className="mt-4">
                  Registrar Sentimento
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ações Concluídas
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completedActions}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completionRate}% de taxa de conclusão
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sentimentos Registrados
                  </CardTitle>
                  <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.feelingsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">neste período</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Dias Ativos
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activityChartData.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    dias com registros
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity History Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Evolução do Bem-Estar</CardTitle>
                  <CardDescription>
                    Comparativo entre seus registros de sentimentos e ações
                    realizadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {activityChartData.length > 0 ? (
                      <ChartContainer config={chartConfig}>
                        <AreaChart
                          data={activityChartData}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid
                            vertical={false}
                            strokeDasharray="3 3"
                          />
                          <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) =>
                              format(parseISO(value), 'dd/MM')
                            }
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Area
                            type="monotone"
                            dataKey="feelings"
                            stackId="1"
                            stroke="var(--color-feelings)"
                            fill="var(--color-feelings)"
                            fillOpacity={0.4}
                            name="Sentimentos"
                          />
                          <Area
                            type="monotone"
                            dataKey="completedActions"
                            stackId="2"
                            stroke="var(--color-completedActions)"
                            fill="var(--color-completedActions)"
                            fillOpacity={0.4}
                            name="Ações Concluídas"
                          />
                        </AreaChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sem dados suficientes para o gráfico.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Emotions Summary Chart */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Emoções Frequentes</CardTitle>
                  <CardDescription>
                    As 5 emoções mais identificadas nos seus registros.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {emotionsData.length > 0 ? (
                      <ChartContainer config={barChartConfig}>
                        <BarChart
                          data={emotionsData}
                          layout="vertical"
                          margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                        >
                          <CartesianGrid
                            horizontal={false}
                            strokeDasharray="3 3"
                          />
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            width={100}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar
                            dataKey="value"
                            fill="var(--color-value)"
                            radius={[0, 4, 4, 0]}
                            name="Registros"
                          />
                        </BarChart>
                      </ChartContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Sem dados de emoções.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Motivation Card */}
              <Card className="lg:col-span-1 bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
                <CardHeader>
                  <CardTitle className="text-primary">
                    Continue Assim!
                  </CardTitle>
                  <CardDescription>
                    Cada registro é um passo importante para o autoconhecimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    Ao acompanhar seu progresso, você consegue identificar
                    padrões e agir preventivamente.
                    {stats.completedActions > 0
                      ? ` Você já concluiu ${stats.completedActions} ações para melhorar seu bem-estar!`
                      : ' Que tal realizar sua primeira ação sugerida hoje?'}
                  </p>
                  <div className="pt-4">
                    <Link to="/dashboard">
                      <Button
                        variant="outline"
                        className="w-full bg-background/50 hover:bg-background"
                      >
                        Novo Registro
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
