import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialFormData = {
  email: "",
  password: "",
  name: "",
  phone: "",
  zipCode: "",
  address: "",
  addressDetail: "",
  emailVerified: false,
  interests: [],
  termsAgreed: false,
  privacyAgreed: false,
  marketingEmailAgreed: false,
  marketingSmsAgreed: false,
  ageVerified: false,
};

export const useSignupStore = create(
  persist(
    (set) => ({
      formData: initialFormData,
      currentStep: 1,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
        }),
    }),
    {
      name: "signup-storage",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

