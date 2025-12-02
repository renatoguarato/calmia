import { Shield } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-4">
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground text-lg">
            Sua privacidade é nossa prioridade. Entenda como tratamos seus
            dados.
          </p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              1. Introdução
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A CalmIA está comprometida em proteger a privacidade e a segurança
              dos dados de seus usuários. Esta Política de Privacidade descreve
              como coletamos, usamos, armazenamos e protegemos suas informações
              pessoais ao utilizar nossa plataforma de assistência à saúde
              mental baseada em IA.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              2. Coleta de Dados
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Para fornecer nossos serviços personalizados, coletamos os
              seguintes tipos de informações:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                <strong>Informações de Conta:</strong> Nome, e-mail, profissão e
                outros dados fornecidos no cadastro.
              </li>
              <li>
                <strong>Dados de Saúde e Bem-estar:</strong> Relatos de
                sentimentos, níveis de estresse e feedback sobre as ações
                sugeridas.
              </li>
              <li>
                <strong>Dados de Uso:</strong> Informações sobre como você
                interage com a plataforma, incluindo horários de acesso e
                recursos utilizados.
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              3. Uso das Informações
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>
                Personalizar as recomendações de ações para redução de estresse.
              </li>
              <li>
                Melhorar continuamente nossos algoritmos de Inteligência
                Artificial.
              </li>
              <li>Garantir a segurança e a integridade da plataforma.</li>
              <li>Comunicar atualizações importantes sobre o serviço.</li>
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A CalmIA <strong>não vende</strong> seus dados pessoais para
              terceiros. Compartilhamos informações apenas quando estritamente
              necessário para a operação do serviço (ex: provedores de
              infraestrutura em nuvem) ou quando exigido por lei. Todos os dados
              processados pela IA são anonimizados sempre que possível.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              5. Segurança
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas técnicas e organizacionais rigorosas para
              proteger seus dados contra acesso não autorizado, perda ou
              alteração. Utilizamos criptografia de ponta a ponta para dados
              sensíveis e seguimos as melhores práticas de segurança da
              informação.
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              6. Seus Direitos
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
              direito a:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos ou imprecisos.</li>
              <li>Solicitar a exclusão de seus dados.</li>
              <li>Revogar seu consentimento a qualquer momento.</li>
            </ul>
          </section>

          <div className="mt-12 rounded-lg bg-muted/30 p-6 text-sm text-muted-foreground">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            <p className="mt-2">
              Para exercer seus direitos ou tirar dúvidas, entre em contato
              conosco através dos canais oficiais.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
