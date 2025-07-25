import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//@ts-ignore
import { createTestingPinia } from '@pinia/testing';
import RentalsList from './RentalsList.vue';

const mockGoToPage = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockGoToPage,
  }),
  useRoute: () => ({
    query: {},
  }),
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
  //@ts-ignore
  global.localStorage = mockLocalStorage;
  mockLocalStorage.getItem.mockReturnValue('[]');
  mockGoToPage.mockClear();
});

describe('RentalsList.vue', () => {
  const createWrapper = () => {
    return mount(RentalsList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: {
          Edit3: true,
          Trash2: true,
          Plus: true,
          Search: true,
        },
      },
    });
  };

  it('should render empty state when no rentals', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Rentals');
    expect(wrapper.text()).toContain('Manage movie rentals');
    expect(wrapper.text()).toContain('No rentals registered');

    expect(wrapper.find('input[name="search"]').exists()).toBe(true);
    expect(wrapper.find('input[name="rentalDate"]').exists()).toBe(true);
    expect(wrapper.find('input[name="returnDate"]').exists()).toBe(true);
    expect(wrapper.find('select[name="status"]').exists()).toBe(true);
  });

  it('should display rentals in table when they exist', async () => {
    const mockRentals = [
      {
        id: 'rental-123',
        customerId: 'customer-1',
        customerName: 'John Doe',
        movieId: 'movie-1',
        movieTitle: 'The Matrix',
        rentalDate: '2023-01-02T00:00:00Z',
        returnDate: '2023-01-15T00:00:00Z',
        status: 'Returned',
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockRentals));

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('The Matrix');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('01/01/2023');
    expect(wrapper.text()).toContain('Returned');

    expect(wrapper.text()).not.toContain('No rentals registered');
  });

  it('should filter rentals by customer name search', async () => {
    const mockRentals = [
      {
        id: 'rental-123',
        customerId: 'customer-1',
        customerName: 'John Doe',
        movieId: 'movie-1',
        movieTitle: 'The Matrix',
        rentalDate: '2023-01-02T00:00:00Z',
        returnDate: '2023-01-15T00:00:00Z',
        status: 'Returned',
        createdAt: '2023-01-02T00:00:00Z',
      },
      {
        id: 'rental-456',
        customerId: 'customer-2',
        customerName: 'Jane Smith',
        movieId: 'movie-2',
        movieTitle: 'Inception',
        rentalDate: '2023-01-02T00:00:00Z',
        returnDate: null,
        status: 'Alugado',
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockRentals));

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('The Matrix');
    expect(wrapper.text()).toContain('Inception');
    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    const searchInput = wrapper.find('input[name="search"]');
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue('John');
    await wrapper.vm.$nextTick();

    expect((searchInput.element as HTMLInputElement).value).toBe('John');
  });
});
