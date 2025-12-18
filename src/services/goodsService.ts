import axiosInstance from '@/utils/axios';
import type { Goods, GoodsType, GoodsRequest } from '@/models/Goods';

const BASE_URL = '/api/goods';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const goodsService = {
  // 전체 상품 목록 조회
  async getAll(): Promise<Goods[]> {
    const response = await axiosInstance.get<ApiResponse<Goods[]>>(`${BASE_URL}/getGoodsList`);
    console.log('========== 상품 목록 조회 API 응답 ==========');
    console.log('전체 응답:', response);
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    console.log('첫 번째 상품:', response.data.data[0]);
    console.log('======================================');
    return response.data.data;
  },

  // 특정 상품 조회
  async getById(idx: number): Promise<Goods> {
    const response = await axiosInstance.get<ApiResponse<Goods>>(`${BASE_URL}/getGoodsDetail/${idx}`);
    return response.data.data;
  },

  // 상품 생성
  async create(goodsData: GoodsRequest): Promise<any> {
    const response = await axiosInstance.post(`${BASE_URL}/createGoods`, goodsData);
    console.log('========== 상품 등록 API 응답 ==========');
    console.log('전체 응답:', response);
    console.log('response.data:', response.data);
    console.log('======================================');
    // 등록 응답은 data가 null이므로 응답 전체를 반환
    return response.data;
  },

  // 상품 수정
  async update(idx: number, goodsData: GoodsRequest): Promise<any> {
    const response = await axiosInstance.put(`${BASE_URL}/${idx}`, goodsData);
    console.log('========== 상품 수정 API 응답 ==========');
    console.log('전체 응답:', response);
    console.log('response.data:', response.data);
    console.log('======================================');
    // 수정 응답도 data가 null일 수 있으므로 응답 전체를 반환
    return response.data;
  },

  // 상품 삭제
  async delete(idx: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`${BASE_URL}/${idx}`);
  },

  async getGoodsType():Promise<GoodsType[]>{
    const response = await axiosInstance.get<ApiResponse<GoodsType[]>>(`${BASE_URL}/getGoodsTypeList`);
    return response.data.data;
  },

  // 타입별 상품 조회
  async getByType(type: number): Promise<Goods[]> {
    const response = await axiosInstance.get<ApiResponse<Goods[]>>(`${BASE_URL}/type/${type}`);
    return response.data.data;
  },
};
