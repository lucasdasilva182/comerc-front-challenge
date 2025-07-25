<script setup>
import Button from '@/components/ui/Button.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import Input from '@/components/ui/Input.vue';
import { Search } from 'lucide-vue-next';
import { omdbService } from '@/services/api/omdbService';
import { ref } from 'vue';
import SearchMovies from '@/pages/SearchMovies.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchQuery = ref('');

const goToSearchMoviePage = () => {
  router.push({ path: '/searchMovies', query: { search: searchQuery.value } });
};
</script>

<template>
  <div class="container mx-auto p-4">
    <form @submit.prevent="goToSearchMoviePage" class="space-y-4 flex items-center relative">
      <Input
        label="Search"
        name="search"
        placeholder="Search for a movie"
        v-model="searchQuery"
        onblur="goToSearchMoviePage"
      />
      <Button
        :type="'submit'"
        variant="ghost"
        class="absolute right-0 top-6 hover:bg-transparent"
        @click="goToSearchMoviePage"
        ><Search size="20"
      /></Button>
    </form>
  </div>
</template>
