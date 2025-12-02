import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { feelingsService } from '@/services/feelings'
import { SuggestedAction } from '@/types/db'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Link } from 'react-router-dom'

export function ActionList() {
  const [actions, setActions] = useState<SuggestedAction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActions()
  }, [])

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
      setActions((prev) => prev.filter((action) => action.id !== id))
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
        <p className="mb-2">Você não tem ações pendentes.</p>
        <Link to="/history" className="text-primary hover:underline text-sm">
          Ver histórico completo
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-semibold text-foreground">
          Suas Ações Pendentes
        </h3>
        <Link to="/history" className="text-sm text-primary hover:underline">
          Ver Histórico
        </Link>
      </div>

      {actions.map((action) => (
        <Card
          key={action.id}
          className="transition-all duration-300 hover:shadow-md bg-white border-l-4 border-l-primary"
        >
          <CardContent className="p-6 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-secondary/20 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  {action.action_category || 'Geral'}
                </span>
                {action.estimated_time && (
                  <span className="flex items-center gap-1 text-xs">
                    <Clock className="h-3 w-3" />
                    {action.estimated_time}
                  </span>
                )}
                <span className="text-xs">•</span>
                <span className="text-xs">
                  {format(new Date(action.created_at), 'd MMM', {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">
                  {action.title || action.action_description}
                </h4>
                {action.title && action.action_description !== action.title && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {action.action_description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleComplete(action.id)}
              className="shrink-0 rounded-full h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Circle className="h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
