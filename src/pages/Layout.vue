<script setup>
import Header from '@/components/ui/Header.vue';
import Footer from '../components/ui/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-grow">
      <router-view class="min-h-full" />
    </main>
    <Footer />
  </div>
</template>
