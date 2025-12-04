import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { AuthModal } from './AuthModal'
import { ContactModal } from './ContactModal'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { UserNav } from './UserNav'
import { Link, useLocation } from 'react-router-dom'
import { NotificationBell } from '@/components/notifications/NotificationBell'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (isLandingPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToSection = (id: string) => {
    if (!isLandingPage) return
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isLandingPage
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-2'
          : 'bg-transparent py-4',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={scrollToTop}
          className="hover:opacity-90 transition-opacity"
        >
          <img
            src="/CalmIA-Logo-Black.png"
            alt="CalmIA"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/history">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary"
                >
                  Histórico
                </Button>
              </Link>
              <Link to="/progress">
                <Button
                  variant="ghost"
                  className="text-foreground hover:text-primary"
                >
                  Progresso
                </Button>
              </Link>
              <NotificationBell />
              <UserNav />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-secondary/20 rounded-full"
                onClick={() => setIsContactOpen(true)}
              >
                Falar com nosso time
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                onClick={() => setIsAuthOpen(true)}
              >
                Experimentar agora
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <>
              <NotificationBell />
              <UserNav />
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-8">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link to="/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/history">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg"
                      >
                        Histórico
                      </Button>
                    </Link>
                    <Link to="/progress">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg"
                      >
                        Progresso
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg"
                      >
                        Meu Perfil
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className="justify-start text-lg"
                      onClick={() => scrollToSection('how-it-works')}
                    >
                      Como funciona
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-lg"
                      onClick={() => scrollToSection('benefits')}
                    >
                      Benefícios
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-lg"
                      onClick={() => scrollToSection('for-companies')}
                    >
                      Para empresas
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-lg"
                      onClick={() => scrollToSection('faq')}
                    >
                      FAQ
                    </Button>
                  </div>
                )}

                <div className="h-px bg-border" />

                {!user && (
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => setIsContactOpen(true)}
                    >
                      Falar com nosso time
                    </Button>
                    <Button
                      className="w-full rounded-full bg-primary text-white hover:bg-primary/90"
                      onClick={() => setIsAuthOpen(true)}
                    >
                      Experimentar agora
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AuthModal open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </nav>
  )
}
