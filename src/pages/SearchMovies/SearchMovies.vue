<script setup>
import Button from '@/components/ui/Button.vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Input from '@/components/ui/Input.vue';
import { CircleAlert, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { omdbService } from '@/services/api/omdbService';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import Checkbox from '@/components/ui/Checkbox.vue';
import MovieImage from '@/components/MovieImage.vue';
import RentalFormModal from '@/components/rentals/RentalFormModal.vue';

const route = useRoute();
const router = useRouter();

const movies = ref([]);
const loading = ref(false);
const error = ref('');
const selectedMovie = ref(null);
const isRentalModalOpen = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalResults = ref(0);

const schema = yup.object({
  search: yup.string().required(),
  year: yup.string().optional(),
  onlyMovies: yup.boolean().optional(),
});

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: schema,
});

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * 10 + 1;
  const end = Math.min(currentPage.value * 10, totalResults.value);
  return {
    start,
    end,
    total: totalResults.value,
  };
});

const performSearch = async (searchTerm, page = 1) => {
  if (!searchTerm?.search?.trim()) {
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const queryParams = {
      search: searchTerm.search,
      page: page.toString(),
    };

    if (searchTerm.year) {
      queryParams.year = searchTerm.year;
    }

    if (searchTerm.onlyMovies) {
      queryParams.onlyMovies = searchTerm.onlyMovies.toString();
    }

    router.push({ query: queryParams });

    const year = searchTerm.year?.trim() || undefined;
    const type = searchTerm.onlyMovies ? 'movie' : '';

    const response = await omdbService.searchMovies(searchTerm.search, year, type, page);

    if (response.Response === 'True') {
      movies.value = response.Search;
      totalResults.value = parseInt(response.totalResults) || 0;
      totalPages.value = Math.ceil(totalResults.value / 10);
      currentPage.value = page;
    } else {
      error.value = response.Error || 'No movies found';
      toast.error('No movies found');
      movies.value = [];
      totalResults.value = 0;
      totalPages.value = 1;
      currentPage.value = 1;
    }
  } catch (err) {
    error.value = 'Error fetching movies';
    toast.error('Error fetching movies');
    movies.value = [];
    totalResults.value = 0;
    totalPages.value = 1;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

const searchMovies = handleSubmit((values) => {
  currentPage.value = 1;
  performSearch(values, 1);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    performSearch(values, page);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1);
  }
};

const openRentalModal = (movie) => {
  selectedMovie.value = movie;
  isRentalModalOpen.value = true;
};

const closeRentalModal = () => {
  isRentalModalOpen.value = false;
  selectedMovie.value = null;
};

const handleRentalCreated = () => {
  toast.success('Rental created successfully!');
};

onMounted(() => {
  if (route.query.search) {
    setFieldValue('search', route.query.search);

    const page = route.query.page ? parseInt(route.query.page) : 1;
    currentPage.value = page;

    if (route.query.year) {
      setFieldValue('year', route.query.year);
    }

    if (route.query.onlyMovies) {
      setFieldValue('onlyMovies', route.query.onlyMovies === 'true');
    }

    performSearch(
      {
        search: route.query.search,
        year: route.query.year,
        onlyMovies: route.query.onlyMovies === 'true',
      },
      page
    );
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
      <div
        v-for="movie in movies"
        :key="movie.imdbID"
        class="flex flex-col justify-between border rounded p-4"
      >
        <div>
          <MovieImage
            :src="movie.Poster"
            :alt="movie.Title"
            class="w-full object-cover rounded aspect-[2/3]"
          />
          <h3 class="font-bold mt-2">{{ movie.Title }}</h3>
          <p class="text-sm text-muted-foreground">{{ movie.Year }}</p>
        </div>

        <div class="mt-4">
          <Button @click="openRentalModal(movie)" variant="primary" class="w-full">
            Rent Movie
          </Button>
        </div>
      </div>
    </div>

    <div
      v-if="movies.length > 0 && totalPages > 1"
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6"
    >
      <div class="text-sm text-muted-foreground">
        Showing {{ paginationInfo.start }} to {{ paginationInfo.end }} of
        {{ paginationInfo.total }} results
      </div>

      <div class="flex items-center gap-2">
        <Button @click="previousPage" variant="ghost" :disabled="currentPage === 1" class="p-2">
          <ChevronLeft class="w-4 h-4" />
        </Button>

        <div class="flex items-center gap-1">
          <Button
            v-if="totalPages > 1"
            @click="goToPage(1)"
            variant="outline"
            :class="currentPage === 1 ? '!bg-slate-900 !text-slate-50' : ''"
            class="p-2 w-10 h-10"
          >
            1
          </Button>

          <span v-if="currentPage > 3 && totalPages > 5" class="px-2">...</span>

          <template
            v-for="page in Array.from({ length: Math.min(2, totalPages - 2) }, (_, i) => {
              const startPage = Math.max(2, currentPage - 1);
              return startPage + i;
            })"
            :key="page"
          >
            <Button
              v-if="page > 1 && page < totalPages"
              @click="goToPage(page)"
              variant="outline"
              :class="currentPage === page ? '!bg-slate-900 !text-slate-50' : ''"
              class="p-2 w-10 h-10"
            >
              {{ page }}
            </Button>
          </template>

          <span v-if="currentPage < totalPages - 2 && totalPages > 4" class="px-2">...</span>

          <Button
            v-if="totalPages > 1"
            @click="goToPage(totalPages)"
            variant="outline"
            :class="currentPage === totalPages ? '!bg-slate-900 !text-slate-50' : ''"
            class="p-2 w-10 h-10"
          >
            {{ totalPages }}
          </Button>
        </div>

        <Button
          @click="nextPage"
          variant="ghost"
          :disabled="currentPage === totalPages"
          class="p-2"
        >
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </div>

    <RentalFormModal
      :is-open="isRentalModalOpen"
      :movie="selectedMovie"
      @close="closeRentalModal"
      @rental-created="handleRentalCreated"
    />
  </div>
</template>
