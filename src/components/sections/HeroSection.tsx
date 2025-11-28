import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AuthModal } from '@/components/AuthModal'
import { ContactModal } from '@/components/ContactModal'

export function HeroSection() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-white to-secondary/10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight animate-fade-in-up">
            Saúde mental personalizada para quem vive sob{' '}
            <span className="text-primary">alta pressão</span>.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-in-up delay-100">
            Um assistente com IA que gera ações práticas para reduzir o estresse
            do dia a dia, adaptado à sua profissão e sentimentos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-200">
            <Button
              size="lg"
              className="rounded-full text-lg px-8 bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => setIsAuthOpen(true)}
            >
              Experimentar agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-lg px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => setIsContactOpen(true)}
            >
              Falar com nosso time
            </Button>
          </div>
        </div>
      </div>

      {/* Abstract Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl -z-10 animate-pulse" />

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </section>
  )
}
