<script setup>
import Button from '../components/ui/Button.vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import Input from '../components/ui/Input.vue';
import { Search } from 'lucide-vue-next';

const schema = yup.object({
  search: yup.string().required(),
});

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted:', values);
});
</script>

<template>
  <div class="container mx-auto p-4">
    <form @submit="onSubmit" class="space-y-4 flex items-center relative">
      <Input label="Search" name="search" placeholder="Search for a movie" />
      <Button :type="'submit'" variant="ghost" x class="absolute right-0 top-6 hover:bg-transparent"
        ><Search size="20"
      /></Button>
    </form>
  </div>
</template>
