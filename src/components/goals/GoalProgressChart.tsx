import { useMemo, useState } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { GoalHistoryPoint } from '@/services/goals'
import { FeelingLog, WellbeingGoal } from '@/types/db'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { Book, TrendingUp } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface GoalProgressChartProps {
  goal: WellbeingGoal
  history: GoalHistoryPoint[]
}

export function GoalProgressChart({ goal, history }: GoalProgressChartProps) {
  const [selectedEntry, setSelectedEntry] = useState<FeelingLog | null>(null)

  const chartData = useMemo(() => {
    return history.map((point) => ({
      ...point,
      // For chart visualization
      formattedDate: format(point.dateObj, 'dd/MM'),
      hasEntry: point.linkedEntries.length > 0 ? point.cumulative : null, // Y position for dot
      entryCount: point.linkedEntries.length,
      // Include entry details for tooltip
      entries: point.linkedEntries,
    }))
  }, [history])

  const chartConfig = {
    cumulative: {
      label: 'Progresso Acumulado',
      color: 'hsl(var(--primary))',
    },
    entries: {
      label: 'Diários Vinculados',
      color: 'hsl(var(--secondary))',
    },
  }

  // Helper to determine dot color based on basic sentiment inference
  const getEntrySentimentColor = (entries: FeelingLog[]) => {
    if (!entries.length) return 'hsl(var(--muted-foreground))'
    // Just check the first entry for simplicity in dot color
    const entry = entries[0]
    const categories =
      (entry.ai_response as any)?.metadata?.primary_categories || []
    const positiveKeywords = [
      'feliz',
      'alegria',
      'gratidão',
      'esperança',
      'confiança',
      'motivação',
    ]
    const negativeKeywords = [
      'tristeza',
      'ansiedade',
      'medo',
      'raiva',
      'estresse',
      'cansaço',
    ]

    const catString = categories.join(' ').toLowerCase()
    if (positiveKeywords.some((k) => catString.includes(k))) return '#22c55e' // green-500
    if (negativeKeywords.some((k) => catString.includes(k))) return '#ef4444' // red-500
    return 'hsl(var(--secondary))' // default
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (!payload.hasEntry) return null

    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={getEntrySentimentColor(payload.entries)}
        stroke="white"
        strokeWidth={2}
        className="cursor-pointer hover:scale-125 transition-transform"
        onClick={() => {
          if (payload.entries && payload.entries.length > 0) {
            setSelectedEntry(payload.entries[0])
          }
        }}
      />
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Evolução e Insights
        </CardTitle>
        <CardDescription>
          Acompanhe como seus registros no diário impactam seu progresso.
          Interaja com os pontos para ver insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={chartConfig}>
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                      <div className="font-bold mb-1">
                        {format(parseISO(data.date), "d 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Progresso: {data.cumulative}
                      </div>
                      {data.entries.length > 0 && (
                        <div className="mt-2 pt-2 border-t">
                          <div className="font-semibold text-secondary-foreground flex items-center gap-1">
                            <Book className="h-3 w-3" />
                            {data.entries.length} Diário(s)
                          </div>
                          <div className="text-muted-foreground italic mt-1 max-w-[200px] truncate">
                            "{data.entries[0].feeling_description}"
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="var(--color-cumulative)"
                fill="var(--color-cumulative)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Scatter
                dataKey="hasEntry"
                shape={<CustomDot />}
                name="Diários"
              />
            </ComposedChart>
          </ChartContainer>
        </div>

        {/* Selected Entry Details */}
        {selectedEntry && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Book className="h-4 w-4 text-secondary" />
                Insight do Diário
              </h4>
              <span className="text-xs text-muted-foreground">
                {format(parseISO(selectedEntry.created_at), "d 'de' MMM", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <p className="text-sm italic text-muted-foreground mb-3">
              "{selectedEntry.feeling_description}"
            </p>
            {(selectedEntry.ai_response as any)?.summary && (
              <div className="text-sm bg-background p-3 rounded border border-secondary/20">
                <span className="font-medium text-secondary-foreground block mb-1">
                  Análise da IA:
                </span>
                {(selectedEntry.ai_response as any).summary}
              </div>
            )}
            <div className="mt-3 flex justify-end">
              <Link to={`/journal/${selectedEntry.id}`}>
                <Button variant="link" size="sm" className="h-auto p-0">
                  Ver diário completo &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
