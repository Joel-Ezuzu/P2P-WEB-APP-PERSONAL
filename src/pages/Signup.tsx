import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AtSign, Check, Circle, Eye, EyeOff, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { isEmail, isNickname, passwordChecks } from '../lib/validation'
import { usePageTitle } from '../hooks/usePageTitle'

interface Errors {
  nickname?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
}

export default function Signup() {
  usePageTitle('Create account')
  const { signIn } = useAuth()
  const toast = useToast()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const checks = passwordChecks(password)
  const clear = (...keys: (keyof Errors)[]) =>
    setErrors((prev) => {
      const next = { ...prev }
      keys.forEach((k) => delete next[k])
      return next
    })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Errors = {}
    if (!isNickname(nickname)) next.nickname = 'Use 3 to 20 letters, numbers or underscores.'
    if (!isEmail(email)) next.email = 'Enter a valid email address, like name@example.com.'
    if (!checks.every((c) => c.ok)) next.password = 'Your password needs to meet all three rules below.'
    if (confirm !== password) next.confirm = 'The passwords do not match.'
    if (!agreed) next.terms = 'Agree to the Terms of Service and Privacy Policy to continue.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    timer.current = window.setTimeout(() => {
      signIn({ nickname, email: email.trim(), kycVerified: false })
      toast.show('Account created. Welcome to Pexora.')
    }, 700)
  }

  return (
    <>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Create your account</h1>
      <p className="mt-2 text-muted">It takes a minute. You can verify your identity later.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Input
          label="Nickname"
          autoComplete="username"
          placeholder="tobi_a"
          hint="Other traders see this name."
          leading={<AtSign className="size-5" aria-hidden="true" />}
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            clear('nickname')
          }}
          error={errors.nickname}
        />
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
            clear('email')
          }}
          error={errors.email}
        />
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              clear('password', 'confirm')
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
          <ul className="mt-2.5 space-y-1 text-sm">
            {checks.map((c) => (
              <li key={c.label} className={`flex items-center gap-2 ${c.ok ? 'text-ok' : 'text-muted'}`}>
                {c.ok ? <Check className="size-4" aria-hidden="true" /> : <Circle className="size-4" aria-hidden="true" />}
                {c.label}
                <span className="sr-only">{c.ok ? ' (done)' : ' (not yet)'}</span>
              </li>
            ))}
          </ul>
        </div>
        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Type it again"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value)
            clear('confirm')
          }}
          error={errors.confirm}
        />

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked)
                clear('terms')
              }}
              aria-describedby={errors.terms ? 'terms-error' : undefined}
              className="mt-0.5 size-5 shrink-0 accent-gold"
            />
            <span>
              I agree to the{' '}
              <Link to="/terms" className="font-semibold text-gold-text hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-semibold text-gold-text hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p id="terms-error" className="mt-1.5 text-sm text-bad">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" full disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-gold-text hover:underline">
          Log in
        </Link>
      </p>
    </>
  )
}
