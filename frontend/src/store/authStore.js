import { create } from "zustand";

const TOKEN_KEY = "accessToken";
const USER_KEY = "user";

const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const useAuthStore = create((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  user: getStoredUser(),

  setAuthentication: ({ accessToken, user }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    set({
      accessToken,
      user,
    });
  },

  clearAuthentication: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      accessToken: null,
      user: null,
    });
  },
}));

export default useAuthStore;
