<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  class: '',
});

const baseClasses = [
  'inline-flex items-center justify-center font-bold uppercase transition-all border-0 rounded-lg cursor-pointer active:opacity-85 hover:opacity-90 leading-pro ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:opacity-50',
];

const variantClasses = computed(() => {
  const variants = {
    primary:
      'bg-slate-900 text-white hover:border-slate-700 hover:bg-slate-700 hover:text-white hover:shadow-soft-xs',
    secondary:
      'bg-blue-400 text-white hover:border-cyan-500 hover:bg-cyan-500 hover:text-white hover:shadow-soft-xs',
    danger:
      'bg-red-500 text-white hover:border-red-700 hover:bg-red-700 hover:text-white hover:shadow-soft-xs',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 shadow-none',
    outline: 'bg-transparent !border-2 border-slate-900 text-gray-700 hover:bg-gray-100',
  };

  return variants[props.variant] || variants.primary;
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return sizes[props.size] || sizes.md;
});

const computedClasses = computed(() => [
  ...baseClasses,
  variantClasses.value,
  sizeClasses.value,
  props.block ? 'w-full' : '',
  props.class,
]);

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button :type="type" :class="computedClasses" :disabled="isDisabled">
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <span>
      <slot />
    </span>
  </button>
</template>
