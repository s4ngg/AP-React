import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      token: null,

      setUser: (user, token) => set({ user, isLoggedIn: true, token }),
      logout: () => set({ user: null, isLoggedIn: false, token: null }),
    }),
    { name: "auth-storage" }
  )
)

export default useAuthStore