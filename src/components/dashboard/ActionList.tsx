import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { feelingsService } from '@/services/feelings'
import { SuggestedAction } from '@/types/db'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ActionListProps {
  newAction?: SuggestedAction | null
}

export function ActionList({ newAction }: ActionListProps) {
  const [actions, setActions] = useState<SuggestedAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActions()
  }, [])

  useEffect(() => {
    if (newAction) {
      setActions((prev) => [newAction, ...prev])
    }
  }, [newAction])

  const loadActions = async () => {
    try {
      const data = await feelingsService.getRecentActions()
      setActions(data)
    } catch (error) {
      console.error('Error loading actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      await feelingsService.completeAction(id)
      setActions((prev) =>
        prev.map((action) =>
          action.id === id
            ? {
                ...action,
                is_completed: true,
                completed_at: new Date().toISOString(),
              }
            : action,
        ),
      )
    } catch (error) {
      console.error('Error completing action:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (actions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed border-border">
        <p>
          Nenhuma recomendação ainda. Conte como você está se sentindo para
          começar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-semibold text-foreground mb-4">
        Suas Recomendações Recentes
      </h3>
      {actions.map((action) => (
        <Card
          key={action.id}
          className={cn(
            'transition-all duration-300 hover:shadow-md',
            action.is_completed
              ? 'bg-muted/50 opacity-70'
              : 'bg-white border-l-4 border-l-primary',
          )}
        >
          <CardContent className="p-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-secondary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {action.action_category || 'Geral'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(
                    new Date(action.created_at),
                    "d 'de' MMMM 'às' HH:mm",
                    { locale: ptBR },
                  )}
                </span>
              </div>
              <p
                className={cn(
                  'text-lg font-medium',
                  action.is_completed && 'line-through text-muted-foreground',
                )}
              >
                {action.action_description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !action.is_completed && handleComplete(action.id)}
              disabled={action.is_completed}
              className={cn(
                'shrink-0 rounded-full h-10 w-10',
                action.is_completed
                  ? 'text-green-600'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10',
              )}
            >
              {action.is_completed ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6" />
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
