<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Checkbox from '@/components/ui/Checkbox.vue';
import { ArrowLeft, Save } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const isEditing = ref(false);
const loading = ref(false);
const user = ref(null);

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  cpf: yup.string().required('CPF is required'),
  currentPassword: yup.string().when([], {
    is: () => isEditing.value,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: yup.string().when('currentPassword', {
    is: (currentPassword) => currentPassword && currentPassword.length > 0,
    then: (schema) =>
      schema.min(6, 'Password must be at least 6 characters').required('New password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: yup.string().when('password', {
    is: (password) => password && password.length > 0,
    then: (schema) =>
      schema
        .oneOf([yup.ref('password')], 'Passwords do not match')
        .required('Password confirmation is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  isActive: yup.boolean().required().default(true),
});

const { handleSubmit, setValues, values } = useForm({
  validationSchema: schema,
});

const loadUser = (userId) => {
  try {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const foundUser = users.find((user) => user.id === userId);
    if (foundUser) {
      user.value = foundUser;
      setValues({
        name: foundUser.name,
        cpf: foundUser.cpf,
        isActive: foundUser.isActive,
      });
      isEditing.value = true;
    }
  } catch (error) {
    router.push('/systemUsers');
  }
};

const saveUser = handleSubmit(async (formData) => {
  loading.value = true;

  try {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    } catch (parseError) {
      users = [];
    }

    if (!isEditing.value) {
      const existingUser = users.find((u) => u.cpf === formData.cpf);
      if (existingUser) {
        toast.error('CPF already registered!');
        loading.value = false;
        return;
      }
    }

    if (isEditing.value && user.value) {
      const userIndex = users.findIndex((localUser) => localUser.id === user.value.id);
      if (userIndex !== -1) {
        if (formData.password && formData.password.length > 0) {
          if (!formData.currentPassword) {
            toast.error('Current password is required to change password');
            loading.value = false;
            return;
          }

          if (formData.currentPassword !== user.value.password) {
            toast.error('Current password is incorrect');
            loading.value = false;
            return;
          }

          users[userIndex] = {
            ...users[userIndex],
            name: formData.name,
            cpf: formData.cpf,
            isActive: formData.isActive,
            password: formData.password,
          };
        } else {
          users[userIndex] = {
            ...users[userIndex],
            name: formData.name,
            cpf: formData.cpf,
            isActive: formData.isActive,
          };
        }
      }
    } else {
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        cpf: formData.cpf,
        password: formData.password,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
    }

    try {
      localStorage.setItem('systemUsers', JSON.stringify(users));
      toast.success(isEditing.value ? 'User updated successfully!' : 'User created successfully!');
      router.push('/systemUsers');
    } catch (storageError) {
      console.error('Erro ao salvar no localStorage:', storageError);
      toast.error('Error saving user data');
    }
  } catch (error) {
    console.error('Erro geral:', error);
    toast.error('Error saving user');
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  if (route.params.id) {
    loadUser(route.params.id);
  }
});
</script>

<template>
  <div class="container flex flex-col items-center mx-auto p-4">
    <div class="flex items-center justify-start w-full gap-4 mb-6">
      <Button @click="router.push('/systemUsers')" variant="ghost" class="p-2">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <div>
        <h1 class="text-2xl font-bold text-foreground">
          {{ isEditing ? 'Edit User' : 'New User' }}
        </h1>
        <p class="text-muted-foreground">
          {{ isEditing ? 'Update user information' : 'Fill in the details to create a new user' }}
        </p>
      </div>
    </div>

    <div class="max-w-2xl w-full">
      <form @submit.prevent="saveUser" class="space-y-6">
        <div class="grid grid-cols-1 gap-6">
          <Input name="name" label="Full name" placeholder="Enter user's full name" type="text" />

          <Input
            name="cpf"
            label="CPF"
            placeholder="Enter your CPF"
            type="text"
            v-mask="['###.###.###-##']"
          />

          <template v-if="isEditing">
            <Input
              name="currentPassword"
              label="Current Password"
              placeholder="••••••••"
              type="password"
              help-text="Required only if changing password"
            />
          </template>

          <Input
            v-if="!isEditing || values.currentPassword"
            name="password"
            label="New Password"
            placeholder="••••••••"
            type="password"
            :help-text="isEditing ? 'Leave blank to keep current password' : ''"
          />

          <Input
            v-if="(!isEditing || values.currentPassword) && values.password"
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="••••••••"
            type="password"
          />

          <template v-if="isEditing">
            <div class="flex items-center gap-2">
              <Checkbox name="isActive" v-model="user.isActive" />
              <span class="text-foreground">Active User</span>
            </div>
          </template>
        </div>

        <div class="flex items-center gap-3 pt-4">
          <Button type="submit" :loading="loading" variant="primary">
            <Save class="w-4 h-4 mr-2" />
            {{ isEditing ? 'Update' : 'Create' }} User
          </Button>

          <Button @click="router.push('/systemUsers')" variant="outline" type="button">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
