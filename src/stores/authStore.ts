import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  const initAuth = () => {
    try {
      const currentUser = localStorage.getItem('currentSystemUser');
      if (currentUser) {
        user.value = JSON.parse(currentUser);
        isAuthenticated.value = true;
      }
    } catch (error) {
      user.value = null;
      isAuthenticated.value = false;
    }
  };

  const login = (userData: any) => {
    user.value = userData;
    isAuthenticated.value = true;
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('currentSystemUser');
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initAuth,
  };
});
