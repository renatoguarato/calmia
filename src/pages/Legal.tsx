import { Scale } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

export default function Legal() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Informações Legais
          </h1>
          <p className="text-muted-foreground text-lg">
            Termos de Uso e Avisos Legais da CalmIA.
          </p>
        </div>

        <div className="space-y-8">
          <Alert className="border-primary/50 bg-primary/5">
            <AlertTitle className="text-lg font-semibold text-primary mb-2">
              Aviso Importante de Saúde
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              A CalmIA é uma ferramenta de bem-estar e autoconhecimento.{' '}
              <strong>NÃO substituímos</strong> o aconselhamento, diagnóstico ou
              tratamento médico profissional. Se você estiver enfrentando uma
              crise de saúde mental ou tiver pensamentos de autoagressão,
              procure ajuda profissional ou ligue para os serviços de emergência
              imediatamente.
            </AlertDescription>
          </Alert>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                1. Termos de Serviço
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ao acessar e utilizar a plataforma CalmIA, você concorda em
                cumprir estes termos de serviço, todas as leis e regulamentos
                aplicáveis, e concorda que é responsável pelo cumprimento de
                todas as leis locais aplicáveis. Se você não concordar com algum
                desses termos, está proibido de usar ou acessar este site.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                2. Licença de Uso
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                É concedida permissão para baixar temporariamente uma cópia dos
                materiais (informações ou software) no site CalmIA, apenas para
                visualização transitória pessoal e não comercial. Esta é a
                concessão de uma licença, não uma transferência de título, e sob
                esta licença você não pode:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Modificar ou copiar os materiais;</li>
                <li>
                  Usar os materiais para qualquer finalidade comercial ou para
                  exibição pública (comercial ou não comercial);
                </li>
                <li>
                  Tentar descompilar ou fazer engenharia reversa de qualquer
                  software contido no site CalmIA;
                </li>
                <li>
                  Remover quaisquer direitos autorais ou outras notações de
                  propriedade dos materiais;
                </li>
                <li>
                  Transferir os materiais para outra pessoa ou 'espelhe' os
                  materiais em qualquer outro servidor.
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                3. Isenção de Responsabilidade
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Os materiais no site da CalmIA são fornecidos 'como estão'. A
                CalmIA não oferece garantias, expressas ou implícitas, e, por
                este meio, isenta e nega todas as outras garantias, incluindo,
                sem limitação, garantias implícitas ou condições de
                comercialização, adequação a um fim específico ou não violação
                de propriedade intelectual ou outra violação de direitos.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                4. Limitações
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Em nenhum caso a CalmIA ou seus fornecedores serão responsáveis
                por quaisquer danos (incluindo, sem limitação, danos por perda
                de dados ou lucro ou devido a interrupção dos negócios)
                decorrentes do uso ou da incapacidade de usar os materiais em
                CalmIA, mesmo que a CalmIA ou um representante autorizado da
                CalmIA tenha sido notificado oralmente ou por escrito da
                possibilidade de tais danos.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                5. Precisão dos Materiais
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Os materiais exibidos no site da CalmIA podem incluir erros
                técnicos, tipográficos ou fotográficos. A CalmIA não garante que
                qualquer material em seu site seja preciso, completo ou atual. A
                CalmIA pode fazer alterações nos materiais contidos em seu site
                a qualquer momento, sem aviso prévio.
              </p>
            </section>
          </div>

          <div className="mt-12 rounded-lg bg-muted/30 p-6 text-sm text-muted-foreground text-center">
            <p>
              Para dúvidas legais, entre em contato através do email:
              legal@calmia.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
