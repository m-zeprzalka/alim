import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FormData } from "./form-store";

// Funkcja do prostego szyfrowania danych (dla podstawowej ochrony)
const encryptData = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch (error) {
    console.error("Encryption failed:", error);
    return data;
  }
};

// Funkcja do deszyfrowania danych
const decryptData = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch (error) {
    console.error("Decryption failed:", error);
    return data;
  }
};

// Definicja interfejsu dla store'a
interface SecureFormStore {
  // Dane formularza
  formData: FormData;

  // Akcje
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  clearAllData: () => void;
}

// Customowy storage z szyfrowaniem
const customStorage = {
  getItem: (name: string) => {
    const sessionValue = sessionStorage.getItem(name);
    if (sessionValue) {
      return decryptData(sessionValue);
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    sessionStorage.setItem(name, encryptData(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

// Tworzymy store z użyciem persist middleware do zapisywania w sessionStorage z szyfrowaniem
export const useSecureFormStore = create<SecureFormStore>()(
  persist(
    (set) => ({
      formData: {},

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetForm: () => set({ formData: {} }),

      clearAllData: () => {
        set({ formData: {} });
        sessionStorage.removeItem("alimatrix-secure-form");
      },
    }),
    {
      name: "alimatrix-secure-form",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({ formData: state.formData }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("Form data hydrated successfully");
        } else {
          console.error("Failed to hydrate form data");
        }
      },
    }
  )
);

// Funkcja do automatycznego czyszczenia danych po określonym czasie bezczynności
export const setupAutoDataClear = (timeoutMinutes: number = 30) => {
  let inactivityTimer: NodeJS.Timeout;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      useSecureFormStore.getState().clearAllData();
    }, timeoutMinutes * 60 * 1000);
  };

  // Reset timer on user activity
  const activityEvents = ["mousedown", "keypress", "scroll", "touchstart"];
  activityEvents.forEach((event) => {
    window.addEventListener(event, resetTimer);
  });

  // Initial setup
  resetTimer();

  // Cleanup function
  return () => {
    clearTimeout(inactivityTimer);
    activityEvents.forEach((event) => {
      window.removeEventListener(event, resetTimer);
    });
  };
};
