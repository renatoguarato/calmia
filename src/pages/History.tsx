import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { feelingsService } from '@/services/feelings'
import { FeelingLog } from '@/types/db'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Calendar,
  ChevronRight,
  History as HistoryIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function History() {
  const [logs, setLogs] = useState<FeelingLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await feelingsService.getHistory()
        setLogs(data)
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  return (
    <div className="min-h-screen bg-muted/10 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Histórico de Sentimentos
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua jornada e reveja suas recomendações passadas.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed">
            <p className="text-muted-foreground">
              Nenhum registro encontrado ainda.
            </p>
            <Link to="/dashboard">
              <Button className="mt-4">Criar novo registro</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <Link key={log.id} to={`/recommendations/${log.id}`}>
                <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group border-transparent hover:border-primary/20">
                  <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(log.created_at), "d 'de' MMMM, yyyy", {
                          locale: ptBR,
                        })}
                        <span className="text-muted-foreground/40">•</span>
                        {format(new Date(log.created_at), 'HH:mm', {
                          locale: ptBR,
                        })}
                      </div>
                      <p className="text-foreground font-medium truncate pr-4 group-hover:text-primary transition-colors">
                        {log.feeling_description}
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
