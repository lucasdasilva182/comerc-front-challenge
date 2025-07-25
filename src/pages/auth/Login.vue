<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const isLogin = ref(true);
const loading = ref(false);
const error = ref('');

const loginSchema = yup.object({
  cpf: yup.string().required('CPF is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

const registerSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters long').required('Name is required'),
  cpf: yup.string().required('CPF is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

const { handleSubmit, resetForm } = useForm({
  validationSchema: isLogin.value ? loginSchema : registerSchema,
});

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
  resetForm();
};

const handleLogin = handleSubmit(async (values) => {
  loading.value = true;
  error.value = '';

  try {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find((user) => user.cpf === values.cpf && user.password === values.password);

    if (!user.isActive) {
      error.value = 'User is inactive';
      return;
    }

    if (user) {
      const userData = { ...user, password: undefined };
      localStorage.setItem('currentSystemUser', JSON.stringify(userData));
      authStore.login(userData);
      router.push('/');
    } else {
      error.value = 'CPF or password is incorrect';
    }
  } catch (err) {
    error.value = 'Error logging in';
  } finally {
    loading.value = false;
  }
});

const handleRegister = handleSubmit(async (values) => {
  loading.value = true;
  error.value = '';

  try {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const existingUser = users.find((user) => user.cpf === values.cpf);

    if (existingUser) {
      error.value = 'CPF already is registered';
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: values.name,
      cpf: values.cpf,
      password: values.password,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('systemUsers', JSON.stringify(users));

    const userData = { ...newUser, password: undefined };
    localStorage.setItem('currentSystemUser', JSON.stringify(userData));
    authStore.login(userData);
    router.push('/');
  } catch (err) {
    error.value = 'Error creating account';
  } finally {
    loading.value = false;
  }
});

const onSubmit = handleSubmit((values) => {
  if (isLogin.value) {
    handleLogin(values);
  } else {
    handleRegister(values);
  }
});
</script>

<template>
  <div
    class="container-pages flex flex-col min-h-auto mx-auto p-4"
    :style="{ minHeight: `calc(100vh - ${142}px)` }"
  >
    <div class="flex-grow flex items-center justify-center">
      <div class="w-full max-w-md">
        <div class="bg-popover rounded-lg p-8 border border-border">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-foreground mb-2">
              {{ isLogin ? 'Welcome to CTicket' : 'Create account' }}
            </h1>
            <p class="text-muted-foreground">
              {{ isLogin ? 'Enter your credentials' : 'Fill in the information to get started' }}
            </p>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-4">
            <div v-if="error" class="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {{ error }}
            </div>

            <template v-if="!isLogin">
              <Input name="name" label="Full name" placeholder="Enter your name" type="text" />
            </template>

            <Input
              name="cpf"
              label="CPF"
              placeholder="Enter your CPF"
              type="text"
              v-mask="['###.###.###-##']"
            />

            <Input name="password" label="Password" placeholder="••••••••" type="password" />

            <template v-if="!isLogin">
              <Input
                name="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
              />
            </template>

            <Button type="submit" :loading="loading" class="w-full" variant="primary">
              {{ isLogin ? 'Login' : 'Create account' }}
            </Button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-muted-foreground text-sm">
              {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
              <button
                @click="toggleForm"
                type="button"
                class="text-primary hover:underline font-medium ml-1"
              >
                {{ isLogin ? 'Register' : 'Login' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
