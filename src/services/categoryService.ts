import type { visitPath, purpose, memberStatus, staffGrade, goodsType, classType } from '@/models/Category.ts';
import axiosInstance from '@/utils/axios';
import { staffService } from './staffService';
import { goodsService } from './goodsService';
import { classService } from './classService';

const BASE_URL = '/api/common';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface PurposeRequest {
  purposeName: string;
}

interface VisitPathRequest {
  visitPathName: string;
}

interface MemberStatusRequest {
  statusName: string;
}

interface StaffGradeRequest {
  name: string;
}

interface GoodsTypeRequest {
  typeName: string;
}

interface ClassTypeRequest {
  typeName: string;
}

export const purposeService = {
  // 전체 운동 목적 목록 조회
  async getAll(): Promise<purpose[]> {
    const response = await axiosInstance.get<ApiResponse<purpose[]>>(`${BASE_URL}/getPurposeList`);
    return response.data.data;
  },

  // 특정 운동 목적 카테고리 조회
  async getById(idx: number): Promise<purpose> {
    const response = await axiosInstance.get<ApiResponse<purpose>>(`${BASE_URL}/getPurpose/${idx}`);
    return response.data.data;
  },

  // 운동 목적 추가
  async create(request: PurposeRequest): Promise<ApiResponse<purpose>> {
    const response = await axiosInstance.post<ApiResponse<purpose>>(`${BASE_URL}/category/createPurpose`, request);
    return response.data;
  },

  // 운동 목적 수정
  async update(idx: number, request: PurposeRequest): Promise<ApiResponse<purpose>> {
    const response = await axiosInstance.put<ApiResponse<purpose>>(`${BASE_URL}/category/updatePurpose/${idx}`, request);
    return response.data;
  },

  // 운동 목적 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deletePurpose/${idx}`);
    return response.data;
  },
}

export const visitPathService = {
  // 전체 방문 경로 목록 조회
  async getAll(): Promise<visitPath[]> {
    const response = await axiosInstance.get<ApiResponse<visitPath[]>>(`${BASE_URL}/getVisitPathList`);
    return response.data.data;
  },

  // 특정 방문 경로 조회
  async getById(idx: number): Promise<visitPath> {
    const response = await axiosInstance.get<ApiResponse<visitPath>>(`${BASE_URL}/VisitPath/${idx}`);
    return response.data.data;
  },

  // 방문 경로 추가
  async create(request: VisitPathRequest): Promise<ApiResponse<visitPath>> {
    const response = await axiosInstance.post<ApiResponse<visitPath>>(`${BASE_URL}/category/createVisitPath`, request);
    return response.data;
  },

  // 방문 경로 수정
  async update(idx: number, request: VisitPathRequest): Promise<ApiResponse<visitPath>> {
    const response = await axiosInstance.put<ApiResponse<visitPath>>(`${BASE_URL}/category/updateVisitPath/${idx}`, request);
    return response.data;
  },

  // 방문 경로 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deleteVisitPath/${idx}`);
    return response.data;
  },
}

export const memberStatusService = {
  // 전체 회원 상태 목록 조회
  async getAll(): Promise<memberStatus[]> {
    const response = await axiosInstance.get<ApiResponse<memberStatus[]>>(`${BASE_URL}/getMemberStatusList`);
    return response.data.data;
  },

  // 회원 상태 추가
  async create(request: MemberStatusRequest): Promise<ApiResponse<memberStatus>> {
    const response = await axiosInstance.post<ApiResponse<memberStatus>>(`${BASE_URL}/category/createMemberStatus`, request);
    return response.data;
  },

  // 회원 상태 수정
  async update(idx: number, request: MemberStatusRequest): Promise<ApiResponse<memberStatus>> {
    const response = await axiosInstance.put<ApiResponse<memberStatus>>(`${BASE_URL}/category/updateMemberStatus/${idx}`, request);
    return response.data;
  },

  // 회원 상태 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deleteMemberStatus/${idx}`);
    return response.data;
  },
}

export const staffGradeService = {
  // 전체 직원 등급 목록 조회
  async getAll(): Promise<staffGrade[]> {
    return await staffService.getGradeList();
  },

  // 직원 등급 추가
  async create(request: StaffGradeRequest): Promise<ApiResponse<staffGrade>> {
    const response = await axiosInstance.post<ApiResponse<staffGrade>>(`${BASE_URL}/category/createStaffGrade`, request);
    return response.data;
  },

  // 직원 등급 수정
  async update(idx: number, request: StaffGradeRequest): Promise<ApiResponse<staffGrade>> {
    const response = await axiosInstance.put<ApiResponse<staffGrade>>(`${BASE_URL}/category/updateStaffGrade/${idx}`, request);
    return response.data;
  },

  // 직원 등급 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deleteStaffGrade/${idx}`);
    return response.data;
  },
}

export const goodsTypeService = {
  // 전체 상품 타입 목록 조회
  async getAll(): Promise<goodsType[]> {
    return await goodsService.getGoodsType();
  },

  // 상품 타입 추가
  async create(request: GoodsTypeRequest): Promise<ApiResponse<goodsType>> {
    const response = await axiosInstance.post<ApiResponse<goodsType>>(`${BASE_URL}/category/createGoodsType`, request);
    return response.data;
  },

  // 상품 타입 수정
  async update(idx: number, request: GoodsTypeRequest): Promise<ApiResponse<goodsType>> {
    const response = await axiosInstance.put<ApiResponse<goodsType>>(`${BASE_URL}/category/updateGoodsType/${idx}`, request);
    return response.data;
  },

  // 상품 타입 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deleteGoodsType/${idx}`);
    return response.data;
  },
}

export const classTypeService = {
  // 전체 수업 타입 목록 조회
  async getAll(): Promise<classType[]> {
    return await classService.getClassType();
  },

  // 수업 타입 추가
  async create(request: ClassTypeRequest): Promise<ApiResponse<classType>> {
    const response = await axiosInstance.post<ApiResponse<classType>>(`${BASE_URL}/category/createClassType`, request);
    return response.data;
  },

  // 수업 타입 수정
  async update(idx: number, request: ClassTypeRequest): Promise<ApiResponse<classType>> {
    const response = await axiosInstance.put<ApiResponse<classType>>(`${BASE_URL}/category/updateClassType/${idx}`, request);
    return response.data;
  },

  // 수업 타입 삭제
  async delete(idx: number): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/category/deleteClassType/${idx}`);
    return response.data;
  },
}