export type IdType = 'NIN' | "Driver's licence" | "Voter's card" | 'International passport'

export interface KycDraft {
  fullName: string
  dob: string
  address: string
  city: string
  idType: IdType
  idNumber: string
  idPhoto: File | null
  selfie: File | null
}

export const idRules: Record<IdType, { pattern: RegExp; hint: string }> = {
  NIN: { pattern: /^\d{11}$/, hint: 'Your 11-digit National Identification Number.' },
  "Driver's licence": { pattern: /^[A-Za-z0-9]{8,14}$/, hint: 'The licence number printed on the card.' },
  "Voter's card": { pattern: /^[A-Za-z0-9]{10,19}$/, hint: 'The long number on the front of your PVC.' },
  'International passport': { pattern: /^[A-Za-z]\d{8}$/, hint: 'A letter followed by 8 digits, like A12345678.' },
}
