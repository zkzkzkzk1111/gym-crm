<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '확인',
  message: '이 작업을 실행하시겠습니까?',
  icon: 'mdi-alert-circle-outline',
  confirmText: '확인',
  cancelText: '취소',
  confirmColor: 'primary',
  cancelColor: 'secondary'
});

const emit = defineEmits<Emits>();

const handleConfirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="400"
    persistent
  >
    <v-card
      :prepend-icon="icon"
      :text="message"
      :title="title"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn
          @click="handleCancel"
          :color="cancelColor"
          variant="text"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          @click="handleConfirm"
          :color="confirmColor"
          variant="elevated"
        >
          {{ confirmText }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>