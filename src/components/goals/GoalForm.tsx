import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { WellbeingGoal } from '@/types/db'

const formSchema = z
  .object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    goal_type: z.enum(['feelings', 'actions_completed'], {
      required_error: 'Selecione um tipo de meta',
    }),
    target_value: z.coerce.number().min(1, 'O alvo deve ser maior que 0'),
    time_period: z.enum(['daily', 'weekly', 'monthly', 'custom'], {
      required_error: 'Selecione um período',
    }),
    feeling_category_target: z.string().optional(),
    start_date: z.date({
      required_error: 'Data de início é obrigatória',
    }),
    end_date: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.goal_type === 'feelings' && !data.feeling_category_target) {
        return false
      }
      return true
    },
    {
      message: 'Categoria de sentimento é obrigatória para metas de sentimento',
      path: ['feeling_category_target'],
    },
  )
  .refine(
    (data) => {
      if (data.end_date && data.start_date > data.end_date) {
        return false
      }
      return true
    },
    {
      message: 'Data final deve ser posterior à data inicial',
      path: ['end_date'],
    },
  )

type FormValues = z.infer<typeof formSchema>

interface GoalFormProps {
  defaultValues?: Partial<WellbeingGoal>
  onSubmit: (values: any) => Promise<void>
  isSubmitting?: boolean
}

export function GoalForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: GoalFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      goal_type: defaultValues?.goal_type || 'actions_completed',
      target_value: defaultValues?.target_value || 1,
      time_period: defaultValues?.time_period || 'weekly',
      feeling_category_target: defaultValues?.feeling_category_target || '',
      start_date: defaultValues?.start_date
        ? new Date(defaultValues.start_date)
        : new Date(),
      end_date: defaultValues?.end_date
        ? new Date(defaultValues.end_date)
        : undefined,
    },
  })

  const goalType = form.watch('goal_type')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Meta</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Manter a calma no trabalho"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="goal_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Meta</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!!defaultValues} // Disable changing type on edit
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="actions_completed">
                      Ações Concluídas
                    </SelectItem>
                    <SelectItem value="feelings">
                      Sentimentos Registrados
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Escolha se deseja focar em realizar ações ou monitorar
                  sentimentos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Período</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="custom">
                      Período Personalizado
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {goalType === 'feelings' && (
          <FormField
            control={form.control}
            name="feeling_category_target"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria de Sentimento</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Ansiedade, Felicidade, Calma..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Digite a categoria de sentimento que deseja monitorar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="target_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alvo (Quantidade)</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormDescription>
                Quantas vezes deseja atingir isso no período selecionado?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data Final (Opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Sem data final</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < form.getValues('start_date')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Meta'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
