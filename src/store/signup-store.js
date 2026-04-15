import { create } from "zustand"

export const useSignupStore = create((set) => ({
  currentStep: 1,
  formData: {
    email: "", password: "", name: "", phone: "",
    zipCode: "", address: "", addressDetail: "",
    emailVerified: false, interests: [],
    termsAgreed: false, privacyAgreed: false,
    marketingEmailAgreed: false, marketingSmsAgreed: false,
    ageVerified: false,
  },
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setCurrentStep: (step) => set({ currentStep: step }),
  resetForm: () => set({
    currentStep: 1,
    formData: {
      email: "", password: "", name: "", phone: "",
      zipCode: "", address: "", addressDetail: "",
      emailVerified: false, interests: [],
      termsAgreed: false, privacyAgreed: false,
      marketingEmailAgreed: false, marketingSmsAgreed: false,
      ageVerified: false,
    },
  }),
}))
