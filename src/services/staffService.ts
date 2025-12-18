import axiosInstance from '@/utils/axios';
import type { Staff, StaffGrade, StaffRequest } from '@/models/Staff';
import type { ClassRequest } from '@/models/Class.ts';

const BASE_URL = '/api/member';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const staffService = {
  // 전체 스태프 목록 조회
  async getAll(): Promise<Staff[]> {
    const response = await axiosInstance.get<ApiResponse<Staff[]>>(`${BASE_URL}/getStaffList`);
    return response.data.data;
  },

  // 특정 스태프 조회
  async getById(idx: number): Promise<Staff> {
    const response = await axiosInstance.get<ApiResponse<Staff>>(`${BASE_URL}/getStaffDetail/${idx}`);
    return response.data.data;
  },

  // 스태프 생성
  async create(staffData: StaffRequest): Promise<Staff> {
    const response = await axiosInstance.post<ApiResponse<Staff>>(`${BASE_URL}/createStaff`, staffData);
    return response.data.data;
  },

  // 스태프 수정
  async update(idx: number, staffData: StaffRequest): Promise<Staff> {
    const response = await axiosInstance.put<ApiResponse<Staff>>(`${BASE_URL}/staff/${idx}`, staffData);
    return response.data.data;
  },

  // 스태프 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/staff/${idx}`);
  },

  // 스태프 검색 (이름, 전화번호 등)
  async search(keyword: string): Promise<Staff[]> {
    const response = await axiosInstance.get<ApiResponse<Staff[]>>(`${BASE_URL}/staff/search`, {
      params: { keyword }
    });
    return response.data.data;
  },

  // 등급 리스트 조회
  async getGradeList(): Promise<StaffGrade[]> {
    const response = await axiosInstance.get<ApiResponse<StaffGrade[]>>(`${BASE_URL}/getStaffGradeList`);
    return response.data.data;
  },
};