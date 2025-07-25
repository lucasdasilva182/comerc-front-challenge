<script setup lang="ts">
import DropdownMenu from '@/components/ui/Dropdown/DropdownMenu.vue';
import DropdownMenuItem from '@/components/ui/Dropdown/DropdownMenuItem.vue';
import { Clapperboard, HandHelping, LogOut, User } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { storeToRefs } from 'pinia';

const router = useRouter();

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const itemsMenu = ref([
  {
    label: 'Rentals',
    icon: Clapperboard,
    action: () => {
      router.push({ path: '/rentals' });
    },
  },
  {
    label: 'Customers',
    icon: HandHelping,
    action: () => {
      router.push({ path: '/customers' });
    },
  },
  {
    label: 'System Users',
    icon: User,
    action: () => {
      router.push({ path: '/systemUsers' });
    },
  },
  {
    label: 'Logout',
    icon: LogOut,
    action: () => {
      useAuthStore().logout();
      router.push({ path: '/login' });
    },
  },
]);
</script>

<template>
  <header
    class="flex justify-center sticky z-[100] top-0 bg-background backdrop-blur-lg border-b border-border w-full"
  >
    <div class="container flex h-[70px] items-center justify-between">
      <a href="/">
        <img src="@/assets/movie-logo.svg" alt="CTicket Logo" class="h-10 w-auto" />
      </a>

      <DropdownMenu position="right" v-if="isAuthenticated">
        <DropdownMenuItem
          v-for="item in itemsMenu"
          @click="item.action"
          :class="item.label === 'Logout' ? 'text-red-500 hover:text-red-500' : ''"
          :key="item.label"
        >
          <template #icon>
            <component :is="item.icon" :size="16" />
          </template>
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  </header>
</template>
