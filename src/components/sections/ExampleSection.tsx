import { Bot, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function ExampleSection() {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Veja um Exemplo Real
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Como a IA personaliza a recomendação para um Gerente de Projetos
            sentindo-se sobrecarregado.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-elevation bg-white overflow-hidden">
            <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-3">
              <Bot className="text-primary" size={24} />
              <span className="font-medium text-primary">
                Recomendação CalmIA
              </span>
            </div>
            <CardContent className="p-8 relative">
              <Quote
                className="absolute top-6 right-6 text-muted-foreground/20"
                size={48}
              />

              <div className="space-y-6 text-foreground">
                <p className="text-lg leading-relaxed">
                  "Olá! Percebi que você está lidando com prazos apertados hoje.
                  Como Gerente de Projetos, é comum sentir que precisa resolver
                  tudo agora."
                </p>

                <div className="pl-4 border-l-4 border-secondary space-y-2">
                  <h3 className="font-semibold text-primary text-lg">
                    Ação sugerida: Técnica Pomodoro Adaptada
                  </h3>
                  <p className="text-muted-foreground">
                    Para as próximas 2 horas, foque apenas na tarefa de maior
                    prioridade. Trabalhe 25 minutos e faça uma pausa de 5
                    minutos longe das telas. Isso ajudará a reduzir a ansiedade
                    cognitiva e recuperar o foco.
                  </p>
                </div>

                <p className="text-sm text-muted-foreground italic">
                  *Baseado no seu perfil e nível de estresse atual.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
