import { CheckCircle } from 'lucide-react'

const benefits = [
  {
    title: 'Redução do estresse',
    description:
      'Estratégias focadas para diminuir a tensão no ambiente de trabalho.',
  },
  {
    title: 'Prevenção do burnout',
    description:
      'Identificação precoce de sinais de exaustão e ações preventivas.',
  },
  {
    title: 'Ações rápidas e práticas',
    description:
      'Sugestões que se encaixam na sua rotina sem tomar muito tempo.',
  },
  {
    title: 'Privacidade garantida',
    description: 'Seus dados são protegidos e confidenciais, seguindo a LGPD.',
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Principais benefícios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Por que escolher a CalmIA para sua saúde mental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 text-secondary">
                <CheckCircle size={28} className="fill-secondary/20" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
