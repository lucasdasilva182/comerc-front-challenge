<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { ArrowLeft, Save, Search } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import Separator from '../../components/ui/Separator.vue';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const loading = ref(false);
const customer = ref(null);
const cepLoading = ref(false);

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  cpf: yup.string().required('CPF is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  cep: yup.string().required('CEP is required'),
  street: yup.string().required('Street is required'),
  neighborhood: yup.string().required('Neighborhood is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  isActive: yup.boolean().required().default(true),
});

const { handleSubmit, setValues, values } = useForm({
  validationSchema: schema,
});

const getCepInfo = async (cep) => {
  if (!cep) return;

  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return;
  }

  cepLoading.value = true;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (!data.erro) {
      setValues({
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      });
    } else {
      toast.error('CEP not found');
    }
  } catch (error) {
    toast.error('Error searching for address');
  } finally {
    cepLoading.value = false;
  }
};

const loadCustomer = (customerId) => {
  try {
    const customers = JSON.parse(localStorage.getItem('systemCustomers') || '[]');
    const foundCustomer = customers.find((customer) => customer.id === customerId);
    if (foundCustomer) {
      customer.value = foundCustomer;
      setValues({
        name: foundCustomer.name,
        lastName: foundCustomer.lastName,
        cpf: foundCustomer.cpf,
        email: foundCustomer.email,
        phone: foundCustomer.phone,
        cep: foundCustomer.cep,
        street: foundCustomer.street,
        neighborhood: foundCustomer.neighborhood,
        city: foundCustomer.city,
        state: foundCustomer.state,
        isActive: foundCustomer.isActive,
      });
      isEditing.value = true;
    }
  } catch (error) {
    router.push('/customers');
  }
};

const saveCustomer = handleSubmit(async (formData) => {
  loading.value = true;

  try {
    let customers = [];
    try {
      customers = JSON.parse(localStorage.getItem('systemCustomers') || '[]');
    } catch (parseError) {
      customers = [];
    }

    if (!isEditing.value) {
      const existingCustomer = customers.find((c) => c.cpf === formData.cpf);
      if (existingCustomer) {
        toast.error('CPF already registered!');
        loading.value = false;
        return;
      }
    }

    if (isEditing.value && customer.value) {
      const customerIndex = customers.findIndex(
        (localCustomer) => localCustomer.id === customer.value.id
      );
      if (customerIndex !== -1) {
        customers[customerIndex] = {
          ...customers[customerIndex],
          name: formData.name,
          lastName: formData.lastName,
          cpf: formData.cpf,
          email: formData.email,
          phone: formData.phone,
          cep: formData.cep,
          street: formData.street,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          isActive: formData.isActive,
        };
      }
    } else {
      const newCustomer = {
        id: Date.now().toString(),
        name: formData.name,
        lastName: formData.lastName,
        cpf: formData.cpf,
        email: formData.email,
        phone: formData.phone,
        cep: formData.cep,
        street: formData.street,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      customers.push(newCustomer);
    }

    try {
      localStorage.setItem('systemCustomers', JSON.stringify(customers));
      toast.success(
        isEditing.value ? 'Customer updated successfully!' : 'Customer created successfully!'
      );
      router.push('/customers');
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
      toast.error('Error saving customer data');
    }
  } catch (error) {
    console.error('General error:', error);
    toast.error('Error saving customer');
  } finally {
    loading.value = false;
  }
});

const handleCepChange = (event) => {
  const cep = event.target.value;
  if (cep) {
    getCepInfo(cep);
  }
};

onMounted(() => {
  if (route.params.id) {
    loadCustomer(route.params.id);
  }
});
</script>

<template>
  <div class="container flex flex-col items-center mx-auto p-4">
    <div class="flex items-center justify-start w-full gap-4 mb-6">
      <Button @click="router.push('/customers')" variant="ghost" class="p-2">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          {{ isEditing ? 'Edit Customer' : 'New Customer' }}
        </h1>
        <p class="text-muted-foreground">
          {{
            isEditing
              ? 'Update customer information'
              : 'Fill in the details to create a new customer'
          }}
        </p>
      </div>
    </div>

    <div class="max-w-2xl w-full">
      <form @submit.prevent="saveCustomer" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="name" label="First Name" placeholder="Enter first name" type="text" />

          <Input name="lastName" label="Last Name" placeholder="Enter last name" type="text" />

          <Input
            name="cpf"
            label="CPF"
            placeholder="Enter CPF"
            type="text"
            v-mask="['###.###.###-##']"
          />

          <Input name="email" label="Email" placeholder="Enter email" type="email" />

          <Input
            name="phone"
            label="Phone"
            placeholder="Enter phone"
            type="text"
            v-mask="['(##) #####-####']"
          />
        </div>

        <Separator class="my-6" />

        <div>
          <h2 class="text-lg font-semibold text-foreground mb-4">Address</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <div class="flex">
                <div class="flex-1">
                  <Input
                    name="cep"
                    label="CEP"
                    placeholder="Enter CEP"
                    type="text"
                    v-mask="['#####-###']"
                    @blur="handleCepChange"
                  />
                </div>
                <div class="flex items-end relative">
                  <div class="absolute top-[24px] right-0">
                    <Button
                      type="button"
                      variant="ghost"
                      :loading="cepLoading"
                      @click="() => getCepInfo(values.cep)"
                      class="h-[42px] bg-transparent hover:bg-transparent"
                    >
                      <Search size="20" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Input name="street" label="Street" placeholder="Enter street" type="text" />

            <Input
              name="neighborhood"
              label="Neighborhood"
              placeholder="Enter neighborhood"
              type="text"
            />

            <Input name="city" label="City" placeholder="Enter city" type="text" />

            <Input name="state" label="State" placeholder="Enter state" type="text" maxlength="2" />
          </div>
        </div>

        <template v-if="isEditing">
          <div class="flex items-center gap-2 pt-4">
            <Checkbox name="isActive" v-model="customer.isActive" />
            <span class="text-foreground">Active Customer</span>
          </div>
        </template>

        <div class="flex items-center gap-3 pt-4">
          <Button type="submit" :loading="loading" variant="primary">
            <Save class="w-4 h-4 mr-2" />
            {{ isEditing ? 'Update' : 'Create' }} Customer
          </Button>

          <Button @click="router.push('/customers')" variant="outline" type="button">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
