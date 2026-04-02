import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { tokenStorage } from "../../app/tokenStorage";

const safeDecode = (token) => {
  try {
    return token ? jwtDecode(token) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  accessToken: tokenStorage.getAccess(),
  refreshToken: tokenStorage.getRefresh(),
  user: safeDecode(tokenStorage.getAccess()),
  setSession: ({ accessToken, refreshToken }) =>
    set((state) => {
      const nextRefresh = refreshToken || state.refreshToken;
      tokenStorage.setTokens({ accessToken, refreshToken: nextRefresh });
      return {
        accessToken,
        refreshToken: nextRefresh,
        user: safeDecode(accessToken)
      };
    }),
  clearSession: () => {
    tokenStorage.clear();
    set({ accessToken: null, refreshToken: null, user: null });
  }
}));

export const hasRole = (user, roles = []) => {
  if (!user) return false;
  if (roles.length === 0) return true;
  return roles.includes(user.role);
};
