import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WellbeingGoal } from '@/types/db'
import { goalsService, GoalProgress } from '@/services/goals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GoalCardProps {
  goal: WellbeingGoal
}

export function GoalCard({ goal }: GoalCardProps) {
  const [progress, setProgress] = useState<GoalProgress | null>(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await goalsService.calculateProgress(goal)
        setProgress(data)
      } catch (error) {
        console.error('Error calculating progress:', error)
      }
    }
    fetchProgress()
  }, [goal])

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily':
        return 'Diário'
      case 'weekly':
        return 'Semanal'
      case 'monthly':
        return 'Mensal'
      case 'custom':
        return 'Personalizado'
      default:
        return period
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
      case 'Expired':
        return 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
      default:
        return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 mr-1" />
      case 'Expired':
        return <AlertCircle className="h-4 w-4 mr-1" />
      default:
        return <Target className="h-4 w-4 mr-1" />
    }
  }

  return (
    <Link to={`/goals/${goal.id}`}>
      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-transparent hover:border-primary/20 h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {goal.name}
              </CardTitle>
              <div className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                <span>{getPeriodLabel(goal.time_period)}</span>
                <span>•</span>
                <span>
                  {goal.goal_type === 'feelings'
                    ? `Sentimento: ${goal.feeling_category_target}`
                    : 'Ações Concluídas'}
                </span>
              </div>
            </div>
            {progress && (
              <Badge
                variant="secondary"
                className={cn(
                  'whitespace-nowrap',
                  getStatusColor(progress.status),
                )}
              >
                {getStatusIcon(progress.status)}
                {progress.status === 'Active'
                  ? 'Ativo'
                  : progress.status === 'Completed'
                    ? 'Concluído'
                    : 'Expirado'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {progress ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Progresso</span>
                <span>
                  {progress.current} / {progress.target}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
          ) : (
            <div className="h-10 flex items-center justify-center">
              <div className="h-2 w-full bg-muted animate-pulse rounded-full" />
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
