import { create } from "zustand"

const useAuthStore = create((set) => ({
  // 상태
  user: null,        // { id, name, email }
  isLoggedIn: false,

  // 로그인 (추후 API 연동)
  setUser: (user) => set({ user, isLoggedIn: true }),

  // 로그아웃
  logout: () => set({ user: null, isLoggedIn: false }),
}))

export default useAuthStore