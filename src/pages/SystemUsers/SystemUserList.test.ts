import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//@ts-ignore
import { createTestingPinia } from '@pinia/testing';
import SystemUserList from './SystemUserList.vue';

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

describe('SystemUserList.vue', () => {
  const createWrapper = () => {
    return mount(SystemUserList, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],

        directives: {
          mask: { mounted: vi.fn(), updated: vi.fn() },
        },
      },
    });
  };

  it('should render empty state when no users', async () => {
    const wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('System Users');
    expect(wrapper.text()).toContain('Manage registered users');
    expect(wrapper.text()).toContain('No users registered');

    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('should display users in table when they exist', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        cpf: '123.456.789-00',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        cpf: '987.654.321-00',
        isActive: false,
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('No users registered');

    const tableRows = wrapper.findAll('tbody tr');
    expect(tableRows.length).toBe(2);

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    expect(wrapper.text()).toContain('123.456.789-00');
    expect(wrapper.text()).toContain('987.654.321-00');
  });

  it('should navigate to new user page when clicking create button', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    const createButton = buttons[0];

    await createButton.trigger('click');

    expect(mockGoToPage).toHaveBeenCalledWith('/systemUsers/new');
  });

  it('should navigate to edit page when clicking edit button', async () => {
    const mockUsers = [
      {
        id: 'user-123',
        name: 'John Doe',
        cpf: '123.456.789-00',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const actionButtons = wrapper.findAll('tbody tr button');

    expect(actionButtons.length).toBeGreaterThanOrEqual(1);
    const editButton = actionButtons[0];

    await editButton.trigger('click');

    expect(mockGoToPage).toHaveBeenCalledWith('/systemUsers/user-123/edit');
  });

  it('should filter users based on search query', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'John Doe',
        cpf: '123.456.789-00',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        name: 'Jane Smith',
        cpf: '987.654.321-00',
        isActive: true,
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const searchInput = wrapper.find('input[name="search"]');
    expect(searchInput.exists()).toBe(true);

    await searchInput.setValue('John');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
  });
});
