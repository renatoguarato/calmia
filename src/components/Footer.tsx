import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-display font-bold text-primary">
              CalmIA
            </span>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              Saúde mental personalizada para profissionais.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            <Link
              to="/about"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Sobre
            </Link>
            <Link
              to="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Privacidade
            </Link>
            <Link
              to="/legal"
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Legal
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CalmIA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
