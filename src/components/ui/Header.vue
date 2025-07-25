<script setup lang="ts">
import DropdownMenu from '@/components/ui/Dropdown/DropdownMenu.vue';
import DropdownMenuItem from '@/components/ui/Dropdown/DropdownMenuItem.vue';
import { Clapperboard, HandHelping, User } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const itemsMenu = ref([
  {
    label: 'Rentals',
    icon: Clapperboard,
    action: () => {
      router.push({ path: '/rentals' });
    },
  },
  {
    label: 'Users',
    icon: User,
    action: () => {
      router.push({ path: '/users' });
    },
  },
  {
    label: 'Customers',
    icon: HandHelping,
    action: () => {
      router.push({ path: '/customers' });
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

      <DropdownMenu position="right">
        <DropdownMenuItem v-for="item in itemsMenu" @click="item.action">
          <template #icon>
            <component :is="item.icon" :size="16" />
          </template>
          {{ item.label }}
        </DropdownMenuItem>
      </DropdownMenu>
    </div>
  </header>
</template>
