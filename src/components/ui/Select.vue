<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next';
import { useField } from 'vee-validate';
import { computed } from 'vue';

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  id?: string;
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  modelValue?: string | number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: '',
  placeholder: 'Select an option',
  options: () => [],
  disabled: false,
  required: false,
  error: '',
  modelValue: '',
  class: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: Event): void;
  (e: 'blur', value: Event): void;
}>();

const selectId = computed(() => props.id || `select-${Math.random().toString(36)}`);

const { value, errorMessage, handleBlur, handleChange } = useField(() => props.name, undefined, {
  syncVModel: true,
});

const baseClasses = [
  'mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  'disabled:opacity-50 disabled:cursor-not-allowed',
];

const errorClasses = computed(() => {
  const hasError = props.error || errorMessage.value;
  return hasError ? 'border-destructive focus:border-destructive focus:ring-destructive' : '';
});

const computedClasses = computed(() => [...baseClasses, errorClasses.value, props.class]);

const finalErrorMessage = computed(() => {
  return props.error || errorMessage.value || '';
});

const handleSelectChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', event);
  handleChange(event);
};

const handleSelectBlur = (event: Event) => {
  emit('blur', event);
  handleBlur(event);
};
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-foreground mb-1"
      :class="{ 'required-field': required }"
    >
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>

    <select
      :id="selectId"
      :name="name"
      :disabled="disabled"
      :required="required"
      :value="value"
      :class="computedClasses"
      @change="handleSelectChange"
      @blur="handleSelectBlur"
    >
      <option value="" disabled selected>
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <transition name="slide-fade">
      <div v-if="finalErrorMessage" class="text-destructive text-sm mt-1 flex items-center">
        <CircleAlert v-if="finalErrorMessage" class="w-4 h-4 mr-1" />
        {{ finalErrorMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.required-field {
  font-weight: 500;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
