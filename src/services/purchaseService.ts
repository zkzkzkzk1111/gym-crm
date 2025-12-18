import axiosInstance from '@/utils/axios';
import type { Purchase, PurchaseRequest } from '@/models/Purchase';

const BASE_URL = '/api/purchase';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const purchaseService = {
  // 전체 구매 목록 조회
  async getAll(): Promise<Purchase[]> {
    const response = await axiosInstance.get<ApiResponse<Purchase[]>>(`${BASE_URL}/getPurchaseList`);
    return response.data.data;
  },

  // 특정 구매 조회
  async getById(idx: number): Promise<Purchase> {
    const response = await axiosInstance.get<ApiResponse<Purchase>>(`${BASE_URL}/getPurchaseDetail/${idx}`);
    return response.data.data;
  },

  // 구매 생성 (단일)
  async create(purchaseData: PurchaseRequest): Promise<Purchase> {
    const response = await axiosInstance.post<ApiResponse<Purchase>>(`${BASE_URL}/createPurchase`, purchaseData);
    return response.data.data;
  },

  // 구매 생성 (여러 개 - 리스트로 전송)
  async createBulk(purchaseDataList: PurchaseRequest[]): Promise<Purchase[]> {
    const response = await axiosInstance.post<ApiResponse<Purchase[] | null>>(`${BASE_URL}/createPurchase`, purchaseDataList);
    return response.data.data || [];
  },

  // 구매 수정
  async update(idx: number, purchaseData: PurchaseRequest): Promise<Purchase> {
    const response = await axiosInstance.put<ApiResponse<Purchase>>(`${BASE_URL}/${idx}`, purchaseData);
    return response.data.data;
  },

  // 구매 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/${idx}`);
  },
};
