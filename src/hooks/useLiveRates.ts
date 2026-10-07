import { useEffect, useState } from 'react'
import { usdPrice } from '../data/mock'
import type { AssetSymbol } from '../data/types'

type Rates = Record<AssetSymbol, number>

/** Moves each price a little around its base value, like a live market would. */
function nextRates(): Rates {
  const wobble = (base: number) => base * (1 + (Math.random() - 0.5) * 0.006)
  return { NGN: wobble(usdPrice.NGN), USDT: usdPrice.USDT, BTC: wobble(usdPrice.BTC) }
}

/** Demo rates in US dollars. They refresh every few seconds. */
export function useLiveRates(everySeconds = 15) {
  const [rates, setRates] = useState<Rates>(usdPrice)
  const [secondsLeft, setSecondsLeft] = useState(everySeconds)

  useEffect(() => {
    let left = everySeconds
    const id = window.setInterval(() => {
      left -= 1
      if (left <= 0) {
        left = everySeconds
        setRates(nextRates())
      }
      setSecondsLeft(left)
    }, 1000)
    return () => window.clearInterval(id)
  }, [everySeconds])

  return { rates, secondsLeft }
}
