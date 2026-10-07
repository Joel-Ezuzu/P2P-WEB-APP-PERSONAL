import { ArrowLeftRight, House, Store, User, Wallet } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/wallet', label: 'Wallet', icon: Wallet, end: false },
  { to: '/marketplace', label: 'Market', icon: Store, end: false },
  { to: '/exchange', label: 'Exchange', icon: ArrowLeftRight, end: false },
  { to: '/profile', label: 'Profile', icon: User, end: false },
]

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-on-gold"
      >
        Skip to content
      </a>
            <div className="mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col border-x border-line bg-bg">
        <main id="main" tabIndex={-1} className="flex-1 px-5 outline-none pt-[max(1.25rem,env(safe-area-inset-top))] pb-28">
          <Outlet />
        </main>

        <nav
          aria-label="Main"
          className="fixed bottom-0 left-1/2 z-40 w-full max-w-[30rem] -translate-x-1/2 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
        >
          <ul className="grid grid-cols-5">
            {tabs.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `relative flex flex-col items-center gap-1 pt-3 pb-2.5 text-xs font-medium transition-colors ${
                      isActive ? 'text-gold-text' : 'text-muted hover:text-fg'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-gold" />
                      )}
                      <Icon className="size-[22px]" aria-hidden="true" />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
