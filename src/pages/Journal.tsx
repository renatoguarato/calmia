import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { journalService } from '@/services/journal'
import { FeelingLog } from '@/types/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Book,
  Plus,
  ChevronRight,
  Calendar,
  Brain,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Journal() {
  const [entries, setEntries] = useState<FeelingLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await journalService.getEntries()
        setEntries(data)
      } catch (error) {
        console.error('Error loading journal entries:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEntries()
  }, [])

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full text-primary">
              <Book size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Seu Diário
              </h1>
              <p className="text-muted-foreground">
                Registre seus pensamentos e acompanhe sua evolução emocional.
              </p>
            </div>
          </div>
          <Link to="/journal/new">
            <Button
              size="lg"
              className="w-full md:w-auto shadow-lg shadow-primary/20"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nova Entrada
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed shadow-sm">
            <div className="bg-primary/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-primary">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Seu diário está vazio
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Escrever sobre seus sentimentos ajuda a processar emoções e
              reduzir o estresse. Que tal começar agora?
            </p>
            <Link to="/journal/new">
              <Button>Criar primeira entrada</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link key={entry.id} to={`/journal/${entry.id}`}>
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-transparent hover:border-primary/20">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {format(
                          new Date(entry.created_at),
                          "d 'de' MMMM, yyyy",
                          {
                            locale: ptBR,
                          },
                        )}
                        <span className="text-muted-foreground/40">•</span>
                        {format(new Date(entry.created_at), 'HH:mm', {
                          locale: ptBR,
                        })}
                      </div>
                      <p className="text-foreground font-medium line-clamp-2 pr-4 group-hover:text-primary transition-colors">
                        {entry.feeling_description}
                      </p>
                      {entry.ai_response ? (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <Brain className="h-3 w-3" />
                          <span>Análise disponível</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Processando análise...</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
