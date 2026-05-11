import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      token: null,
      sellerToken: null,
      adminToken: null,

      setUser: (user, token) => set({ user, isLoggedIn: true, token }),
      setSellerToken: (sellerToken) => set({ sellerToken }),
      setAdminToken: (adminToken) => set({ adminToken }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          token: null,
          sellerToken: null,
          adminToken: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
)

export default useAuthStore
