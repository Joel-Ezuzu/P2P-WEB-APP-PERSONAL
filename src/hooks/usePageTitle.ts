import { useEffect } from 'react'

/** Keeps the browser tab title in step with the screen, like "Wallet · Pexora". */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · Pexora` : 'Pexora'
  }, [title])
}
