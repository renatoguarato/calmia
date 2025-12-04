import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { GoalForm } from '@/components/goals/GoalForm'
import { goalsService } from '@/services/goals'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function GoalCreate() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true)
    try {
      // Ensure dates are ISO strings for API/Supabase
      const goalData = {
        ...values,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date ? values.end_date.toISOString() : null,
      }
      await goalsService.createGoal(goalData)
      toast({
        title: 'Meta criada!',
        description: 'Seu novo objetivo foi definido com sucesso.',
      })
      navigate('/goals')
    } catch (error) {
      console.error('Error creating goal:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível criar a meta.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/goals">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Metas
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">
              Nova Meta de Bem-estar
            </CardTitle>
            <CardDescription>
              Defina o que você quer alcançar. Metas claras ajudam no
              engajamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoalForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
