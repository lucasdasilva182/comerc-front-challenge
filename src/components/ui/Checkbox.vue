<script setup lang="ts">
import { computed } from 'vue';
import { useField } from 'vee-validate';

interface Props {
  name: string;
  modelValue?: boolean;
  disabled?: boolean;
  id?: string;
  label?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  id: undefined,
  label: '',
  class: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const { value, handleChange } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: true,
  uncheckedValue: false,
  syncVModel: true,
});

const checkboxId = computed(() => props.id || `checkbox-${Math.random().toString(36)}`);

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', target.checked);
  handleChange(event);
};
</script>

<template>
  <div class="flex items-center">
    <label
      class="relative inline-flex items-center cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <input
        type="checkbox"
        class="sr-only peer"
        :id="checkboxId"
        :name="name"
        :checked="value"
        :disabled="disabled"
        @change="handleInputChange"
      />
      <div
        class="group peer bg-white rounded-full duration-300 w-10 h-6 ring-1 ring-red-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 peer-checked:ring-green-500 after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-4 peer-hover:after:scale-95"
        :class="{ 'peer-disabled:opacity-50': disabled }"
      ></div>
    </label>
  </div>
</template>
