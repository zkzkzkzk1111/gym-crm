<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  label?: string;
  initialValue?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', name: string): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '카테고리 추가',
  label: '카테고리 이름',
  initialValue: ''
});

const emit = defineEmits<Emits>();

const categoryName = ref('');

// 다이얼로그가 열릴 때 초기값 설정
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    categoryName.value = props.initialValue;
  }
});

const handleConfirm = () => {
  if (categoryName.value.trim()) {
    emit('confirm', categoryName.value.trim());
    emit('update:modelValue', false);
    categoryName.value = '';
  }
};

const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
  categoryName.value = '';
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400"
    persistent
  >
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pt-4">
        <v-text-field
          v-model="categoryName"
          :label="label"
          variant="outlined"
          density="comfortable"
          autofocus
          @keyup.enter="handleConfirm"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="handleCancel"
          color="secondary"
          variant="text"
        >
          취소
        </v-btn>
        <v-btn
          @click="handleConfirm"
          color="primary"
          variant="elevated"
          :disabled="!categoryName.trim()"
        >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>