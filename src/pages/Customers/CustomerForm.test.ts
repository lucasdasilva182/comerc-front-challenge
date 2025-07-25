import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//@ts-ignore
import { createTestingPinia } from '@pinia/testing';
import CustomerForm from './CustomerForm.vue';
import { toast } from 'vue-sonner';

const mockGoToPage = vi.fn();
const mockRouteParams: { id?: string } = {};

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockGoToPage,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockVMask = {
  mounted: vi.fn(),
  updated: vi.fn(),
};

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
  mockRouteParams.id = undefined;
  vi.mocked(toast.success).mockClear();
  vi.mocked(toast.error).mockClear();
});

describe('CustomerForm.vue', () => {
  const createWrapper = (routeParams = {}) => {
    Object.assign(mockRouteParams, routeParams);

    return mount(CustomerForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        directives: {
          mask: mockVMask,
        },
        stubs: {
          ArrowLeft: true,
          Save: true,
          Search: true,
          Edit3: true,
          Trash2: true,
          UserPlus: true,
        },
      },
    });
  };

  it('should render "New Customer" correctly', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('New Customer');
    expect(wrapper.text()).toContain('Fill in the details to create a new customer');

    expect(wrapper.find('input[name="name"]').exists()).toBe(true);
    expect(wrapper.find('input[name="lastName"]').exists()).toBe(true);
    expect(wrapper.find('input[name="cpf"]').exists()).toBe(true);
    expect(wrapper.find('input[name="email"]').exists()).toBe(true);
    expect(wrapper.find('input[name="phone"]').exists()).toBe(true);

    expect(wrapper.find('input[name="cep"]').exists()).toBe(true);
    expect(wrapper.find('input[name="street"]').exists()).toBe(true);
    expect(wrapper.find('input[name="neighborhood"]').exists()).toBe(true);
    expect(wrapper.find('input[name="city"]').exists()).toBe(true);
    expect(wrapper.find('input[name="state"]').exists()).toBe(true);

    expect(wrapper.find('input[type="checkbox"][name="isActive"]').exists()).toBe(false);

    expect(wrapper.find('button[type="submit"]').text()).toContain('Create Customer');
  });

  it('should render "Edit Customer" correctly when editing', async () => {
    const mockCustomer = {
      id: 'customer-123',
      name: 'John',
      lastName: 'Doe',
      cpf: '123.456.789-00',
      email: 'john@example.com',
      phone: '(11) 99999-9999',
      cep: '12345-678',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
    };

    mockRouteParams.id = 'customer-123';
    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([mockCustomer]));

    const wrapper = createWrapper({ id: 'customer-123' });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Edit Customer');
    expect(wrapper.text()).toContain('Update customer information');

    const nameInput = wrapper.find('input[name="name"]');
    const lastNameInput = wrapper.find('input[name="lastName"]');
    const cpfInput = wrapper.find('input[name="cpf"]');
    const emailInput = wrapper.find('input[name="email"]');

    expect((nameInput.element as HTMLInputElement).value).toBe('John');
    expect((lastNameInput.element as HTMLInputElement).value).toBe('Doe');
    expect((cpfInput.element as HTMLInputElement).value).toBe('123.456.789-00');
    expect((emailInput.element as HTMLInputElement).value).toBe('john@example.com');

    const streetInput = wrapper.find('input[name="street"]');
    const neighborhoodInput = wrapper.find('input[name="neighborhood"]');
    const cityInput = wrapper.find('input[name="city"]');
    const stateInput = wrapper.find('input[name="state"]');

    expect((streetInput.element as HTMLInputElement).value).toBe('Rua Teste');
    expect((neighborhoodInput.element as HTMLInputElement).value).toBe('Bairro Teste');
    expect((cityInput.element as HTMLInputElement).value).toBe('Cidade Teste');
    expect((stateInput.element as HTMLInputElement).value).toBe('SP');

    expect(wrapper.find('input[type="checkbox"][name="isActive"]').exists()).toBe(true);
    const isActiveCheckbox = wrapper.find('input[type="checkbox"][name="isActive"]');
    expect((isActiveCheckbox.element as HTMLInputElement).checked).toBe(true);

    expect(wrapper.find('button[type="submit"]').text()).toContain('Update Customer');
  });

  it('should create a new customer successfully', async () => {
    mockLocalStorage.getItem.mockReturnValue('[]');

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await wrapper.find('input[name="name"]').setValue('John');
    await wrapper.find('input[name="lastName"]').setValue('Doe');
    await wrapper.find('input[name="cpf"]').setValue('123.456.789-00');
    await wrapper.find('input[name="email"]').setValue('john@example.com');
    await wrapper.find('input[name="phone"]').setValue('(11) 99999-9999');
    await wrapper.find('input[name="cep"]').setValue('12345-678');
    await wrapper.find('input[name="street"]').setValue('Rua Teste');
    await wrapper.find('input[name="neighborhood"]').setValue('Bairro Teste');
    await wrapper.find('input[name="city"]').setValue('Cidade Teste');
    await wrapper.find('input[name="state"]').setValue('SP');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    console.log('setItem calls:', setItemCalls);

    const systemUsersCall = setItemCalls.find(
      (call) =>
        call[0] === 'systemUsers' ||
        call[0]?.includes('systemUsers') ||
        (typeof call[1] === 'string' && call[1].includes('John'))
    );

    expect(systemUsersCall).toBeDefined();

    let savedData = '';
    if (systemUsersCall) {
      savedData =
        typeof systemUsersCall[1] === 'string'
          ? systemUsersCall[1]
          : JSON.stringify(systemUsersCall[1]);
    }

    expect(savedData).toContain('John');
    expect(savedData).toContain('Doe');
    expect(savedData).toContain('123.456.789-00');
    expect(savedData).toContain('john@example.com');
    expect(savedData).toContain('Rua Teste');
    expect(savedData).toContain('Bairro Teste');
    expect(savedData).toContain('Cidade Teste');
    expect(savedData).toContain('SP');
    expect(savedData).toContain('"isActive":true');

    expect(toast.success).toHaveBeenCalledWith('Customer created successfully!');

    expect(mockGoToPage).toHaveBeenCalledWith('/customers');
  });

  it('should show error when creating customer with duplicate CPF', async () => {
    const existingCustomer = {
      id: 'existing-456',
      name: 'Existing',
      lastName: 'Customer',
      cpf: '123.456.789-00',
      email: 'existing@example.com',
      phone: '(11) 88888-8888',
      cep: '87654-321',
      street: 'Rua Existente',
      neighborhood: 'Bairro Existente',
      city: 'Cidade Existente',
      state: 'RJ',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
    };

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([existingCustomer]));

    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await wrapper.find('input[name="name"]').setValue('John');
    await wrapper.find('input[name="lastName"]').setValue('Doe');
    await wrapper.find('input[name="cpf"]').setValue('123.456.789-00');
    await wrapper.find('input[name="email"]').setValue('john@example.com');
    await wrapper.find('input[name="phone"]').setValue('(11) 99999-9999');
    await wrapper.find('input[name="cep"]').setValue('12345-678');
    await wrapper.find('input[name="street"]').setValue('Rua Teste');
    await wrapper.find('input[name="neighborhood"]').setValue('Bairro Teste');
    await wrapper.find('input[name="city"]').setValue('Cidade Teste');
    await wrapper.find('input[name="state"]').setValue('SP');

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith('CPF already registered!');

    expect(mockGoToPage).not.toHaveBeenCalledWith('/customers');
  });

  it('should update customer successfully', async () => {
    const originalCustomer = {
      id: 'customer-123',
      name: 'John',
      lastName: 'Doe',
      cpf: '123.456.789-00',
      email: 'john@example.com',
      phone: '(11) 99999-9999',
      cep: '12345-678',
      street: 'Rua Teste',
      neighborhood: 'Bairro Teste',
      city: 'Cidade Teste',
      state: 'SP',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z',
    };

    mockRouteParams.id = 'customer-123';
    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify([originalCustomer]));

    const wrapper = createWrapper({ id: 'customer-123' });
    await wrapper.vm.$nextTick();

    await wrapper.find('input[name="name"]').setValue('John Updated');
    await wrapper.find('input[name="email"]').setValue('john.updated@example.com');
    await wrapper.find('input[name="phone"]').setValue('(11) 88888-8888');

    const isActiveCheckbox = wrapper.find('input[type="checkbox"][name="isActive"]');
    await isActiveCheckbox.setValue(false);

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 150));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const setItemCalls = mockLocalStorage.setItem.mock.calls;
    console.log('Update setItem calls:', setItemCalls);

    const systemUsersCall = setItemCalls.find(
      (call) =>
        call[0] === 'systemUsers' ||
        (typeof call[1] === 'string' && call[1].includes('John Updated'))
    );

    expect(systemUsersCall).toBeDefined();

    let savedData = '';
    if (systemUsersCall) {
      savedData =
        typeof systemUsersCall[1] === 'string'
          ? systemUsersCall[1]
          : JSON.stringify(systemUsersCall[1]);
    }

    expect(savedData).toContain('John Updated');
    expect(savedData).toContain('john.updated@example.com');
    expect(savedData).toContain('"isActive":false');

    expect(toast.success).toHaveBeenCalledWith('Customer updated successfully!');

    expect(mockGoToPage).toHaveBeenCalledWith('/customers');
  });

  it('should validate form fields', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit.prevent');
    await new Promise((resolve) => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

    expect(mockGoToPage).not.toHaveBeenCalledWith('/customers');
  });
});
