import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { journalService } from '@/services/journal'
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

const formSchema = z.object({
  content: z.string().min(5, 'Sua entrada deve ter pelo menos 5 caracteres'),
})

type FormValues = z.infer<typeof formSchema>

export default function JournalEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const loadEntry = useCallback(async () => {
    if (!id) return
    try {
      const data = await journalService.getEntryById(id)
      form.reset({ content: data.feeling_description })
    } catch (error) {
      console.error('Error loading entry:', error)
      navigate('/journal')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, form])

  useEffect(() => {
    loadEntry()
  }, [loadEntry])

  const onSubmit = async (data: FormValues) => {
    if (!id) return
    setIsSubmitting(true)
    try {
      await journalService.updateEntry(id, data.content)
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
