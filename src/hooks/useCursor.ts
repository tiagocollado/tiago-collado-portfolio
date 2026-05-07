'use client'

import { createContext, useContext } from 'react'

export type CursorVariant = 'default' | 'link' | 'view' | 'drag'

export type CursorContextValue = {
  variant: CursorVariant
  setVariant: (v: CursorVariant) => void
}

export const CursorContext = createContext<CursorContextValue>({
  variant: 'default',
  setVariant: () => {},
})

export function useCursor() {
  return useContext(CursorContext)
}
