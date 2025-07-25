<script setup>
import { ref, onMounted, computed } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Table from '@/components/ui/Table.vue';
import { Edit3, Trash2, UserPlus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/Modal.vue';

const router = useRouter();
const customers = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('all');
const columns = [
  {
    key: 'customer',
    label: 'Customer',
    class: 'w-2/5',
  },
  {
    key: 'document',
    label: 'Document',
    class: 'w-1/5',
  },
  {
    key: 'status',
    label: 'Status',
    class: 'w-1/5',
  },
  {
    key: 'createdAt',
    label: 'Created At',
    class: 'w-1/5',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right',
  },
];

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US');
};
const editCustomer = (customerId) => {
  router.push(`/customers/${customerId}/edit`);
};

const isDeleteModalOpen = ref(false);
const customerToDelete = ref(null);

const openDeleteConfirmation = (customerId) => {
  customerToDelete.value = customerId;
  isDeleteModalOpen.value = true;
};

const closeDeleteConfirmation = () => {
  isDeleteModalOpen.value = false;
  customerToDelete.value = null;
};

const confirmDelete = () => {
  if (customerToDelete.value) {
    deleteCustomer(customerToDelete.value);
  }
  closeDeleteConfirmation();
};
const loadCustomers = () => {
  try {
    const customersData = JSON.parse(localStorage.getItem('systemCustomers') || '[]');
    customers.value = customersData;
  } catch (error) {
    customers.value = [];
  }
};

const deleteCustomer = (customerId) => {
  try {
    const customersData = JSON.parse(localStorage.getItem('systemCustomers') || '[]');
    const updatedCustomers = customersData.filter((customer) => customer.id !== customerId);
    localStorage.setItem('systemCustomers', JSON.stringify(updatedCustomers));
    loadCustomers();
  } catch (error) {
    alert('Error deleting customer');
  }
};

const filteredCustomers = computed(() => {
  let filtered = customers.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.cpf.includes(query)
    );
  }

  if (statusFilter.value !== 'all') {
    const isActive = statusFilter.value === 'active';
    filtered = filtered.filter((customer) => customer.isActive === isActive);
  }

  return filtered;
});

onMounted(() => {
  loadCustomers();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Customers</h1>
        <p class="text-muted-foreground">Manage registered customers</p>
      </div>

      <Button @click="router.push('/customers/new')" variant="primary">
        <UserPlus class="w-4 h-4 mr-2" />
        New Customer
      </Button>
    </div>

    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          name="search"
          placeholder="Search by name or document..."
          class="w-full"
        />
      </div>

      <div class="w-full md:w-48">
        <select
          v-model="statusFilter"
          class="w-full mt-1 h-[42px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <Table
      :columns="columns"
      :data="filteredCustomers"
      :loading="loading"
      empty-message="No customers registered"
    >
      <template #cell-customer="{ item }">
        <div class="flex items-center">
          <div
            class="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <span class="text-primary font-semibold">
              {{ item.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-foreground">
              {{ item.name }} {{ item.lastName }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ item.email }}
            </div>
          </div>
        </div>
      </template>

      <template #cell-document="{ item }">
        <div class="text-sm text-foreground">{{ item.cpf }}</div>
      </template>

      <template #cell-status="{ item }">
        <div>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
          >
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </template>

      <template #cell-createdAt="{ item }">
        <div class="text-sm text-muted-foreground">{{ formatDate(item.createdAt) }}</div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-2">
          <Button @click="editCustomer(item.id)" variant="ghost" size="sm">
            <Edit3 class="w-4 h-4" />
          </Button>
          <Button
            @click="openDeleteConfirmation(item.id)"
            variant="ghost"
            size="sm"
            class="!text-destructive !hover:text-destructive"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </template>
    </Table>

    <Modal
      :is-open="isDeleteModalOpen"
      title="Delete Customer"
      description="Are you sure you want to delete this customer? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="confirmation"
      @close="closeDeleteConfirmation"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirmation"
    />
  </div>
</template>
