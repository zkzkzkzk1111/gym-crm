import { defineStore } from 'pinia';
import { purchaseService } from '@/services/purchaseService';
import type { Purchase, PurchaseRequest } from '@/models/Purchase';

export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    purchases: [] as Purchase[],
    purchase: null as Purchase | null,
    loading: false,
    error: null as string | null,
    filter: '',
  }),

  getters: {
    // 필터링된 구매 목록
    filteredPurchases(): Purchase[] {
      if (!this.filter) return this.purchases;

      const keyword = this.filter.toLowerCase();
      return this.purchases.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.buyer.toLowerCase().includes(keyword) ||
          p.phone.includes(keyword) ||
          p.type.toLowerCase().includes(keyword)
      );
    },

    // 결제 수단별 필터링
    getByPaymentMethod: (state) => (method: string) => {
      return state.purchases.filter((p) => p.paymentMethod === method);
    },

    // 상태별 필터링
    getByStatus: (state) => (status: number) => {
      return state.purchases.filter((p) => p.status === status);
    },
  },

  actions: {
    // 전체 구매 목록 가져오기
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.purchases = await purchaseService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch purchases';
        console.error('Error fetching purchases:', error);
      } finally {
        this.loading = false;
      }
    },

    // 특정 구매 가져오기
    async fetchById(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        this.purchase = await purchaseService.getById(idx);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch purchase';
        console.error('Error fetching purchase:', error);
      } finally {
        this.loading = false;
      }
    },

    // 구매 생성 (단일)
    async createPurchase(purchaseRequest: PurchaseRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newPurchase = await purchaseService.create(purchaseRequest);
        this.purchases.push(newPurchase);
        return { success: true, data: newPurchase };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create purchase';
        console.error('Error creating purchase:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 구매 생성 (여러 개 - 리스트로 전송)
    async createPurchaseBulk(purchaseRequestList: PurchaseRequest[]) {
      this.loading = true;
      this.error = null;
      try {
        const newPurchases = await purchaseService.createBulk(purchaseRequestList);

        // 배열인지 확인 후 추가
        if (Array.isArray(newPurchases) && newPurchases.length > 0) {
          this.purchases.push(...newPurchases);
        } else if (newPurchases) {
          // 배열이 아닌 단일 객체인 경우
          this.purchases.push(newPurchases as any);
        }

        return { success: true, data: newPurchases };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create purchases';
        console.error('Error creating purchases:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 구매 수정
    async updatePurchase(idx: number, purchaseRequest: PurchaseRequest) {
      this.loading = true;
      this.error = null;
      try {
        const updatedPurchase = await purchaseService.update(idx, purchaseRequest);
        const index = this.purchases.findIndex((p) => p.idx === idx);
        if (index !== -1) {
          this.purchases[index] = updatedPurchase;
        }
        return { success: true, data: updatedPurchase };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update purchase';
        console.error('Error updating purchase:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 구매 삭제
    async deletePurchase(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        await purchaseService.delete(idx);
        this.purchases = this.purchases.filter((p) => p.idx !== idx);
        return { success: true };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete purchase';
        console.error('Error deleting purchase:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 새 구매 폼용 초기화
    initNewPurchase() {
      this.purchase = {
        idx: 0,
        type: '',
        name: '',
        buyer: '',
        cnt: 0,
        price: 0,
        paymentMethod: '',
        paidAt: '',
        status: 0,
        phone: '',
        statusName: '',
      };
    },
  },
});