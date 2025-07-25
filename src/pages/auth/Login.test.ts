import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore
import { createTestingPinia } from '@pinia/testing';
import Login from './Login.vue';

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
  // @ts-ignore
  global.localStorage = mockLocalStorage;
  mockLocalStorage.getItem.mockReturnValue('[]');
  mockGoToPage.mockClear();
});

describe('Login.vue', () => {
  const createWrapper = () => {
    return mount(Login, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    });
  };

  it('should render login form by default', () => {
    const wrapper = createWrapper();

    expect(wrapper.text()).toContain('Welcome to CTicket');
    expect(wrapper.text()).toContain('Enter your credentials');
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    expect(wrapper.find('input[name="name"]').exists()).toBe(false);
  });

  it('should switch to register form when clicking register link', async () => {
    const wrapper = createWrapper();

    const toggleButton = wrapper.find('button.text-primary');
    await toggleButton.trigger('click');

    expect(wrapper.text()).toContain('Create account');
    expect(wrapper.text()).toContain('Fill in the information to get started');
    expect(wrapper.find('input[name="name"]').exists()).toBe(true);
    expect(wrapper.find('input[name="confirmPassword"]').exists()).toBe(true);
  });

  it('should show error when login fails', async () => {
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify([]));

    const wrapper = createWrapper();

    await wrapper.find('input[name="email"]').setValue('test@example.com');
    await wrapper.find('input[name="password"]').setValue('123456');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Email or password is incorrect');
  });

  it('should login successfully with valid credentials', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        createdAt: '2023-01-01',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));

    const wrapper = createWrapper();

    await wrapper.find('input[name="email"]').setValue('test@example.com');
    await wrapper.find('input[name="password"]').setValue('123456');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'currentSystemUser',
      expect.stringContaining('Test User')
    );

    expect(mockGoToPage).toHaveBeenCalledWith('/');
  });

  it('should register new user successfully', async () => {
    mockLocalStorage.getItem.mockReturnValueOnce('[]');

    const wrapper = createWrapper();

    await wrapper.find('button.text-primary').trigger('click');

    await wrapper.find('input[name="name"]').setValue('New User');
    await wrapper.find('input[name="email"]').setValue('new@example.com');
    await wrapper.find('input[name="password"]').setValue('123456');
    await wrapper.find('input[name="confirmPassword"]').setValue('123456');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'systemUsers',
      expect.stringContaining('new@example.com')
    );

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'currentSystemUser',
      expect.stringContaining('New User')
    );

    expect(mockGoToPage).toHaveBeenCalledWith('/');
  });

  it('should show error when registering with existing email', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'Existing User',
        email: 'existing@example.com',
        password: '123456',
        createdAt: '2023-01-01',
      },
    ];

    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUsers));

    const wrapper = createWrapper();

    await wrapper.find('button.text-primary').trigger('click');

    await wrapper.find('input[name="name"]').setValue('New User');
    await wrapper.find('input[name="email"]').setValue('existing@example.com');
    await wrapper.find('input[name="password"]').setValue('123456');
    await wrapper.find('input[name="confirmPassword"]').setValue('123456');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Email already is registered');
  });

  it('should validate form fields', async () => {
    const wrapper = createWrapper();

    await wrapper.find('input[name="email"]').setValue('invalid-email');
    await wrapper.find('input[name="password"]').setValue('123');

    await wrapper.find('form').trigger('submit.prevent');

    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(mockGoToPage).not.toHaveBeenCalled();
  });
});
