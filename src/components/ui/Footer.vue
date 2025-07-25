<script setup lang="ts">
import { ref } from 'vue';

const year = ref(new Date().getFullYear());
</script>

<template>
  <header
    class="flex justify-center sticky z-[100] top-0 bg-background backdrop-blur-lg border-t border-border w-full"
  >
    <div class="container flex h-[70px] items-center justify-between">
      <p>{{ year }} © All rights reserved</p>
    </div>
  </header>
</template>
