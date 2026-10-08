import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { ThemeToggle } from '../components/ThemeToggle'
import { Button } from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'

export default function NotFound() {
  const navigate = useNavigate()
  usePageTitle('Page not found')

  return (
    <div className="min-h-dvh bg-surface">
      <div className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col border-x border-line bg-bg px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <header className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col justify-center">
          <p className="num font-display text-8xl font-extrabold tracking-tighter text-gold-text">404</p>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">This page doesn't exist</h1>
          <p className="mt-2 max-w-xs text-muted">The link may be old, or the address was typed wrong.</p>
          <div className="mt-8 grid gap-3">
            <Button to="/" size="lg" full>
              Go to home
            </Button>
            <Button variant="secondary" size="lg" full onClick={() => navigate(-1)}>
              Go back
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
