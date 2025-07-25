import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
//@ts-ignore
import { createTestingPinia } from '@pinia/testing';
import CustomersList from './CustomersList.vue';

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

describe('CustomersList.vue', () => {
  const createWrapper = () => {
    return mount(CustomersList, {
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

  it('should render empty state when no customers', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Customers');
    expect(wrapper.text()).toContain('Manage registered customers');
    expect(wrapper.text()).toContain('No customers registered');

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').text()).toContain('New Customer');
  });

  it('should display customers in table when they exist', async () => {
    const mockCustomers = [
      {
        id: '1',
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
      },
      {
        id: '2',
        name: 'Jane',
        lastName: 'Smith',
        cpf: '987.654.321-00',
        email: 'jane@example.com',
        phone: '(11) 88888-8888',
        cep: '87654-321',
        street: 'Rua Teste 2',
        neighborhood: 'Bairro Teste 2',
        city: 'Cidade Teste 2',
        state: 'RJ',
        isActive: false,
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify(mockCustomers));

    const wrapper = createWrapper();

    wrapper.vm.loadCustomers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('No customers registered');

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('john@example.com');
    expect(wrapper.text()).toContain('Jane Smith');
    expect(wrapper.text()).toContain('jane@example.com');

    expect(wrapper.text()).toContain('123.456.789-00');
    expect(wrapper.text()).toContain('987.654.321-00');

    expect(wrapper.text()).toContain('Active');
    expect(wrapper.text()).toContain('Inactive');
  });

  it('should navigate to new customer page when clicking create button', async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    const createButton = buttons[0];
    expect(createButton.text()).toContain('New Customer');

    await createButton.trigger('click');

    expect(mockGoToPage).toHaveBeenCalledWith('/customers/new');
  });

  it('should filter customers by search query', async () => {
    const mockCustomers = [
      {
        id: '1',
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
      },
      {
        id: '2',
        name: 'Jane',
        lastName: 'Smith',
        cpf: '987.654.321-00',
        email: 'jane@example.com',
        phone: '(11) 88888-8888',
        cep: '87654-321',
        street: 'Rua Teste 2',
        neighborhood: 'Bairro Teste 2',
        city: 'Cidade Teste 2',
        state: 'RJ',
        isActive: true,
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify(mockCustomers));

    const wrapper = createWrapper();

    wrapper.vm.loadCustomers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    const searchInput = wrapper.find('input[name="search"]');
    await searchInput.setValue('John');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).not.toContain('Jane Smith');

    await searchInput.setValue('');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    await searchInput.setValue('987.654.321-00');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');
  });

  it('should filter customers by status', async () => {
    const mockCustomers = [
      {
        id: '1',
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
      },
      {
        id: '2',
        name: 'Jane',
        lastName: 'Smith',
        cpf: '987.654.321-00',
        email: 'jane@example.com',
        phone: '(11) 88888-8888',
        cep: '87654-321',
        street: 'Rua Teste 2',
        neighborhood: 'Bairro Teste 2',
        city: 'Cidade Teste 2',
        state: 'RJ',
        isActive: false,
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify(mockCustomers));

    const wrapper = createWrapper();

    wrapper.vm.loadCustomers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    const statusSelect = wrapper.find('select');
    await statusSelect.setValue('active');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).not.toContain('Jane Smith');

    await statusSelect.setValue('inactive');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');

    await statusSelect.setValue('all');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('Jane Smith');
  });

  it('should navigate to edit page when clicking edit button', async () => {
    const mockCustomers = [
      {
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
      },
    ];

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify(mockCustomers));

    const wrapper = createWrapper();

    wrapper.vm.loadCustomers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    const tableRows = wrapper.findAll('tbody tr');
    expect(tableRows.length).toBe(1);

    const actionButtons = tableRows[0].findAll('button');
    expect(actionButtons.length).toBeGreaterThanOrEqual(2);

    const editButton = actionButtons[0];

    await editButton.trigger('click');
    expect(mockGoToPage).toHaveBeenCalledWith('/customers/customer-123/edit');
  });

  it('should delete customer when confirming deletion', async () => {
    const mockCustomers = [
      {
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
      },
    ];

    mockLocalStorage.getItem.mockImplementation(() => JSON.stringify(mockCustomers));

    const mockConfirm = vi.spyOn(window, 'confirm').mockImplementation(() => true);

    const wrapper = createWrapper();

    wrapper.vm.loadCustomers();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('John Doe');

    const tableRows = wrapper.findAll('tbody tr');
    expect(tableRows.length).toBe(1);

    const actionButtons = tableRows[0].findAll('button');
    expect(actionButtons.length).toBeGreaterThanOrEqual(2);

    const deleteButton = actionButtons[1];

    await deleteButton.trigger('click');

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this customer?');

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('systemCustomers', JSON.stringify([]));

    mockConfirm.mockRestore();
  });
});
