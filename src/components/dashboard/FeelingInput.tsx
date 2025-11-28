import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { feelingsService } from '@/services/feelings'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Sparkles } from 'lucide-react'
import { SuggestedAction } from '@/types/db'

interface FeelingInputProps {
  onActionGenerated: (action: SuggestedAction) => void
}

export function FeelingInput({ onActionGenerated }: FeelingInputProps) {
  const [feeling, setFeeling] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feeling.trim()) return

    setIsLoading(true)
    try {
      const action = await feelingsService.logFeeling(feeling)
      onActionGenerated(action)
      setFeeling('')
      toast({
        title: 'Sentimento registrado',
        description: 'A CalmIA gerou uma nova recomendação para você.',
      })
    } catch (error: any) {
      console.error('Error logging feeling:', error)
      toast({
        variant: 'destructive',
        title: 'Erro',
        description:
          error.message ||
          'Não foi possível processar seu sentimento. Tente novamente.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full border-primary/20 shadow-md bg-gradient-to-br from-white to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-display text-primary">
          <Sparkles className="h-6 w-6" />
          Como você está se sentindo agora?
        </CardTitle>
        <CardDescription>
          Descreva seu momento atual para receber uma recomendação
          personalizada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Ex: Estou me sentindo sobrecarregado com muitas reuniões e prazos apertados..."
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            className="min-h-[120px] resize-none text-lg p-4 bg-white/80 backdrop-blur-sm focus:ring-primary/20"
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!feeling.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                'Receber Recomendação'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
