import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { journalService } from '@/services/journal'
import { FeelingLog, AIJournalAnalysis } from '@/types/db'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  Brain,
  TrendingUp,
  Sparkles,
  Target,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function JournalDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [entry, setEntry] = useState<FeelingLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [analysis, setAnalysis] = useState<AIJournalAnalysis | null>(null)

  const loadEntry = useCallback(async () => {
    if (!id) return
    try {
      const data = await journalService.getEntryById(id)
      setEntry(data)
      if (data.ai_response) {
        setAnalysis(data.ai_response as AIJournalAnalysis)
      }
    } catch (error) {
      console.error('Error loading journal entry:', error)
      navigate('/journal')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadEntry()
    // Poll for AI analysis if not available yet
    const pollInterval = setInterval(() => {
      if (entry && !entry.ai_response) {
        loadEntry()
      }
    }, 5000)
    return () => clearInterval(pollInterval)
  }, [loadEntry, entry])

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await journalService.deleteEntry(id)
      toast({
        title: 'Entrada excluída',
        description: 'Sua entrada foi removida com sucesso.',
      })
      navigate('/journal')
    } catch (error) {
      console.error('Error deleting entry:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir a entrada.',
      })
      setIsDeleting(false)
    }
  }

  if (loading || !entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/journal">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Detalhes da Entrada
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                {format(
                  new Date(entry.created_at),
                  "d 'de' MMMM, yyyy 'às' HH:mm",
                  {
                    locale: ptBR,
                  },
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/journal/${id}/edit`}>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir esta entrada?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. O registro será removido
                    permanentemente.
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
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-md">
              <CardContent className="p-8 text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
                {entry.feeling_description}
              </CardContent>
            </Card>

            {/* Linked Goals */}
            {entry.goals && entry.goals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Metas Vinculadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entry.goals.map((goal) => (
                    <Link key={goal.id} to={`/goals/${goal.id}`}>
                      <Badge
                        variant="secondary"
                        className="px-3 py-1.5 text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
                      >
                        {goal.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Brain className="h-5 w-5" />
                  Análise da IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysis ? (
                  <>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Resumo
                      </h4>
                      <p className="text-sm text-foreground/80 leading-relaxed italic">
                        "{analysis.summary}"
                      </p>
                    </div>

                    {analysis.category && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                          Emoção Predominante
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        >
                          {analysis.category}
                        </Badge>
                      </div>
                    )}

                    {analysis.emotional_trends &&
                      analysis.emotional_trends.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" /> Tendências
                          </h4>
                          <ul className="space-y-2">
                            {analysis.emotional_trends.map((trend, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-foreground/80 flex gap-2 items-start"
                              >
                                <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-primary/50 shrink-0" />
                                {trend}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    <p className="text-sm">Processando análise...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
