import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const testimonials = [
  {
    name: 'Ana Silva',
    role: 'Desenvolvedora Senior',
    content:
      'A CalmIA me ajudou a identificar momentos de tensão que eu nem percebia. As dicas são super práticas.',
    image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=1',
  },
  {
    name: 'Carlos Mendes',
    role: 'Gerente de Marketing',
    content:
      'Incrível como a ferramenta entende meu contexto. Me sinto muito mais leve no final do dia.',
    image: 'https://img.usecurling.com/ppl/medium?gender=male&seed=2',
  },
  {
    name: 'Juliana Costa',
    role: 'Diretora Financeira',
    content:
      'Para quem vive sob pressão, é essencial. A CalmIA se tornou minha aliada diária contra o burnout.',
    image: 'https://img.usecurling.com/ppl/medium?gender=female&seed=3',
  },
]

export function SocialProofSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            O que nossos usuários dizem
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="h-full border-border shadow-sm hover:shadow-md transition-all">
                      <CardContent className="flex flex-col gap-4 p-6">
                        <p className="text-muted-foreground italic flex-grow">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                          <Avatar>
                            <AvatarImage
                              src={testimonial.image}
                              alt={testimonial.name}
                            />
                            <AvatarFallback>
                              {testimonial.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="bg-secondary/10 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="bg-white p-4 rounded-full shadow-sm text-primary">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">60%</p>
              <p className="text-muted-foreground">
                de melhoria no bem-estar percebido pelos usuários.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
