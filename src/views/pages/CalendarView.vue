<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import EventDetailDialog from '@/components/EventDetailDialog.vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import type { CalendarOptions, EventClickArg, DateSelectArg, DatesSetArg } from '@fullcalendar/core';
import { useGoodsStore } from '@/stores/goods';
import { useMembersStore } from '@/stores/members';
import { useStaffStore } from '@/stores/staff';
import { useEventStore } from '@/stores/event';
import { storeToRefs } from 'pinia';
import type { EventRequest } from '@/models/Event';
import { eventService } from '@/services/eventService';

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

const goodsStore = useGoodsStore();
const membersStore = useMembersStore();
const staffStore = useStaffStore();
const eventStore = useEventStore();
const { goodsList } = storeToRefs(goodsStore);
const { members } = storeToRefs(membersStore);
const { staffList } = storeToRefs(staffStore);
const { eventList } = storeToRefs(eventStore);

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  locale: 'ko',
  buttonText: {
    today: '오늘',
    month: '월',
    week: '주',
    day: '일',
    list: '목록'
  },
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  events: [],
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents,
  datesSet: handleDatesSet,
  eventContent: (arg) => {
    // 리스트 뷰에서는 기본 렌더링 사용
    if (arg.view.type.includes('list')) {
      return { html: '' }; // 기본 렌더링 사용
    }

    const event = arg.event;
    const props = event.extendedProps;

    let timeText = '';
    if (event.allDay) {
      timeText = '[종일]';
    } else{
      timeText = `[${formatTime(props.startTime)} ~ ${formatTime(props.endTime)}]`;
    }

    const arrayOfDomNodes = [];

    const timeDiv = document.createElement('div');
    timeDiv.className = 'fc-event-time';
    timeDiv.innerText = timeText;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'fc-event-title';
    titleDiv.innerText = event.title;

    arrayOfDomNodes.push(timeDiv, titleDiv);

    return { domNodes: arrayOfDomNodes };
  }
});

const currentEvents = ref<CalendarEvent[]>([]);
const dialog = ref(false);
const editDialog = ref(false);
const eventTitle = ref('');
const goodsIdx = ref<number | null>(null);
const staffIdx = ref<number | null>(null);
const memberIdx = ref<number | null>(null);
const eventStart = ref('');
const eventEnd = ref('');
const eventMemo =ref("");
const eventAllDay = ref(false);
const selectedEvent = ref<CalendarEvent | null>(null);

const convertBackendDateToISO = (dateStr: string | null): string => {
  if (!dateStr) return '';
  return dateStr.replace(' ', 'T');
};

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

const convertEventsToCalendarFormat = (): CalendarEvent[] => {
  if (!eventList.value || eventList.value.length === 0) {
    return [];
  }

  return eventList.value.map(event => {
    const isAllDay = event.allDay === 1;

    // 색상 설정 (회원이 있으면 파란색, 강사만 있으면 녹색, 상품만 있으면 주황색)
    let color = '#1976d2'; // 기본 파란색
    if (event.memberIdx) {
      color = '#1976d2'; // 회원 - 파란색
    } else if (event.staffIdx) {
      color = '#388e3c'; // 강사 - 녹색
    } else if (event.goodsIdx) {
      color = '#f57c00'; // 상품 - 주황색
    }

    let displayTitle = event.title;

    displayTitle = `${event.title}`;


    return {
      id: String(event.idx),
      title: displayTitle,
      start: convertBackendDateToISO(event.startAt),
      end: event.endEt ? convertBackendDateToISO(event.endEt) : undefined,
      allDay: isAllDay,
      backgroundColor: color,
      borderColor: color,
      goodsIdx: event.goodsIdx || undefined,
      memberIdx: event.memberIdx || undefined,
      staffIdx: event.staffIdx || undefined,
      memo: event.description || undefined
    };
  });
};

// 캘린더 날짜가 변경될 때 호출되는 함수 (월 이동 시)
async function handleDatesSet(arg: DatesSetArg) {
  // 현재 보고 있는 날짜의 년월을 가져옴
  const currentDate = arg.view.currentStart;
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // getMonth()는 0부터 시작

  console.log(`[CalendarView] Loading events for ${year}-${month}`);

  // 해당 년월의 이벤트 데이터 가져오기
  await eventStore.fetchByYearMonth(year, month);

  console.log('[CalendarView] Event list from store:', eventList.value);

  // 불러온 이벤트를 캘린더에 설정
  const calendarEvents = convertEventsToCalendarFormat();
  console.log('[CalendarView] Converted calendar events:', calendarEvents);

  if (calendarOptions.value.events) {
    (calendarOptions.value.events as CalendarEvent[]) = calendarEvents;
  }
}

onMounted(async () => {
  // 상품, 회원, 강사 데이터만 먼저 가져오기
  // 이벤트는 handleDatesSet에서 로드됨
  await Promise.all([
    goodsStore.fetchAll(),
    membersStore.fetchAll(),
    staffStore.fetchAll()
  ]);

  console.log('[CalendarView] Initial data loaded (goods, members, staff)');
});

const formatDateTimeLocal = (dateStr: string, allDay: boolean = false) => {
  if (allDay || dateStr.length === 10) {
    return dateStr.substring(0, 10);
  }
  return dateStr.substring(0, 16);
};

function handleDateSelect(selectInfo: DateSelectArg) {
  dialog.value = true;
  eventAllDay.value = selectInfo.allDay;

  if (selectInfo.allDay) {
    const startDate = selectInfo.startStr.substring(0, 10);
    const endDate = new Date(selectInfo.endStr);
    endDate.setDate(endDate.getDate() - 1);
    const endDateStr = endDate.toISOString().substring(0, 10);

    eventStart.value = startDate;
    eventEnd.value = endDateStr;
  } else {
    eventStart.value = formatDateTimeLocal(selectInfo.startStr);
    eventEnd.value = formatDateTimeLocal(selectInfo.endStr);
  }

  selectInfo.view.calendar.unselect();
}

function handleEventClick(clickInfo: EventClickArg) {
  const eventData = clickInfo.event.extendedProps;
  const originalEvent = eventList.value.find(e => String(e.idx) === clickInfo.event.id);

  selectedEvent.value = {
    id: clickInfo.event.id,
    title: clickInfo.event.title,
    start: originalEvent ? originalEvent.startAt : clickInfo.event.startStr,
    end: originalEvent?.endEt || clickInfo.event.endStr || '',
    allDay: clickInfo.event.allDay,
    backgroundColor: clickInfo.event.backgroundColor || '#1976d2',
    borderColor: clickInfo.event.borderColor || '#1976d2',
    goodsIdx: eventData.goodsIdx,
    memberIdx: eventData.memberIdx,
    staffIdx: eventData.staffIdx,
    memo: eventData.memo
  };
  editDialog.value = true;
}

function handleEvents(events: any[]) {
  currentEvents.value = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.startStr,
    end: event.endStr,
    allDay: event.allDay
  }));
}

async function addEvent() {
  if (!eventTitle.value) {
    return;
  }

  try {
    // 날짜를 백엔드 형식으로 변환 (yyyy-MM-dd HH:mm:ss)
    let startAt = eventStart.value;
    let endEt = eventEnd.value;

    // EventRequest 생성
    const eventRequest: EventRequest = {
      memberIdx: memberIdx.value,
      staffIdx: staffIdx.value,
      goodsIdx: goodsIdx.value,
      title: eventTitle.value,
      description: eventMemo.value || null,
      startAt: startAt,
      endEt: endEt,
      allDay: eventAllDay.value ? 1 : 0
    };

    // Store를 통해 이벤트 생성
    const result = await eventStore.createEvent(eventRequest);

    if (result.success && result.data) {
      // API 응답이 성공하면 캘린더에 이벤트 추가
      const newEvent: CalendarEvent = {
        id: String(result.data.idx),
        title: eventTitle.value,
        start: eventStart.value,
        end: eventEnd.value,
        allDay: eventAllDay.value,
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
        goodsIdx: goodsIdx.value || undefined,
        memberIdx: memberIdx.value || undefined,
        staffIdx: staffIdx.value || undefined,
        memo: eventMemo.value || undefined
      };

      if (Array.isArray(calendarOptions.value.events)) {
        (calendarOptions.value.events as CalendarEvent[]).push(newEvent);
        calendarOptions.value = { ...calendarOptions.value };
      }

      closeDialog();
    } else {
      alert(`일정 등록에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('일정 등록 실패:', error);
    alert(`일정 등록에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}

async function updateEvent(event: CalendarEvent) {
  if (event && event.id) {
    const events = calendarOptions.value.events as CalendarEvent[];
    const index = events.findIndex(e => e.id === event.id);

    if (index !== -1) {
      events[index] = {
        ...events[index],
        title: event.title
      };
      calendarOptions.value = { ...calendarOptions.value };
    }

    closeEditDialog();
  }
}

async function deleteEvent(eventId: string) {
  if (!eventId) return;

  try {
    // API 호출하여 삭제
    await eventService.delete(Number(eventId));

    // 캘린더에서도 제거
    const events = calendarOptions.value.events as CalendarEvent[];
    calendarOptions.value.events = events.filter(e => e.id !== eventId);

    closeEditDialog();
  } catch (error: any) {
    console.error('일정 삭제 실패:', error);
    alert(`일정 삭제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}

function closeDialog() {
  dialog.value = false;
  eventTitle.value = '';
  goodsIdx.value = null;
  memberIdx.value = null;
  staffIdx.value = null;
  eventMemo.value = '';
  eventStart.value = '';
  eventEnd.value = '';
  eventAllDay.value = false;
}

function closeEditDialog() {
  editDialog.value = false;
  selectedEvent.value = null;
}
</script>

<template>
  <UiMainContainer>
    <UiParentCard title="일정 관리">
      <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
      </div>
    </UiParentCard>

    <!-- 새 일정 추가 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">새 일정 추가</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="goodsIdx"
            :items="goodsList"
            item-value="idx"
            item-title="goodsName"
            label="상품 선택"
            placeholder="선택하지 않음 (선택사항)"
            variant="outlined"
            clearable
            no-data-text="상품이 없습니다"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.goodsName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.raw.duration }}개월 / {{ item.raw.useCount }}회
                  - 현금: {{ item.raw.cash?.toLocaleString() }}원
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-autocomplete
            v-model="memberIdx"
            :items="members"
            item-value="idx"
            item-title="userName"
            label="회원 선택"
            placeholder="선택하지 않음 (선택사항)"
            variant="outlined"
            clearable
            no-data-text="회원이 없습니다"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="40">
                    <span class="text-white">{{ item.raw.userName.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.userName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.raw.phone }}
                  <span v-if="item.raw.age"> · {{ item.raw.age }}세</span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-autocomplete
            v-model="staffIdx"
            :items="staffList"
            item-value="idx"
            item-title="name"
            label="강사 선택"
            placeholder="선택하지 않음 (선택사항)"
            variant="outlined"
            clearable
            no-data-text="강사가 없습니다"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-avatar color="secondary" size="40">
                    <span class="text-white">{{ item.raw.name.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="item.raw.phone">{{ item.raw.phone }}</span>
                  <span v-if="item.raw.gradeName"> · {{ item.raw.gradeName }}</span>
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-text-field
            v-model="eventTitle"
            label="일정 제목"
            variant="outlined"
            required
          ></v-text-field>
          <v-checkbox
            v-model="eventAllDay"
            label="종일"
          ></v-checkbox>
          <v-text-field
            v-model="eventStart"
            :label="eventAllDay ? '시작 날짜' : '시작 시간'"
            variant="outlined"
            :type="eventAllDay ? 'date' : 'datetime-local'"
          ></v-text-field>
          <v-text-field
            v-model="eventEnd"
            :label="eventAllDay ? '종료 날짜' : '종료 시간'"
            variant="outlined"
            :type="eventAllDay ? 'date' : 'datetime-local'"
          ></v-text-field>
          <v-text-field
            v-model="eventMemo"
            label="메모"
            placeholder="메모를 입력하세요 (선택사항)"
            variant="outlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" variant="text" @click="closeDialog">취소</v-btn>
          <v-btn color="primary" variant="elevated" @click="addEvent">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 일정 수정/삭제 다이얼로그 -->
    <EventDetailDialog
      v-model="editDialog"
      :selected-event="selectedEvent"
      @delete="deleteEvent"
      @update="updateEvent"
    />
  </UiMainContainer>
</template>

<style scoped>

.calendar-container {
  padding: 20px;
}

:deep(.fc) {
  font-family: inherit;
}

</style>