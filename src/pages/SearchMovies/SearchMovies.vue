<script setup>
import Button from '@/components/ui/Button.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Input from '@/components/ui/Input.vue';
import { CircleAlert, Search } from 'lucide-vue-next';
import { omdbService } from '@/services/api/omdbService';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import Checkbox from '@/components/ui/Checkbox.vue';
import MovieImage from '@/components/MovieImage.vue';

const route = useRoute();
const router = useRouter();

const movies = ref([]);
const loading = ref(false);
const error = ref('');

const schema = yup.object({
  search: yup.string().required(),
  year: yup.string().optional(),
  onlyMovies: yup.boolean().optional(),
});

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: schema,
});

const performSearch = async (searchTerm) => {
  if (!searchTerm?.search.trim()) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    router.push({ query: { search: searchTerm.search } });

    const year = searchTerm.year?.trim() || undefined;
    const type = searchTerm.onlyMovies ? 'movie' : '';

    const response = await omdbService.searchMovies(searchTerm.search, year, type, 1);

    if (response.Response === 'True') {
      movies.value = response.Search;
    } else {
      error.value = response.Error || 'No movies found';
      toast.error('No movies found');
      movies.value = [];
    }
  } catch (err) {
    error.value = 'Error fetching movies';
    toast.error('Error fetching movies');
    movies.value = [];
  } finally {
    loading.value = false;
  }
};

const searchMovies = handleSubmit((values) => {
  performSearch(values);
});

onMounted(() => {
  if (route.query.search) {
    setFieldValue('search', route.query.search);
    performSearch({ search: route.query.search });
  }
});
</script>

<template>
  <div class="container mx-auto p-4">
    <form
      @submit.prevent="searchMovies"
      class="flex flex-col md:grid md:grid-cols-12 items-top gap-4 md:gap-2 mb-8"
    >
      <div class="relative w-full col-span-5">
        <Input label="Search" name="search" placeholder="Search for a movie" @blur="searchMovies" />
        <Button
          type="submit"
          variant="ghost"
          :loading="loading"
          class="absolute right-0 top-6 hover:bg-transparent"
        >
          <Search size="20" />
        </Button>
      </div>
      <div class="col-span-4">
        <Input label="Movie year" name="year" placeholder="Type a year" v-mask="['####']" />
      </div>
      <div class="col-span-3 w-full flex flex-col justify-start">
        <div class="h-10 flex items-center gap-2 md:mt-6">
          <Checkbox name="onlyMovies" />
          <span class="whitespace-nowrap font-semibold">Only movies</span>
        </div>
      </div>
    </form>

    <div v-if="error" class="text-center text-destructive mt-4">
      <p class="flex items-center justify-center gap-2 font-semibold">
        <CircleAlert size="20" /> {{ error }}
      </p>
    </div>

    <div v-if="loading" class="text-center mt-4">Carregando...</div>

    <div
      v-else-if="movies.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
    >
      <div v-for="movie in movies" :key="movie.imdbID" class="border rounded p-4">
        <MovieImage
          :src="movie.Poster"
          :alt="movie.Title"
          class="w-full object-cover rounded aspect-[2/3]"
        />
        <h3 class="font-bold mt-2">{{ movie.Title }}</h3>
        <p class="text-sm text-muted-foreground">{{ movie.Year }}</p>
      </div>
    </div>
  </div>
</template>
