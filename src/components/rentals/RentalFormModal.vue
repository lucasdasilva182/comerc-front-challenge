<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import { Save } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import Modal from '@/components/ui/Modal.vue';

interface Props {
  isOpen: boolean;
  movie?: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'rental-created'): void;
}>();

const customers = ref<any[]>([]);
const loading = ref(false);

const schema = yup.object({
  customerId: yup.string().required('Customer is required'),
  rentalDate: yup.date().required('Rental date is required'),
  returnDate: yup.date().nullable(),
  status: yup.string().required('Status is required').default('rented'),
});

const { handleSubmit, setValues } = useForm({
  validationSchema: schema,
});

const loadCustomers = () => {
  try {
    const customersData = JSON.parse(localStorage.getItem('systemCustomers') || '[]');
    customers.value = customersData;
  } catch (error) {
    customers.value = [];
  }
};

const customerOptions = computed(() => {
  return customers.value.map((customer) => ({
    value: customer.id,
    label: `${customer.name} ${customer.lastName}`,
  }));
});

const closeModal = () => {
  emit('close');
};

const saveRental = handleSubmit(async (formData) => {
  loading.value = true;

  try {
    let rentals = [];
    try {
      rentals = JSON.parse(localStorage.getItem('systemRentals') || '[]');
    } catch (parseError) {
      rentals = [];
    }

    const activeRental = rentals.find(
      (rental: any) => rental.customerId === formData.customerId && rental.status === 'rented'
    );

    if (activeRental) {
      toast.error('Customer already has an active rental!');
      loading.value = false;
      return;
    }

    const newRental = {
      id: Date.now().toString(),
      customerId: formData.customerId,
      customerName: getCustomerName(formData.customerId),
      movieId: props.movie?.imdbID,
      movieTitle: props.movie?.Title,
      rentalDate: formData.rentalDate,
      returnDate: formData.returnDate,
      status: formData.status,
      createdBy: getCurrentUserId(),
      createdAt: new Date().toISOString(),
    };

    rentals.push(newRental);

    try {
      localStorage.setItem('systemRentals', JSON.stringify(rentals));
      toast.success('Rental created successfully!');
      emit('rental-created');
      closeModal();
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      toast.error('Error saving rental data');
    }
  } catch (error) {
    console.error('General error:', error);
    toast.error('Error saving rental');
  } finally {
    loading.value = false;
  }
});

const getCustomerName = (customerId: string) => {
  const customer = customers.value.find((c: any) => c.id === customerId);
  return customer ? `${customer.name} ${customer.lastName}` : 'Unknown Customer';
};

const getCurrentUserId = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentSystemUser') || 'null');
    return currentUser ? currentUser.id : 'unknown';
  } catch {
    return 'unknown';
  }
};

onMounted(() => {
  loadCustomers();

  setValues({
    rentalDate: new Date().toISOString().split('T')[0],
    status: 'rented',
  });
});
</script>

<template>
  <Modal
    :is-open="isOpen"
    title="Rent Movie"
    description="Fill in the details to rent this movie"
    size="lg"
    @close="closeModal"
  >
    <div v-if="movie" class="space-y-6">
      <div class="flex items-start gap-4 p-4 bg-muted rounded-lg">
        <img
          :src="movie.Poster"
          :alt="movie.Title"
          class="w-16 h-24 object-cover rounded aspect-[2/3]"
        />
        <div>
          <h3 class="font-bold text-foreground">{{ movie.Title }}</h3>
          <p class="text-sm text-muted-foreground">{{ movie.Year }}</p>
          <p class="text-sm text-muted-foreground">{{ movie.Type }}</p>
        </div>
      </div>

      <form @submit.prevent="saveRental" class="space-y-6">
        <div class="flex flex-col gap-6">
          <Select
            name="customerId"
            label="Customer"
            placeholder="Select a customer"
            :options="customerOptions"
          />

          <div class="flex gap-6">
            <Input name="rentalDate" label="Rental Date" type="date" />

            <Input name="returnDate" label="Return Date" type="date" />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4">
          <Button type="submit" :loading="loading" variant="primary">
            <Save class="w-4 h-4 mr-2" />
            Create Rental
          </Button>

          <Button @click="closeModal" variant="outline" type="button"> Cancel </Button>
        </div>
      </form>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-muted-foreground">No movie selected</p>
    </div>
  </Modal>
</template>
