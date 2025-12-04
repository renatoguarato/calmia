import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { GoalForm } from '@/components/goals/GoalForm'
import { goalsService } from '@/services/goals'
import { WellbeingGoal } from '@/types/db'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoalEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [goal, setGoal] = useState<WellbeingGoal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadGoal = useCallback(async () => {
    try {
      if (!id) return
      const data = await goalsService.getGoalById(id)
      setGoal(data)
    } catch (error) {
      console.error('Error loading goal:', error)
      navigate('/goals')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadGoal()
  }, [loadGoal])

  const handleSubmit = async (values: any) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const updates = {
        name: values.name,
        target_value: values.target_value,
        time_period: values.time_period,
        feeling_category_target: values.feeling_category_target,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
      }

      await goalsService.updateGoal(id, updates)
      toast({
        title: 'Meta atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      })
      navigate(`/goals/${id}`)
    } catch (error) {
      console.error('Error updating goal:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar a meta.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to={`/goals/${id}`}>
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">Editar Meta</CardTitle>
          </CardHeader>
          <CardContent>
            {goal && (
              <GoalForm
                defaultValues={goal}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
