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
      adminRole: null,
      adminName: null,

      setUser: (user, token) => set({ user, isLoggedIn: true, token }),
      setSellerToken: (sellerToken) => set({ sellerToken }),
      setAdminToken: (adminToken) => set({ adminToken }),
      setAdminRole: (adminRole) => set({ adminRole }),
      setAdminName: (adminName) => set({ adminName }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          token: null,
          sellerToken: null,
          adminToken: null,
          adminRole: null,
          adminName: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
)

export const useIsSeller = () => 
  useAuthStore(s => Boolean(s.sellerToken));


export default useAuthStore
