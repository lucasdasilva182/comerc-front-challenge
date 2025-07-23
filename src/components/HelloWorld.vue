<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
  <div class="h-20 w-20 bg-foreground text-slate-50">pao</div>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
</template>
