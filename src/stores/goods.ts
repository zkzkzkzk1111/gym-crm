import { defineStore } from 'pinia';
import { goodsService } from '@/services/goodsService';
import type { Goods, GoodsType, GoodsRequest } from '@/models/Goods';

export const useGoodsStore = defineStore('Goods', {
  state: () => ({
    goodsList: [] as Goods[],
    goodsType : [] as GoodsType[],
    goods: null as Goods | null,
    loading: false,
    error: null as string | null,
    filter: '',
  }),

  getters: {
    filteredGoods(): Goods[] {
      if (!this.filter) return this.goodsList;

      const keyword = this.filter.toLowerCase();
      return this.goodsList.filter(
        (g) =>
          g.goodsName.toLowerCase().includes(keyword) ||
          (g.description?.toLowerCase().includes(keyword) ?? false)
      );
    },

    allGoodsTypes(): GoodsType[] {
      return this.goodsType;
    },

    getGoodsByType: (state) => (type: number) => {
      return state.goodsList.filter((g) => g.type === type);
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        console.log('========== fetchAll 시작 ==========');
        this.goodsList = await goodsService.getAll();
        console.log('goodsList 업데이트 완료:', this.goodsList);
        console.log('goodsList 길이:', this.goodsList.length);
        console.log('==================================');
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch goods';
        console.error('Error fetching goods:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchById(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        this.goods = await goodsService.getById(idx);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch goods';
        console.error('Error fetching goods:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchGoodsType() {
      this.loading = true;
      this.error = null;
      try {
        this.goodsType = await goodsService.getGoodsType();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch goods type';
        console.error('Error fetching goods type:', error);
      } finally {
        this.loading = false;
      }
    },

    async createGoods(goodsRequest: GoodsRequest) {
      this.loading = true;
      this.error = null;
      try {
        console.log('========== createGoods 시작 ==========');
        console.log('요청 데이터:', goodsRequest);
        const response = await goodsService.create(goodsRequest);
        console.log('등록 응답:', response);

        // 응답 status 확인 (200대면 성공)
        if (response.status >= 200 && response.status < 300) {
          // 등록 후 전체 목록 다시 불러오기
          console.log('fetchAll 호출 전 goodsList 길이:', this.goodsList.length);
          await this.fetchAll();
          console.log('fetchAll 호출 후 goodsList 길이:', this.goodsList.length);
          console.log('=====================================');
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create goods';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create goods';
        console.error('Error creating goods:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateGoods(idx: number, goodsRequest: GoodsRequest) {
      this.loading = true;
      this.error = null;
      try {
        console.log('========== updateGoods 시작 ==========');
        console.log('요청 데이터:', goodsRequest);
        const response = await goodsService.update(idx, goodsRequest);
        console.log('수정 응답:', response);

        // 응답 status 확인 (200대면 성공)
        if (response.status >= 200 && response.status < 300) {
          // 수정 후 전체 목록 다시 불러오기
          console.log('fetchAll 호출 전 goodsList 길이:', this.goodsList.length);
          await this.fetchAll();
          console.log('fetchAll 호출 후 goodsList 길이:', this.goodsList.length);
          console.log('=====================================');
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update goods';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update goods';
        console.error('Error updating goods:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteGoods(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        await goodsService.delete(idx);
        this.goodsList = this.goodsList.filter((g) => g.idx !== idx);
        return { success: true };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete goods';
        console.error('Error deleting goods:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    initNewGoods() {
      this.goods = {
        idx: 0,
        goodsName: '',
        cash: null,
        card: null,
        description: null,
        duration: 0,
        type: 0,
        useCount: 0,
        instructor: null,
        instructorName: null,
      };
    },
  },
});