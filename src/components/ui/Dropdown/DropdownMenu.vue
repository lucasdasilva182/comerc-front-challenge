<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { UserRound } from 'lucide-vue-next';

interface Props {
  id?: string;
  position?: 'left' | 'right';
  burgerSize?: string;
  navClasses?: string;
  userIconClasses?: string;
  isOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => Math.random().toString(36),
  position: 'left',
  burgerSize: 'w-10 h-10',
  navClasses: 'bg-popover border border-border rounded-md shadow-lg p-2 min-w-[200px]',
  userIconClasses: 'rounded-full p-1',
});

const isOpen = ref(false);

const positionClasses = computed(() => {
  return props.position === 'right'
    ? 'right-0 left-auto origin-top-right'
    : 'left-0 right-auto origin-top-left';
});

const handleClickOutside = (event: MouseEvent) => {
  const element = document.querySelector(`[for="dropdown-${props.id}"]`)?.parentElement;
  if (element && !element.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({
  close: () => {
    isOpen.value = false;
  },
  open: () => {
    isOpen.value = true;
  },
  toggle: () => {
    isOpen.value = !isOpen.value;
  },
});
</script>

<template>
  <div class="dropdown-menu relative inline-block">
    <input type="checkbox" class="hidden" :id="`dropdown-${id}`" v-model="isOpen" />

    <label
      :for="`dropdown-${id}`"
      class="flex items-center justify-center bg-foreground cursor-pointer"
      :class="userIconClasses"
      tabindex="0"
    >
      <slot name="trigger">
        <UserRound class="text-slate-50" :size="18" />
      </slot>
    </label>

    <nav
      class="absolute mt-2.5 transform opacity-0 invisible transition-all duration-100 ease-in-out scale-90 z-50"
      :class="[navClasses, positionClasses, isOpen ? 'scale-100 opacity-100 visible' : '']"
    >
      <slot name="title" />

      <ul class="m-0 p-0 list-none">
        <slot />
      </ul>
    </nav>
  </div>
</template>
