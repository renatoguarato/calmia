import { useState } from 'react'
import { Building2, TrendingUp, Users, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ContactModal } from '@/components/ContactModal'

const companyBenefits = [
  {
    icon: TrendingUp,
    title: 'Aumento da performance',
    description: 'Equipes saudáveis são mais produtivas e engajadas.',
  },
  {
    icon: Users,
    title: 'Insights para o RH',
    description:
      'Dados agregados e anônimos para melhorar o clima organizacional.',
  },
  {
    icon: ShieldCheck,
    title: 'Redução de absenteísmo',
    description: 'Menos afastamentos por motivos de saúde mental.',
  },
]

export function ForCompaniesSection() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <section id="for-companies" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-primary text-sm font-medium">
              <Building2 size={16} />
              <span>Para Empresas</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              CalmIA para Empresas: Transforme a Saúde Mental da sua Equipe
            </h2>

            <p className="text-lg text-muted-foreground">
              Ofereça a CalmIA como um benefício corporativo e crie um ambiente
              de trabalho mais saudável, produtivo e acolhedor para seus
              colaboradores.
            </p>

            <div className="space-y-6">
              {companyBenefits.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary flex-shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              variant="outline"
              className="mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full"
              onClick={() => setIsContactOpen(true)}
            >
              Falar com nosso time
            </Button>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative">
              <img
                src="https://img.usecurling.com/p/600/600?q=modern%20office%20team%20meeting&color=green"
                alt="Equipe profissional colaborativa em reunião de trabalho em escritório moderno, representando saúde mental corporativa"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-display font-bold">
                  "Investir em saúde mental é investir no futuro da empresa."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </section>
  )
}
