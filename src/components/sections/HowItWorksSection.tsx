import { User, Cpu, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  {
    icon: User,
    title: 'Descreva sua Profissão',
    description:
      'Informe sua área de atuação e como você se sente hoje para que a IA entenda seu contexto.',
  },
  {
    icon: Cpu,
    title: 'IA Analisa o Contexto',
    description:
      'Nosso assistente inteligente processa suas informações para identificar padrões e necessidades.',
  },
  {
    icon: Lightbulb,
    title: 'Ações Práticas',
    description:
      'Receba recomendações personalizadas para reduzir o estresse e melhorar seu bem-estar.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Três passos simples para começar a transformar sua rotina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="border border-border shadow-subtle hover:shadow-elevation hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-8 flex flex-col items-center text-center gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-primary">
                  <step.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
