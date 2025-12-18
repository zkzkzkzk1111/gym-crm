import { defineStore } from 'pinia';
import { visitPathService, purposeService, memberStatusService, staffGradeService, goodsTypeService, classTypeService } from '@/services/categoryService';
import type { visitPath, purpose, memberStatus, staffGrade, goodsType, classType } from '@/models/Category';

export const useCategoryStore = defineStore('category', {
  state: () => ({
    visitPaths: [] as visitPath[],
    purposes: [] as purpose[],
    memberStatuses: [] as memberStatus[],
    staffGrades: [] as staffGrade[],
    goodsTypes: [] as goodsType[],
    classTypes: [] as classType[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    allVisitPaths(): visitPath[] {
      return this.visitPaths;
    },

    allPurposes(): purpose[] {
      return this.purposes;
    },

    allMemberStatuses(): memberStatus[] {
      return this.memberStatuses;
    },

    allStaffGrades(): staffGrade[] {
      return this.staffGrades;
    },

    allGoodsTypes(): goodsType[] {
      return this.goodsTypes;
    },

    allClassTypes(): classType[] {
      return this.classTypes;
    },
  },

  actions: {
    async fetchVisitPaths() {
      this.loading = true;
      this.error = null;
      try {
        this.visitPaths = await visitPathService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch visit paths';
        console.error('Error fetching visit paths:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPurposes() {
      this.loading = true;
      this.error = null;
      try {
        this.purposes = await purposeService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch purposes';
        console.error('Error fetching purposes:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMemberStatuses() {
      this.loading = true;
      this.error = null;
      try {
        this.memberStatuses = await memberStatusService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch member statuses';
        console.error('Error fetching member statuses:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStaffGrades() {
      this.loading = true;
      this.error = null;
      try {
        this.staffGrades = await staffGradeService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch staff grades';
        console.error('Error fetching staff grades:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchGoodsTypes() {
      this.loading = true;
      this.error = null;
      try {
        this.goodsTypes = await goodsTypeService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch goods types';
        console.error('Error fetching goods types:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchClassTypes() {
      this.loading = true;
      this.error = null;
      try {
        this.classTypes = await classTypeService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch class types';
        console.error('Error fetching class types:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAll() {
      await Promise.all([
        this.fetchVisitPaths(),
        this.fetchPurposes(),
        this.fetchMemberStatuses(),
        this.fetchStaffGrades(),
        this.fetchGoodsTypes(),
        this.fetchClassTypes()
      ]);
    },

    // 방문경로 추가
    async createVisitPath(visitPathName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitPathService.create({ visitPathName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchVisitPaths();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create visit path';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create visit path';
        console.error('Error creating visit path:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 방문경로 수정
    async updateVisitPath(idx: number, visitPathName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitPathService.update(idx, { visitPathName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchVisitPaths();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update visit path';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update visit path';
        console.error('Error updating visit path:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 방문경로 삭제
    async deleteVisitPath(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await visitPathService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchVisitPaths();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete visit path';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete visit path';
        console.error('Error deleting visit path:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 운동목적 추가
    async createPurpose(purposeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await purposeService.create({ purposeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchPurposes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create purpose';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create purpose';
        console.error('Error creating purpose:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 운동목적 수정
    async updatePurpose(idx: number, purposeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await purposeService.update(idx, { purposeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchPurposes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update purpose';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update purpose';
        console.error('Error updating purpose:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 운동목적 삭제
    async deletePurpose(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await purposeService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchPurposes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete purpose';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete purpose';
        console.error('Error deleting purpose:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 상태 추가
    async createMemberStatus(statusName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await memberStatusService.create({ statusName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchMemberStatuses();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create member status';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create member status';
        console.error('Error creating member status:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 상태 수정
    async updateMemberStatus(idx: number, statusName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await memberStatusService.update(idx, { statusName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchMemberStatuses();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update member status';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update member status';
        console.error('Error updating member status:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 상태 삭제
    async deleteMemberStatus(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await memberStatusService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchMemberStatuses();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete member status';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete member status';
        console.error('Error deleting member status:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 직원 등급 추가
    async createStaffGrade(name: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await staffGradeService.create({ name });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchStaffGrades();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create staff grade';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create staff grade';
        console.error('Error creating staff grade:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 직원 등급 수정
    async updateStaffGrade(idx: number, name: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await staffGradeService.update(idx, { name });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchStaffGrades();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update staff grade';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update staff grade';
        console.error('Error updating staff grade:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 직원 등급 삭제
    async deleteStaffGrade(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await staffGradeService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchStaffGrades();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete staff grade';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete staff grade';
        console.error('Error deleting staff grade:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 상품 타입 추가
    async createGoodsType(typeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await goodsTypeService.create({ typeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchGoodsTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create goods type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create goods type';
        console.error('Error creating goods type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 상품 타입 수정
    async updateGoodsType(idx: number, typeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await goodsTypeService.update(idx, { typeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchGoodsTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update goods type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update goods type';
        console.error('Error updating goods type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 상품 타입 삭제
    async deleteGoodsType(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await goodsTypeService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchGoodsTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete goods type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete goods type';
        console.error('Error deleting goods type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 수업 타입 추가
    async createClassType(typeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await classTypeService.create({ typeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchClassTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to create class type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create class type';
        console.error('Error creating class type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 수업 타입 수정
    async updateClassType(idx: number, typeName: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await classTypeService.update(idx, { typeName });
        if (response.status >= 200 && response.status < 300) {
          await this.fetchClassTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to update class type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update class type';
        console.error('Error updating class type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 수업 타입 삭제
    async deleteClassType(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await classTypeService.delete(idx);
        if (response.status >= 200 && response.status < 300) {
          await this.fetchClassTypes();
          return { success: true, message: response.message };
        } else {
          this.error = response.message || 'Failed to delete class type';
          return { success: false, error: this.error };
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete class type';
        console.error('Error deleting class type:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
  },
});