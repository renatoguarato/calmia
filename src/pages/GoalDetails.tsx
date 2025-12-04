import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { goalsService, GoalProgress } from '@/services/goals'
import { WellbeingGoal } from '@/types/db'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
  Loader2,
  ArrowLeft,
  Trash2,
  Edit,
  Calendar,
  Target,
  Zap,
  Heart,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function GoalDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [goal, setGoal] = useState<WellbeingGoal | null>(null)
  const [progress, setProgress] = useState<GoalProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      if (!id) return
      const goalData = await goalsService.getGoalById(id)
      setGoal(goalData)

      const progressData = await goalsService.calculateProgress(goalData)
      setProgress(progressData)
    } catch (error) {
      console.error('Error loading goal details:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível carregar os detalhes da meta.',
      })
      navigate('/goals')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await goalsService.deleteGoal(id)
      toast({
        title: 'Meta excluída',
        description: 'A meta foi removida com sucesso.',
      })
      navigate('/goals')
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível excluir a meta.',
      })
      setIsDeleting(false)
    }
  }

  if (loading || !goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/goals">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Detalhes da Meta
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/goals/${id}/edit`}>
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
                  <AlertDialogTitle>Excluir esta meta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
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

        <div className="grid gap-6">
          {/* Status Card */}
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-primary">
                    {goal.name}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {goal.goal_type === 'feelings'
                      ? 'Meta de Sentimento'
                      : 'Meta de Ações'}
                  </p>
                </div>
                {progress && (
                  <Badge
                    className={
                      progress.status === 'Completed'
                        ? 'bg-green-500 hover:bg-green-600'
                        : progress.status === 'Expired'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                    }
                  >
                    {progress.status === 'Active'
                      ? 'Em Andamento'
                      : progress.status === 'Completed'
                        ? 'Concluída'
                        : 'Expirada'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Progresso Atual</span>
                  <span>{progress?.percentage}%</span>
                </div>
                <Progress value={progress?.percentage || 0} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {progress?.current} de {progress?.target} completados
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Definição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Tipo</span>
                  <span className="font-medium flex items-center gap-2">
                    {goal.goal_type === 'feelings' ? (
                      <Heart className="h-4 w-4" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {goal.goal_type === 'feelings' ? 'Sentimentos' : 'Ações'}
                  </span>
                </div>
                {goal.goal_type === 'feelings' && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Categoria</span>
                    <span className="font-medium">
                      {goal.feeling_category_target}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Alvo</span>
                  <span className="font-medium">{goal.target_value} vezes</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-medium capitalize">
                    {goal.time_period === 'daily'
                      ? 'Diário'
                      : goal.time_period === 'weekly'
                        ? 'Semanal'
                        : goal.time_period === 'monthly'
                          ? 'Mensal'
                          : 'Personalizado'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Vigência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Início</span>
                  <p className="font-medium text-lg">
                    {format(parseISO(goal.start_date), "d 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Término</span>
                  <p className="font-medium text-lg">
                    {goal.end_date
                      ? format(parseISO(goal.end_date), "d 'de' MMMM, yyyy", {
                          locale: ptBR,
                        })
                      : 'Indeterminado'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
