export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export const isNickname = (value: string): boolean => /^[a-zA-Z0-9_]{3,20}$/.test(value)

export function passwordChecks(password: string): { label: string; ok: boolean }[] {
  return [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'A letter', ok: /[a-zA-Z]/.test(password) },
    { label: 'A number', ok: /\d/.test(password) },
  ]
}
