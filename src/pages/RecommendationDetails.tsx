import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { feelingsService } from '@/services/feelings'
import { FeelingLog, SuggestedAction } from '@/types/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Loader2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Zap,
  Repeat,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function RecommendationDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    log: FeelingLog
    actions: SuggestedAction[]
  } | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    const loadData = async () => {
      try {
        const result = await feelingsService.getFeelingDetails(id)
        setData(result)
      } catch (error) {
        console.error('Error loading details:', error)
        navigate('/dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, navigate])

  const handleComplete = async (actionId: string) => {
    setCompleting(actionId)
    try {
      await feelingsService.completeAction(actionId)
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          actions: prev.actions.map((a) =>
            a.id === actionId ? { ...a, is_completed: true } : a,
          ),
        }
      })
    } catch (error) {
      console.error('Error completing action:', error)
    } finally {
      setCompleting(null)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await feelingsService.deleteFeeling(id)
      toast({
        title: 'Análise excluída',
        description: 'A análise e todas as ações relacionadas foram removidas.',
      })
      navigate('/history')
    } catch (error) {
      console.error('Error deleting analysis:', error)
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao tentar excluir a análise.',
      })
      setIsDeleting(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const { log, actions } = data
  const ai = log.ai_response
  const immediateActions = actions.filter((a) => a.action_type === 'immediate')
  const routineActions = actions.filter((a) => a.action_type === 'routine')

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header with Back button and Delete Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/history">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Análise & Recomendação
              </h1>
              <p className="text-muted-foreground text-sm">
                Gerado em {new Date(log.created_at).toLocaleDateString('pt-BR')}{' '}
                às{' '}
                {new Date(log.created_at).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 self-start md:self-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Análise
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir esta análise?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente
                  o registro deste sentimento e todas as ações sugeridas
                  associadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    'Excluir'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Risk Assessment Alert */}
        {ai?.risk_assessment?.level === 'high' && (
          <Alert
            variant="destructive"
            className="border-red-500/50 bg-red-500/10"
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Atenção: Nível de Risco Elevado</AlertTitle>
            <AlertDescription>
              Detectamos sinais de alto estresse ou risco.{' '}
              {ai.risk_assessment.emergency_instructions ||
                'Procure ajuda profissional imediatamente.'}
              {ai.risk_assessment.referral_message && (
                <div className="mt-2 font-semibold">
                  {ai.risk_assessment.referral_message}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Empathy Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 p-3 rounded-full shrink-0 hidden md:block">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-primary">
                  Sobre como você se sente
                </h2>
                <p className="text-lg text-foreground/90 italic leading-relaxed">
                  "{ai?.empathy || 'Entendemos seu momento.'}"
                </p>
                <div className="pt-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Contexto original:
                  </p>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2">
                    {log.feeling_description}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Immediate Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h2>Ações Imediatas</h2>
          </div>
          <div className="grid gap-4">
            {immediateActions.map((action) => (
              <Card
                key={action.id}
                className={cn(
                  'transition-all',
                  action.is_completed
                    ? 'opacity-70 bg-muted/30'
                    : 'bg-white border-l-4 border-l-primary',
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-secondary/10 text-secondary border-secondary/20"
                        >
                          {action.action_category}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" /> {action.estimated_time}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold">{action.title}</h3>

                      {action.why_it_helps && (
                        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                          <span className="font-semibold text-primary/80">
                            Por que ajuda:{' '}
                          </span>
                          {action.why_it_helps}
                        </p>
                      )}

                      {action.steps && action.steps.length > 0 && (
                        <div className="space-y-2 mt-4">
                          <p className="text-sm font-semibold">
                            Passo a passo:
                          </p>
                          <ul className="list-none space-y-2 pl-1">
                            {action.steps.map((step, idx) => (
                              <li
                                key={idx}
                                className="flex gap-2 text-sm text-muted-foreground"
                              >
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                                  {idx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      variant={action.is_completed ? 'ghost' : 'default'}
                      onClick={() =>
                        !action.is_completed && handleComplete(action.id)
                      }
                      disabled={action.is_completed || completing === action.id}
                      className={cn(
                        'shrink-0 md:w-32',
                        action.is_completed &&
                          'text-green-600 hover:text-green-700 hover:bg-green-50',
                      )}
                    >
                      {completing === action.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : action.is_completed ? (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" /> Feito
                        </span>
                      ) : (
                        'Concluir'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Routine Adjustments */}
        {routineActions.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Repeat className="h-5 w-5 text-blue-500" />
              <h2>Ajustes de Rotina</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {routineActions.map((action) => (
                <Card key={action.id} className="bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant="outline">{action.estimated_time}</Badge>
                      {action.is_completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-base pt-2">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {action.action_description}
                    </p>
                    {!action.is_completed && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleComplete(action.id)}
                      >
                        Marcar como adotado
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Leader Conversation */}
        {ai?.leader_conversation?.is_appropriate && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <MessageSquare className="h-5 w-5 text-purple-500" />
              <h2>Sugestão de Conversa com Liderança</h2>
            </div>
            <Card className="bg-purple-50/50 border-purple-200">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-purple-900">Contexto</h3>
                  <p className="text-sm text-purple-800/80">
                    {ai.leader_conversation.context}
                  </p>
                </div>
                <Separator className="bg-purple-200" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-purple-900">
                    Modelo de Mensagem
                  </h3>
                  <div className="bg-white p-4 rounded-md border border-purple-100 text-sm text-muted-foreground italic">
                    "{ai.leader_conversation.suggested_message}"
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
