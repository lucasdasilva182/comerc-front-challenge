import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchMovies from '@/pages/SearchMovies/SearchMovies.vue';
import { omdbService } from '../../services/api/omdbService';
const mockPush = vi.fn();
const mockRoute = {
  query: {},
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/services/api/omdbService', () => ({
  omdbService: {
    searchMovies: vi.fn(),
  },
}));

describe('SearchMovies.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query = {};
    mockPush.mockClear();
  });

  it('should perform a movie search and display results', async () => {
    const mockMovies = [
      {
        Title: 'The Matrix',
        Year: '1999',
        imdbID: 'tt0133093',
        Type: 'movie',
        Poster: 'https://example.com/matrix.jpg',
      },
    ];

    (omdbService.searchMovies as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      Response: 'True',
      Search: mockMovies,
    });

    const wrapper = mount(SearchMovies);

    const searchInput = wrapper.find('input[name="search"]');
    await searchInput.setValue('Matrix');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(omdbService.searchMovies).toHaveBeenCalledWith('Matrix', undefined, '', 1);

    expect(wrapper.text()).toContain('The Matrix');
  });

  it('should search with year and type filters', async () => {
    (omdbService.searchMovies as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      Response: 'True',
      Search: [],
    });

    const wrapper = mount(SearchMovies);

    const searchInput = wrapper.find('input[name="search"]');
    await searchInput.setValue('Matrix');

    const yearInput = wrapper.find('input[name="year"]');
    await yearInput.setValue('1999');

    const checkboxInput = wrapper.find('input[type="checkbox"][name="onlyMovies"]');
    //@ts-ignore
    await checkboxInput.setChecked(true);

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(omdbService.searchMovies).toHaveBeenCalledWith('Matrix', '1999', 'movie', 1);
  });

  it('should load search from URL query on mount', async () => {
    mockRoute.query = { search: 'Batman' };

    (omdbService.searchMovies as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      Response: 'True',
      Search: [],
    });

    const wrapper = mount(SearchMovies);

    await new Promise((resolve) => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    expect(omdbService.searchMovies).toHaveBeenCalledWith('Batman', undefined, '', 1);

    const searchInput = wrapper.find('input[name="search"]');
    expect((searchInput.element as HTMLInputElement).value).toBe('Batman');
  });
});
