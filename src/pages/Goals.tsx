import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { goalsService } from '@/services/goals'
import { WellbeingGoal } from '@/types/db'
import { GoalCard } from '@/components/goals/GoalCard'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Target } from 'lucide-react'

export default function Goals() {
  const [goals, setGoals] = useState<WellbeingGoal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      const data = await goalsService.getGoals()
      setGoals(data)
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Target size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Metas de Bem-estar
              </h1>
              <p className="text-muted-foreground">
                Defina e acompanhe seus objetivos para uma vida mais
                equilibrada.
              </p>
            </div>
          </div>
          <Link to="/goals/new">
            <Button
              size="lg"
              className="w-full md:w-auto shadow-lg shadow-primary/20"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nova Meta
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed shadow-sm">
            <div className="bg-primary/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma meta definida
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Comece definindo pequenos objetivos para acompanhar sua evolução
              emocional e hábitos saudáveis.
            </p>
            <Link to="/goals/new">
              <Button>Criar minha primeira meta</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
