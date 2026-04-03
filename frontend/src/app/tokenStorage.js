const ACCESS_KEY = "pjms_access_token";
const REFRESH_KEY = "pjms_refresh_token";

export const tokenStorage = {
  getAccess() {
    return sessionStorage.getItem(ACCESS_KEY);
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  setTokens({ accessToken, refreshToken }) {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_KEY, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken);
    }
  },
  clear() {
    sessionStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};
