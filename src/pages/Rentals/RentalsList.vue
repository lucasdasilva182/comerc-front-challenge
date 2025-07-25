<script setup>
import { ref, onMounted, computed } from 'vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Table from '@/components/ui/Table.vue';
import { Edit3, Trash2, Plus } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Select from '@/components/ui/Select.vue';

const router = useRouter();
const rentals = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const rentalDateFilter = ref('');
const returnDateFilter = ref('');
const statusFilter = ref('all');

const columns = [
  {
    key: 'rental',
    label: 'Rental',
    class: 'w-2/5',
  },
  {
    key: 'customer',
    label: 'Customer',
    class: 'w-1/5',
  },
  {
    key: 'dates',
    label: 'Dates',
    class: 'w-1/5',
  },
  {
    key: 'status',
    label: 'Status',
    class: 'w-1/5',
  },
  {
    key: 'actions',
    label: 'Actions',
    class: 'text-right',
  },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'rented', label: 'Rented' },
  { value: 'returned', label: 'Returned' },
];

const loadRentals = () => {
  try {
    const rentalsData = JSON.parse(localStorage.getItem('systemRentals') || '[]');
    rentals.value = rentalsData;
  } catch (error) {
    rentals.value = [];
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const deleteRental = (rentalId) => {
  if (confirm('Are you sure you want to delete this rental?')) {
    try {
      const rentalsData = JSON.parse(localStorage.getItem('systemRentals') || '[]');
      const updatedRentals = rentalsData.filter((rental) => rental.id !== rentalId);
      localStorage.setItem('systemRentals', JSON.stringify(updatedRentals));
      loadRentals();
    } catch (error) {
      alert('Error deleting rental');
    }
  }
};

const filteredRentals = computed(() => {
  let filtered = rentals.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((rental) => rental.customerName.toLowerCase().includes(query));
  }

  if (statusFilter.value !== 'all') {
    const statusMap = {
      rented: 'rented',
      returned: 'returned',
    };
    filtered = filtered.filter((rental) => rental.status === statusMap[statusFilter.value]);
  }

  if (rentalDateFilter.value) {
    const filterDate = new Date(rentalDateFilter.value);
    filtered = filtered.filter((rental) => {
      const rentalDate = new Date(rental.rentalDate);
      return (
        rentalDate.getFullYear() === filterDate.getFullYear() &&
        rentalDate.getMonth() === filterDate.getMonth() &&
        rentalDate.getDate() === filterDate.getDate()
      );
    });
  }

  if (returnDateFilter.value) {
    filtered = filtered.filter((rental) => {
      if (!rental.returnDate) return false;
      const returnDate = new Date(rental.returnDate);
      const filterDate = new Date(returnDateFilter.value);
      return (
        returnDate.getFullYear() === filterDate.getFullYear() &&
        returnDate.getMonth() === filterDate.getMonth() &&
        returnDate.getDate() === filterDate.getDate()
      );
    });
  }

  return filtered;
});

onMounted(() => {
  loadRentals();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Rentals</h1>
        <p class="text-muted-foreground">Manage movie rentals</p>
      </div>
    </div>

    <div class="flex flex-col md:grid md:grid-cols-12 w-full gap-4 mb-6">
      <div class="w-full col-span-4">
        <Input
          v-model="searchQuery"
          name="search"
          label="Search Rentals"
          placeholder="Search by customer name"
          class="w-full"
        />
      </div>

      <div class="w-full col-span-3">
        <Input
          v-model="rentalDateFilter"
          name="rentalDate"
          label="Rental Date"
          placeholder="dd/mm/yyyy"
          type="date"
        />
      </div>

      <div class="w-full col-span-3">
        <Input
          v-model="returnDateFilter"
          name="returnDate"
          label="Return Date"
          placeholder="dd/mm/yyyy"
          type="date"
        />
      </div>

      <div class="w-full col-span-2">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="w-full md:w-48">
            <Select
              v-model="statusFilter"
              name="status"
              label="Status"
              placeholder="Select a status"
              :options="statusOptions"
            />
          </div>
        </div>
      </div>
    </div>

    <Table
      :columns="columns"
      :data="filteredRentals"
      :loading="loading"
      empty-message="No rentals registered"
    >
      <template #cell-rental="{ item }">
        <div class="flex items-center">
          <div class="ml-4">
            <div class="text-sm font-medium text-foreground">
              {{ item.movieTitle }}
            </div>
            <div class="text-sm text-muted-foreground">Rental #{{ item.id.slice(-6) }}</div>
          </div>
        </div>
      </template>

      <template #cell-customer="{ item }">
        <div class="text-sm text-foreground">{{ item.customerName }}</div>
      </template>

      <template #cell-dates="{ item }">
        <div class="text-sm">
          <div>Rent: {{ formatDate(item.rentalDate) }}</div>
          <div v-if="item.returnDate" class="text-muted-foreground">
            Return: {{ formatDate(item.returnDate) }}
          </div>
        </div>
      </template>

      <template #cell-status="{ item }">
        <div>
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="
              item.status === 'Alugado'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            "
          >
            {{ item.status }}
          </span>
        </div>
      </template>

      <template #cell-actions="{ item }">
        <div class="flex items-center justify-end gap-2">
          <Button
            @click="deleteRental(item.id)"
            variant="ghost"
            size="sm"
            class="!text-destructive !hover:text-destructive"
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        </div>
      </template>
    </Table>
  </div>
</template>
