import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { WellbeingGoal } from '@/types/db'
import { GoalSelector } from '@/components/journal/GoalSelector'

const formSchema = z.object({
  content: z.string().min(5, 'Sua entrada deve ter pelo menos 5 caracteres'),
  goalIds: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function JournalEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [availableGoals, setAvailableGoals] = useState<WellbeingGoal[]>([])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      goalIds: [],
    },
  })

  const loadData = useCallback(async () => {
    if (!id) return
    try {
      const [entry, goals] = await Promise.all([
        journalService.getEntryById(id),
        goalsService.getGoals(),
      ])

      setAvailableGoals(goals)
      form.reset({
        content: entry.feeling_description,
        goalIds: entry.goals?.map((g) => g.id) || [],
      })
    } catch (error) {
      console.error('Error loading data:', error)
      navigate('/journal')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, form])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onSubmit = async (data: FormValues) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      await journalService.updateEntry(id, data.content, data.goalIds)
      toast({
        title: 'Entrada atualizada!',
        description: 'Sua entrada foi salva e será reanalisada pela IA.',
      })
      navigate(`/journal/${id}`)
    } catch (error) {
      console.error('Error updating journal entry:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar sua entrada.',
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
        <Link to={`/journal/${id}`}>
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
            <CardTitle className="text-2xl font-display">
              Editar Entrada
            </CardTitle>
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
                        Salvar Alterações
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
