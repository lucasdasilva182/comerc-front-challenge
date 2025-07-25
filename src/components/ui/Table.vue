<script setup lang="ts">
import { computed } from 'vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  class?: string;
}

interface Props {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyMessage?: string;
  searchQuery?: string;
  searchable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyMessage: 'No data found',
  searchQuery: '',
  searchable: false,
});

const filteredData = computed(() => {
  if (!props.searchQuery || !props.searchable) return props.data;

  const query = props.searchQuery.toLowerCase();
  return props.data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(query))
  );
});
</script>

<template>
  <div class="border border-border rounded-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider"
              :class="column.class"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-background divide-y divide-border">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-6 py-8 text-center text-muted-foreground">
              Loading...
            </td>
          </tr>

          <tr v-else-if="filteredData.length === 0">
            <td :colspan="columns.length" class="px-6 py-8 text-center text-muted-foreground">
              {{ emptyMessage }}
            </td>
          </tr>

          <tr
            v-else
            v-for="(item, index) in filteredData"
            :key="item.id || index"
            class="hover:bg-muted/50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
              :class="column.class"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
