import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { journalService } from '@/services/journal'
import { goalsService } from '@/services/goals'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { WellbeingGoal } from '@/types/db'
import { GoalSelector } from '@/components/journal/GoalSelector'

const formSchema = z.object({
  content: z.string().min(5, 'Sua entrada deve ter pelo menos 5 caracteres'),
  goalIds: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function JournalCreate() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableGoals, setAvailableGoals] = useState<WellbeingGoal[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      goalIds: [],
    },
  })

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goals = await goalsService.getGoals()
        setAvailableGoals(goals)
      } catch (error) {
        console.error('Failed to fetch goals', error)
      }
    }
    fetchGoals()
  }, [])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await journalService.createEntry(data.content, data.goalIds)
      toast({
        title: 'Entrada salva!',
        description:
          'Sua entrada foi registrada e está sendo analisada pela IA.',
      })
      navigate('/journal')
    } catch (error) {
      console.error('Error creating journal entry:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar sua entrada.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/journal">
          <Button
            variant="ghost"
            className="mb-6 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Diário
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display">
              Nova Entrada
            </CardTitle>
            <CardDescription>
              Escreva livremente sobre como você está se sentindo hoje.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu texto</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hoje eu me senti..."
                          className="min-h-[300px] resize-none text-base leading-relaxed p-4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goalIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vincular a Metas</FormLabel>
                      <FormControl>
                        <GoalSelector
                          goals={availableGoals}
                          selectedGoalIds={field.value || []}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Entrada
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
