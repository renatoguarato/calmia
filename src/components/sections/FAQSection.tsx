import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Como a CalmIA garante a segurança e privacidade dos meus dados?',
    answer:
      'A CalmIA utiliza criptografia avançada e segue rigorosamente a LGPD para proteger todas as suas informações. Seus dados são confidenciais e usados apenas para personalizar suas recomendações.',
  },
  {
    question: 'Como a inteligência artificial da CalmIA funciona na prática?',
    answer:
      'Nossa IA analisa sua profissão, tempo na empresa e sentimentos atuais para identificar padrões de estresse e propor ações e ajustes de rotina personalizados e eficazes para o seu perfil.',
  },
  {
    question: 'A CalmIA substitui um acompanhamento psicológico ou médico?',
    answer:
      'Não. A CalmIA é um assistente complementar para o bem-estar mental e não substitui o diagnóstico, tratamento ou aconselhamento de um profissional de saúde qualificado. Em caso de necessidade, procure sempre um especialista.',
  },
  {
    question: 'Para quem a plataforma CalmIA é indicada?',
    answer:
      'A CalmIA é ideal para profissionais de alta pressão que buscam ferramentas práticas para gerenciar o estresse, prevenir o burnout e melhorar sua qualidade de vida no trabalho e pessoal.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre a plataforma.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-border rounded-lg px-4"
            >
              <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
