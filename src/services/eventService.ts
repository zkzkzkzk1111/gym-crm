import axiosInstance from '@/utils/axios';
import type { Event, EventRequest } from '@/models/Event';

const BASE_URL = '/api/event';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const eventService = {
  // 전체 이벤트 목록 조회
  async getAll(): Promise<Event[]> {
    const response = await axiosInstance.get<ApiResponse<Event[]>>(`${BASE_URL}/getEventList`);
    return response.data.data;
  },

  // 연월별 이벤트 목록 조회
  async getByYearMonth(year: number, month: number): Promise<Event[]> {
    console.log(`[EventService] Fetching events for ${year}-${month}`);
    const response = await axiosInstance.get<{ [date: string]: Event[] }>(`${BASE_URL}/getEventList/${year}/${month}`);
    console.log('[EventService] API response:', response.data);

    // 백엔드 응답이 { "2025-12-11": [...], "2025-12-12": [...] } 형태이므로
    // 이를 평탄화하여 Event[] 배열로 변환
    const eventsByDate = response.data;
    const allEvents: Event[] = [];

    if (eventsByDate && typeof eventsByDate === 'object') {
      Object.values(eventsByDate).forEach(events => {
        if (Array.isArray(events)) {
          allEvents.push(...events);
        }
      });
    }

    console.log('[EventService] Flattened events:', allEvents);
    return allEvents;
  },

  // 특정 이벤트 조회
  async getById(idx: number): Promise<Event> {
    const response = await axiosInstance.get<ApiResponse<Event>>(`${BASE_URL}/getEventDetail/${idx}`);
    return response.data.data;
  },

  // 이벤트 생성
  async create(eventData: EventRequest): Promise<Event> {
    const response = await axiosInstance.post(`${BASE_URL}/createEvent`, eventData);

    // 백엔드가 data를 null로 반환하는 경우, 요청 데이터를 기반으로 Event 객체 생성
    if (response.data.status === 200 || response.data.status === 202) {
      return {
        idx: Date.now(), // 임시 idx (백엔드에서 실제 idx를 반환하지 않으므로)
        ...eventData
      };
    }

    throw new Error(response.data.message || 'Event creation failed');
  },

  // 이벤트 수정
  async update(idx: number, eventData: EventRequest): Promise<Event> {
    const response = await axiosInstance.put<ApiResponse<Event>>(`${BASE_URL}/updateEvent/${idx}`, eventData);
    return response.data.data;
  },

  // 이벤트 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/deleteEvent/${idx}`);
  },
};