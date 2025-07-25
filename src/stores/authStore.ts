// import { defineStore } from 'pinia';
// import { ref } from 'vue';

// export const useAuthStore = defineStore('auth', () => {
//   const isAuthenticated = ref(false);
//   const user = ref(null);

//   function login(userData: any) {
//     isAuthenticated.value = true;
//     user.value = userData;
//   }

//   function logout() {
//     isAuthenticated.value = false;
//     user.value = null;
//   }

//   return { isAuthenticated, user, login, logout };
// });

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Carrega usuário do localStorage ao iniciar
  const initAuth = () => {
    try {
      const currentUser = localStorage.getItem('currentSystemUser');
      if (currentUser) {
        user.value = JSON.parse(currentUser);
        isAuthenticated.value = true;
      }
    } catch (error) {
      // Se der erro, limpa o estado
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
