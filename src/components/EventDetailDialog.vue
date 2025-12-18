<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGoodsStore } from '@/stores/goods';
import { useMembersStore } from '@/stores/members';
import { useStaffStore } from '@/stores/staff';
import { storeToRefs } from 'pinia';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

interface CalendarEvent {
  id?: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  goodsIdx?: number;
  memberIdx?: number;
  staffIdx?: number;
  memo?: string;
}

interface Props {
  modelValue: boolean;
  selectedEvent: CalendarEvent | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'delete', eventId: string): void;
  (e: 'update', event: CalendarEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const goodsStore = useGoodsStore();
const membersStore = useMembersStore();
const staffStore = useStaffStore();
const { goodsList } = storeToRefs(goodsStore);
const { members } = storeToRefs(membersStore);
const { staffList } = storeToRefs(staffStore);

const eventTitle = ref('');
const showConfirmDialog = ref(false);

watch(() => props.selectedEvent, (newEvent) => {
  if (newEvent) {
    eventTitle.value = newEvent.title;
  }
}, { immediate: true });

const formatTime = (timeStr: string): string => {
  if (!timeStr || timeStr.length < 5) return '';
  const [hourStr, minute] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);

  if (hour === 0) {
    return `오전 12:${minute}`;
  } else if (hour < 12) {
    return `오전 ${hour}:${minute}`;
  } else if (hour === 12) {
    return `오후 12:${minute}`;
  } else {
    return `오후 ${hour - 12}:${minute}`;
  }
};

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '';

  const normalized = dateStr.replace('T', ' ');
  const parts = normalized.split(' ');

  if (parts.length < 2) return '';

  const datePart = parts[0]; // "2025-12-11"
  const timePart = parts[1].substring(0, 5); // "00:00:00" -> "00:00"

  const [year, month, day] = datePart.split('-');

  return `${year}년 ${month}월 ${day}일 ${formatTime(timePart)}`;
};

const handleClose = () => {
  emit('update:modelValue', false);
  eventTitle.value = '';
};

const handleDeleteClick = () => {
  showConfirmDialog.value = true;
};

const confirmDelete = () => {
  if (props.selectedEvent?.id) {
    emit('delete', props.selectedEvent.id);
  }
};

const handleUpdate = () => {
  if (props.selectedEvent && eventTitle.value) {
    emit('update', {
      ...props.selectedEvent,
      title: eventTitle.value
    });
  }
};
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">일정 정보</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="eventTitle"
          label="일정 제목"
          variant="outlined"
          required
        ></v-text-field>

        <div v-if="selectedEvent" class="mt-4">
          <div class="text-subtitle-2 mb-2">
            <v-chip color="primary" size="small" class="mr-2">
              {{ selectedEvent.allDay ? '종일' : '시간 지정' }}
            </v-chip>
          </div>

          <div class="text-body-1 mb-3">
            <div><strong>시작:</strong> {{ formatDateTime(selectedEvent.start) }}</div>
            <div v-if="selectedEvent.end" class="mt-1">
              <strong>종료:</strong> {{ formatDateTime(selectedEvent.end) }}
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <!-- 상품 정보 -->
          <div v-if="selectedEvent.goodsIdx" class="mb-3">
            <div class="text-subtitle-2 text-grey-darken-1 mb-1">상품</div>
            <v-chip color="blue-grey" size="small">
              {{ goodsList.find(g => g.idx === selectedEvent.goodsIdx)?.goodsName || '알 수 없음' }}
            </v-chip>
          </div>

          <!-- 회원 정보 -->
          <div v-if="selectedEvent.memberIdx" class="mb-3">
            <div class="text-subtitle-2 text-grey-darken-1 mb-1">회원</div>
            <div class="d-flex align-center">
              <v-avatar color="primary" size="32" class="mr-2">
                <span class="text-white text-caption">
                  {{ members.find(m => m.idx === selectedEvent.memberIdx)?.userName.charAt(0) || '?' }}
                </span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ members.find(m => m.idx === selectedEvent.memberIdx)?.userName || '알 수 없음' }}
                </div>
                <div class="text-caption text-grey">
                  {{ members.find(m => m.idx === selectedEvent.memberIdx)?.phone || '-' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 강사 정보 -->
          <div v-if="selectedEvent.staffIdx" class="mb-3">
            <div class="text-subtitle-2 text-grey-darken-1 mb-1">강사</div>
            <div class="d-flex align-center">
              <v-avatar color="secondary" size="32" class="mr-2">
                <span class="text-white text-caption">
                  {{ staffList.find(s => s.idx === selectedEvent.staffIdx)?.name.charAt(0) || '?' }}
                </span>
              </v-avatar>
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ staffList.find(s => s.idx === selectedEvent.staffIdx)?.name || '알 수 없음' }}
                </div>
                <div class="text-caption text-grey">
                  {{ staffList.find(s => s.idx === selectedEvent.staffIdx)?.gradeName || '-' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 메모 -->
          <div v-if="selectedEvent.memo" class="mb-3">
            <div class="text-subtitle-2 text-grey-darken-1 mb-1">메모</div>
            <div class="text-body-2 pa-2 bg-grey-lighten-4 rounded">
              {{ selectedEvent.memo }}
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" variant="text" @click="handleDeleteClick">삭제</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="text" @click="handleClose">취소</v-btn>
        <v-btn color="primary" variant="elevated" @click="handleUpdate">저장</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 삭제 확인 다이얼로그 -->
  <ConfirmDialog
    v-model="showConfirmDialog"
    title="일정 삭제"
    message="이 일정을 삭제하시겠습니까? 삭제된 일정은 복구할 수 없습니다."
    icon="mdi-delete-alert"
    confirm-text="삭제"
    cancel-text="취소"
    confirm-color="error"
    @confirm="confirmDelete"
  />
</template>