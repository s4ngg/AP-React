import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // 상품 추가
      addItem: (product, quantity = 1, selectedOptions = {}) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, { product, quantity, selectedOptions, isSelected: true }],
          }
        })
      },

      // 수량 변경
      updateQuantity: (productId, selectedOptions, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      // 개별 삭제
      removeItem: (productId, selectedOptions) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
              )
          ),
        }))
      },

      // 개별 선택 토글
      toggleSelect: (productId, selectedOptions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
              ? { ...item, isSelected: !item.isSelected }
              : item
          ),
        }))
      },

      // 전체 선택/해제
      toggleSelectAll: (checked) => {
        set((state) => ({
          items: state.items.map((item) => ({ ...item, isSelected: checked })),
        }))
      },

      // 선택 상품 합계
      getSelectedTotalPrice: () => {
        return get()
          .items.filter((item) => item.isSelected)
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      // 전체 비우기
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
)

export default useCartStore