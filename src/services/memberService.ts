import axiosInstance from '@/utils/axios';
import type { Member, MemberRequest } from '@/models/Member';

const BASE_URL = '/api/member';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const memberService = {
  // 전체 회원 목록 조회
  async getAll(): Promise<Member[]> {
    const response = await axiosInstance.get<ApiResponse<Member[]>>(`${BASE_URL}/getMemberList`);
    return response.data.data;
  },

  // 특정 회원 조회
  async getById(idx: number): Promise<Member> {
    const response = await axiosInstance.get<ApiResponse<Member>>(`${BASE_URL}/getMemberDetail/${idx}`);
    return response.data.data;
  },

  // 회원 생성
  async create(memberData: MemberRequest): Promise<Member> {
    const response = await axiosInstance.post<ApiResponse<Member>>(`${BASE_URL}/writeMember`, memberData);
    return response.data.data;
  },

  // 회원 수정
  async update(idx: number, memberData: MemberRequest): Promise<Member> {
    const response = await axiosInstance.put<ApiResponse<Member>>(`${BASE_URL}/${idx}`, memberData);
    return response.data.data;
  },

  // 회원 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/deleteMember/${idx}`);
  },

  // 회원 검색 (이름, 전화번호 등)
  async search(keyword: string): Promise<Member[]> {
    const response = await axiosInstance.get<ApiResponse<Member[]>>(`${BASE_URL}/search`, {
      params: { keyword }
    });
    return response.data.data;
  },

  // 상태별 회원 조회
  async getByStatus(status: number): Promise<Member[]> {
    const response = await axiosInstance.get<ApiResponse<Member[]>>(`${BASE_URL}/status/${status}`);
    return response.data.data;
  },
};