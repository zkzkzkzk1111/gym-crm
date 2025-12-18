<script setup lang="ts">
interface Category {
  id: number | string;
  name: string;
  [key: string]: any;
}

interface Props {
  modelValue: boolean;
  title?: string;
  categories?: Category[];
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'add'): void;
  (e: 'edit', category: Category): void;
  (e: 'delete', category: Category): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '카테고리 관리',
  categories: () => []
});

const emit = defineEmits<Emits>();

const handleAdd = () => {
  emit('add');
};

const handleEdit = (category: Category) => {
  emit('edit', category);
};

const handleDelete = (category: Category) => {
  emit('delete', category);
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <v-btn
          @click="handleAdd"
          color="primary"
          variant="elevated"
          size="small"
        >
          <v-icon>mdi-plus</v-icon>
          추가
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-0">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">이름</th>
              <th class="text-center" style="width: 150px;">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="categories.length === 0">
              <td colspan="2" class="text-center text-grey pa-4">
                등록된 카테고리가 없습니다
              </td>
            </tr>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.name }}</td>
              <td class="text-center">
                <v-btn
                  @click="handleEdit(category)"
                  color="primary"
                  variant="text"
                  size="small"
                  icon="$edit"
                ></v-btn>
                <v-btn
                  @click="handleDelete(category)"
                  color="error"
                  variant="text"
                  size="small"
                  icon="$delete"
                ></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="emit('update:modelValue', false)"
          color="secondary"
          variant="text"
        >
          닫기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>