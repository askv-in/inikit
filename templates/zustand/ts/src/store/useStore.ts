import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AppState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useStore = create<AppState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'app-store',
    }
  )
)