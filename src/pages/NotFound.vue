<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="container-pages flex flex-col items-center justify-center min-h-screen mx-auto p-4">
    <div class="text-center max-w-md">
      <div class="mb-8">
        <h1 class="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-foreground mb-2">Página não encontrada</h2>
        <p class="text-muted-foreground">
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button @click="goHome" variant="primary"> Voltar para Home </Button>
      </div>
    </div>
  </div>
</template>
