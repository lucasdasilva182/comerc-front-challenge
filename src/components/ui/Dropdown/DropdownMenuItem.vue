<script setup lang="ts">
interface Props {
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  class: '',
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<template>
  <li class="mb-1 last:mb-0">
    <button
      class="cursor-pointer w-full flex items-center gap-3 text-foreground text-sm p-2 rounded-md hover:bg-gray-500/10 hover:text-primary-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="props.class"
      @click="handleClick"
      :disabled="disabled"
    >
      <div class="flex-shrink-0 w-4 h-4">
        <slot name="icon" />
      </div>
      <div class="flex-1 text-left">
        <slot />
      </div>
    </button>
  </li>
</template>
