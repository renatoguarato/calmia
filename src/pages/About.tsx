import { Heart, Users, Lightbulb } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Sobre a CalmIA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nossa missão é democratizar o acesso a ferramentas de bem-estar
            mental para profissionais que vivem sob alta pressão.
          </p>
        </div>

        <div className="grid gap-12">
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Heart className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">Nossa Missão</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Acreditamos que a saúde mental não deve ser deixada de lado em
                prol da carreira. A CalmIA nasceu da necessidade de encontrar
                equilíbrio em um mundo corporativo cada vez mais acelerado.
                Queremos fornecer ações práticas, rápidas e eficazes que se
                encaixem na rotina de qualquer profissional.
              </p>
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 overflow-hidden shadow-sm">
              <img
                src="https://img.usecurling.com/p/600/400?q=peaceful%20office&color=blue"
                alt="Ambiente de trabalho tranquilo"
                className="w-full h-full object-cover"
              />
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
            <div className="order-2 md:order-1 aspect-video rounded-xl bg-muted/50 overflow-hidden shadow-sm">
              <img
                src="https://img.usecurling.com/p/600/400?q=artificial%20intelligence%20abstract&color=cyan"
                alt="Tecnologia e IA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Lightbulb className="h-6 w-6" />
                <h2 className="text-2xl font-semibold">
                  Tecnologia com Propósito
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos Inteligência Artificial avançada não para substituir
                o cuidado humano, mas para potencializá-lo. Nossa IA analisa
                padrões de comportamento e estresse para sugerir
                micro-intervenções que podem prevenir o burnout antes que ele
                aconteça. Cada recomendação é baseada em princípios validados de
                psicologia e neurociência.
              </p>
            </div>
          </section>

          <section className="bg-secondary/10 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Users size={24} />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Para quem é a CalmIA?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Desenvolvemos a CalmIA pensando em desenvolvedores, gestores,
              profissionais de saúde, financeiros e todos aqueles que tomam
              decisões críticas diariamente. Se você sente que seu trabalho
              exige muito da sua energia mental, a CalmIA é para você.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
