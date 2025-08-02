import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  token: string | null;
  isCheckingAuth: boolean;
  login: (token: string, user: any, expireIn: number) => void;
  logout: () => void;
  checkToken: () => void; // Asenkron yapmaya gerek yok, set işlemi zaten anlık çalışıyor
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  isCheckingAuth: true,

  login: (token, user, expireIn) => {
    const expireAt = Date.now() + expireIn * 1000; // Token süresi
    localStorage.setItem("auth", JSON.stringify({ token, user, expireAt }));
    set({ isLoggedIn: true, user, token, isCheckingAuth: false });
  },

  logout: () => {
    localStorage.removeItem("auth");
    set({ isLoggedIn: false, user: null, token: null, isCheckingAuth: false });
  },

  checkToken: () => {
    const authData = localStorage.getItem("auth");

    if (!authData) {
      set({ isLoggedIn: false, user: null, token: null, isCheckingAuth: false });
      return;
    }

    try {
      const { token, user, expireAt } = JSON.parse(authData);
      if (Date.now() > expireAt) {
        // Token süresi dolmuş, temizle
        localStorage.removeItem("auth");
        set({ isLoggedIn: false, user: null, token: null, isCheckingAuth: false });
      } else {
        // Token geçerli
        set({ isLoggedIn: true, user, token, isCheckingAuth: false });
      }
    } catch (error) {
      console.error("⚠️ Auth verisi bozuk, temizleniyor...");
      localStorage.removeItem("auth");
      set({ isLoggedIn: false, user: null, token: null, isCheckingAuth: false });
    }
  },
}));
