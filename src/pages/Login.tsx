import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { demoUser } from '../data/mock'
import { isEmail } from '../lib/validation'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Login() {
  usePageTitle('Log in')
  const { signIn } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function finish(nickname: string, address: string, kycVerified: boolean) {
    setLoading(true)
    timer.current = window.setTimeout(() => {
      signIn({ nickname, email: address, kycVerified })
      toast.show(`Welcome back, ${nickname}`)
    }, 600)
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isEmail(email)) next.email = 'Enter a valid email address, like name@example.com.'
    if (password.length < 8) next.password = 'Enter your password (8 or more characters).'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    const address = email.trim()
    finish(address.split('@')[0], address, true)
  }

  return (
    <>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-muted">Log in to trade directly with other people.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          leading={<Mail className="size-5" aria-hidden="true" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="grid size-8 place-items-center rounded-lg text-muted hover:text-fg"
            >
              {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
            </button>
          }
        />
        <Button type="submit" size="lg" full disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-sm text-muted" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        variant="secondary"
        size="lg"
        full
        disabled={loading}
        onClick={() => finish(demoUser.nickname, demoUser.email, true)}
      >
        Try the demo account
      </Button>
      <p className="mt-3 text-sm text-muted">
        This is a demo app. Any valid email with a password of 8 or more characters will log you in.
      </p>

      <p className="mt-8 text-center text-muted">
        New to Pexora?{' '}
        <Link to="/signup" className="font-semibold text-gold-text hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}
