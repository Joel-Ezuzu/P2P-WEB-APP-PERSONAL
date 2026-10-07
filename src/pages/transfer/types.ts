import type { AssetSymbol } from '../../data/types'

export interface TransferDraft {
  recipient: string
  symbol: AssetSymbol
  amount: string
  note: string
}

export interface Receipt extends TransferDraft {
  reference: string
  date: string
}
