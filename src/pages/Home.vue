<script setup>
import Button from '@/components/ui/Button.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import Input from '@/components/ui/Input.vue';
import { Clapperboard, HandHelping, Search, User } from 'lucide-vue-next';
import { omdbService } from '@/services/api/omdbService';
import { ref } from 'vue';
import SearchMovies from '@/pages/SearchMovies/SearchMovies.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const searchQuery = ref('');

const goToSearchMoviePage = () => {
  router.push({ path: '/searchMovies', query: { search: searchQuery.value } });
};
const goToCustomersPage = () => {
  router.push({ path: '/customers' });
};
const goToSystemUserPage = () => {
  router.push({ path: '/systemUsers' });
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold">Welcome</h1>
    <p>
      This system allows you to search for movies, register users, and manage movie rentals. To get
      started, search for a movie title:
    </p>
    <form @submit.prevent="goToSearchMoviePage" class="mt-4 space-y-4 flex items-center relative">
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <div class="border rounded p-4 flex flex-col items-center gap-4">
        <Clapperboard strokeWidth="{1}" size="80" />
        <h2 class="text-lg font-semibold">Rentals Management</h2>
        <p class="text-center">
          You can view detailed information about all movie rentals, including rental history, due
          dates, and both rental and return dates.
        </p>
        <Button @click="goToSearchMoviePage" class="mt-2">Rentals Management</Button>
      </div>
      <div class="border rounded p-4 flex flex-col items-center gap-4">
        <HandHelping strokeWidth="{1}" size="80" />
        <h2 class="text-lg font-semibold">Customers Management</h2>
        <p class="text-center">
          You can view detailed information about all customers. You can also edit existing
          customers or register new ones.
        </p>
        <Button @click="goToCustomersPage" class="mt-2">Customers Management</Button>
      </div>
      <div class="border rounded p-4 flex flex-col items-center gap-4">
        <User strokeWidth="{1}" size="80" />
        <h2 class="text-lg font-semibold">System Users Management</h2>
        <p class="text-center">
          You can view detailed information about all system users, including their roles and
          permissions. You can also edit existing users or register new ones.
        </p>
        <Button @click="goToSystemUserPage" class="mt-2">System User Management</Button>
      </div>
    </div>
  </div>
</template>
