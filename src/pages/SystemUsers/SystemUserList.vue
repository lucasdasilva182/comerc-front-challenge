<script setup>
import { ref, onMounted, computed } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Table from '@/components/ui/Table.vue';
import { Edit3, Trash2, UserPlus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Modal from '@/components/ui/Modal.vue';

const router = useRouter();
const users = ref([]);
const loading = ref(false);
const searchQuery = ref('');

const columns = [
  {
    key: 'user',
    label: 'User',
    class: 'w-1/3',
  },
  {
    key: 'cpf',
    label: 'CPF',
    class: 'w-1/3',
  },
  {
    key: 'isActive',
    label: 'Status',
    class: 'w-1/3',
  },
  {
    key: 'createdAt',
    label: 'Created At',
    class: 'w-1/4',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right',
  },
];

const loadUsers = () => {
  try {
    const usersData = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    users.value = usersData;
  } catch (error) {
    users.value = [];
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US');
};

const editUser = (userId) => {
  router.push(`/systemUsers/${userId}/edit`);
};

const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

const openDeleteConfirmation = (userId) => {
  userToDelete.value = userId;
  isDeleteModalOpen.value = true;
};

const closeDeleteConfirmation = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = () => {
  if (userToDelete.value) {
    deleteUser(userToDelete.value);
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

const deleteUser = (userId) => {
  try {
    const usersData = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const updatedUsers = usersData.filter((user) => user.id !== userId);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    loadUsers();
  } catch (error) {
    alert('Error deleting user');
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">System Users</h1>
        <p class="text-muted-foreground">Manage registered users</p>
      </div>

      <Button @click="router.push('/systemUsers/new')" variant="primary">
        <UserPlus class="w-4 h-4 mr-2" />
        New User
      </Button>
    </div>

    <div class="mb-6">
      <Input v-model="searchQuery" name="search" placeholder="Search users" class="max-w-md" />
    </div>

    <Table
      :columns="columns"
      :data="users"
      :loading="loading"
      :search-query="searchQuery"
      :searchable="true"
      empty-message="No users registered"
    >
      <template #cell-user="{ item }">
        <div class="flex items-center">
          <div
            class="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <span class="text-primary font-semibold">
              {{ item.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="ml-4">
            <div class="text-sm font-medium text-foreground">{{ item.name }}</div>
          </div>
        </div>
      </template>

      <template #cell-cpf="{ item }">
        <div class="text-sm text-foreground">{{ item.cpf }}</div>
      </template>

      <template #cell-isActive="{ item }">
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
          <Button @click="editUser(item.id)" variant="ghost" size="sm">
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
      title="Delete User"
      description="Are you sure you want to delete this user? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      variant="confirmation"
      @close="closeDeleteConfirmation"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirmation"
    />
  </div>
</template>
