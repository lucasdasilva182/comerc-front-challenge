<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { X } from 'lucide-vue-next';
import Button from './Button.vue';

interface Props {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'confirmation';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
  size: 'md',
  closeOnOverlayClick: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const modalRef = ref<HTMLElement | null>(null);

const closeModal = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
  closeModal();
};

const handleCancel = () => {
  emit('cancel');
  closeModal();
};

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    props.closeOnOverlayClick &&
    modalRef.value &&
    !modalRef.value.contains(event.target as Node)
  ) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey);
  document.removeEventListener('mousedown', handleClickOutside);
});

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};
</script>

<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      :class="{ hidden: !isOpen }"
    >
      <div
        ref="modalRef"
        class="relative w-full bg-popover rounded-lg border border-border shadow-xl"
        :class="sizeClasses[size]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div class="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 id="modal-title" class="text-lg font-semibold text-foreground">
              {{ title }}
            </h3>
            <p v-if="description" id="modal-description" class="text-sm text-muted-foreground mt-1">
              {{ description }}
            </p>
          </div>
          <button
            @click="closeModal"
            type="button"
            class="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
            :aria-label="'Close ' + title"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="variant !== 'confirmation'" class="p-6">
          <slot />
        </div>

        <div
          v-if="variant === 'confirmation' || $slots.footer"
          class="flex items-center justify-end gap-3 p-6 border-t border-border"
        >
          <slot name="footer">
            <template v-if="variant === 'confirmation'">
              <Button @click="handleCancel" variant="outline" type="button">
                {{ cancelText }}
              </Button>
              <Button @click="handleConfirm" variant="danger" type="button">
                {{ confirmText }}
              </Button>
            </template>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>
