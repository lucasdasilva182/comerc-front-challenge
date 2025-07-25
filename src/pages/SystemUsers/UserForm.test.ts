import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//@ts-ignore
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import UserForm from './UserForm.vue';
import { toast } from 'vue-sonner';

const mockGoToPage = vi.fn();
const mockRouteParams: { id?: string } = {};

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockGoToPage }),
  useRoute: () => ({ params: mockRouteParams }),
}));

vi.mock('vue-sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const mockVMask = { mounted: vi.fn(), updated: vi.fn() };

beforeEach(() => {
  vi.clearAllMocks();
  //@ts-ignore
  global.localStorage = mockLocalStorage;

  mockLocalStorage.getItem.mockImplementation(() => '[]');
  mockLocalStorage.setItem.mockImplementation(() => {});
  mockGoToPage.mockClear();
  mockRouteParams.id = undefined;
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

describe('UserForm.vue', () => {
  const createWrapper = (routeParams = {}) => {
    Object.assign(mockRouteParams, routeParams);
    return mount(UserForm, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
        directives: { mask: mockVMask },
      },
    });
  };

  it('should render "New User" form correctly', async () => {
    const wrapper = createWrapper();
    await nextTick();

    expect(wrapper.text()).toContain('New User');
    expect(wrapper.text()).toContain('Fill in the details to create a new user');

    expect(wrapper.find('input[name="name"]').exists()).toBe(true);
    expect(wrapper.find('input[name="cpf"]').exists()).toBe(true);
    expect(wrapper.find('input[name="password"]').exists()).toBe(true);
    expect(wrapper.find('input[name="confirmPassword"]').exists()).toBe(false);

    expect(wrapper.find('input[name="currentPassword"]').exists()).toBe(false);
    expect(wrapper.find('input[type="checkbox"][name="isActive"]').exists()).toBe(false);

    expect(wrapper.find('button[type="submit"]').text()).toContain('Create User');

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const cancelButton = buttons[2];
    expect(cancelButton.text()).toContain('Cancel');
  });

  it('should render "Edit User" form correctly when editing', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'John Doe',
      cpf: '123.456.789-00',
      isActive: true,
      password: 'oldpassword123',
      createdAt: '2023-01-01T00:00:00Z',
    };
    mockRouteParams.id = 'user-123';
    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([mockUser]));

    const wrapper = createWrapper({ id: 'user-123' });
    await nextTick();
    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain('Edit User');
    expect(wrapper.text()).toContain('Update user information');

    const nameInput = wrapper.find('input[name="name"]');
    const cpfInput = wrapper.find('input[name="cpf"]');
    expect((nameInput.element as HTMLInputElement).value).toBe('John Doe');
    expect((cpfInput.element as HTMLInputElement).value).toBe('123.456.789-00');

    expect(wrapper.find('input[name="currentPassword"]').exists()).toBe(true);
    expect(wrapper.find('input[type="checkbox"][name="isActive"]').exists()).toBe(true);

    const isActiveCheckbox = wrapper.find('input[type="checkbox"][name="isActive"]');
    expect((isActiveCheckbox.element as HTMLInputElement).checked).toBe(true);

    expect(wrapper.find('button[type="submit"]').text()).toContain('Update User');

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const cancelButton = buttons[2];
    expect(cancelButton.text()).toContain('Cancel');
  });

  it('should create a new user successfully', async () => {
    mockLocalStorage.getItem.mockImplementation(() => '[]');

    const wrapper = createWrapper();
    await nextTick();

    await wrapper.find('input[name="name"]').setValue('New User');
    await wrapper.find('input[name="cpf"]').setValue('123.456.789-00');
    await wrapper.find('input[name="password"]').setValue('newpassword123');

    await wrapper.find('input[name="confirmPassword"]').setValue('newpassword123');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const setItemCalls = mockLocalStorage.setItem.mock.calls;

    const systemUsersCall = setItemCalls.find((call) => call[0] === 'systemUsers');
    expect(systemUsersCall).toBeDefined();
    const savedData = systemUsersCall ? systemUsersCall[1] : '';
    expect(savedData).toContain('New User');
    expect(savedData).toContain('123.456.789-00');
    expect(savedData).toContain('"isActive":true');

    expect(toast.success).toHaveBeenCalledWith('User created successfully!');
    expect(mockGoToPage).toHaveBeenCalledWith('/systemUsers');
  });

  it('should show error when creating user with duplicate CPF', async () => {
    const existingUser = {
      id: 'existing-456',
      name: 'Existing User',
      cpf: '123.456.789-00',
      password: 'password123',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
    };

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([existingUser]));

    const wrapper = createWrapper();
    await nextTick();

    await wrapper.find('input[name="name"]').setValue('Another User');
    await wrapper.find('input[name="cpf"]').setValue('123.456.789-00');
    await wrapper.find('input[name="password"]').setValue('anotherpassword123');
    await wrapper.find('input[name="confirmPassword"]').setValue('anotherpassword123');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('CPF already registered!');
    expect(mockGoToPage).not.toHaveBeenCalledWith('/systemUsers');
  });

  it('should update user without changing password', async () => {
    const originalUser = {
      id: 'user-123',
      name: 'John Doe',
      cpf: '123.456.789-00',
      isActive: true,
      password: 'oldpassword123',
      createdAt: '2023-01-01T00:00:00Z',
    };

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([originalUser]));
    mockRouteParams.id = 'user-123';

    const wrapper = createWrapper({ id: 'user-123' });
    await nextTick();
    await nextTick();
    await nextTick();

    await wrapper.find('input[name="name"]').setValue('John Smith');

    await wrapper.find('input[name="cpf"]').setValue('123.456.789-00');

    const isActiveCheckbox = wrapper.find('input[type="checkbox"][name="isActive"]');
    await isActiveCheckbox.setValue(false);

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();

    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    const systemUsersCall = setItemCalls.find((call) => call[0] === 'systemUsers');
    expect(systemUsersCall).toBeDefined();
    const savedData = systemUsersCall ? systemUsersCall[1] : '';
    expect(savedData).toContain('John Smith');
    expect(savedData).toContain('"isActive":false');

    expect(savedData).toContain('oldpassword123');

    expect(toast.success).toHaveBeenCalledWith('User updated successfully!');
    expect(mockGoToPage).toHaveBeenCalledWith('/systemUsers');
  });

  it('should update user password successfully', async () => {
    const originalUser = {
      id: 'user-123',
      name: 'John Doe',
      cpf: '123.456.789-00',
      isActive: true,
      password: 'oldpassword123',
      createdAt: '2023-01-01T00:00:00Z',
    };
    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([originalUser]));
    mockRouteParams.id = 'user-123';

    const wrapper = createWrapper({ id: 'user-123' });
    await nextTick();

    await wrapper.find('input[name="currentPassword"]').setValue('oldpassword123');
    await wrapper.find('input[name="password"]').setValue('newsecurepassword456');
    await wrapper.find('input[name="confirmPassword"]').setValue('newsecurepassword456');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    const systemUsersCall = setItemCalls.find((call) => call[0] === 'systemUsers');
    expect(systemUsersCall).toBeDefined();
    const savedData = systemUsersCall ? systemUsersCall[1] : '';
    expect(savedData).toContain('newsecurepassword456');

    expect(toast.success).toHaveBeenCalledWith('User updated successfully!');
    expect(mockGoToPage).toHaveBeenCalledWith('/systemUsers');
  });

  it('should show error when current password is incorrect during update', async () => {
    const originalUser = {
      id: 'user-123',
      name: 'John Doe',
      cpf: '123.456.789-00',
      isActive: true,
      password: 'correctoldpassword',
      createdAt: '2023-01-01T00:00:00Z',
    };
    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([originalUser]));
    mockRouteParams.id = 'user-123';

    const wrapper = createWrapper({ id: 'user-123' });
    await nextTick();

    await wrapper.find('input[name="currentPassword"]').setValue('wrongoldpassword');
    await wrapper.find('input[name="password"]').setValue('newpassword123');
    await wrapper.find('input[name="confirmPassword"]').setValue('newpassword123');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Current password is incorrect');
    expect(mockGoToPage).not.toHaveBeenCalledWith('/systemUsers');
  });
});
