import axiosInstance from '@/utils/axios';
import type { Class, ClassRequest, ClassType } from '@/models/Class';

const BASE_URL = '/api/class';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const classService = {
  // 전체 수업 목록 조회
  async getAll(): Promise<Class[]> {
    const response = await axiosInstance.get<ApiResponse<Class[]>>(`${BASE_URL}/getClassList`);
    return response.data.data;
  },

  // 특정 수업 조회
  async getById(idx: number): Promise<Class> {
    const response = await axiosInstance.get<ApiResponse<Class>>(`${BASE_URL}/getClassDetail/${idx}`);
    return response.data.data;
  },

  // 수업 생성
  async create(classData: ClassRequest): Promise<Class> {
    const response = await axiosInstance.post<ApiResponse<Class>>(`${BASE_URL}/createClass`, classData);
    return response.data.data;
  },

  // 수업 수정
  async update(idx: number, classData: ClassRequest): Promise<Class> {
    const response = await axiosInstance.put<ApiResponse<Class>>(`${BASE_URL}/${idx}`, classData);
    return response.data.data;
  },

  // 수업 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/${idx}`);
  },

  async getClassType():Promise<ClassType[]>{
    const response = await axiosInstance.get<ApiResponse<ClassType[]>>(`${BASE_URL}/getClassTypeList`);
    return response.data.data;
  },

  // 타입별 수업 조회
  async getByType(type: number): Promise<Class[]> {
    const response = await axiosInstance.get<ApiResponse<Class[]>>(`${BASE_URL}/type/${type}`);
    return response.data.data;
  },
};
