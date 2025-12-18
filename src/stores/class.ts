import { defineStore } from 'pinia';
import { classService } from '@/services/classService';
import type { Class, ClassType, ClassRequest } from '@/models/Class';

export const useClassStore = defineStore('Class', {
  state: () => ({
    classList: [] as Class[],
    classType : [] as ClassType[],
    class: null as Class | null,
    loading: false,
    error: null as string | null,
    filter: '',
  }),

  getters: {
    filteredClass(): Class[] {
      if (!this.filter) return this.classList;

      const keyword = this.filter.toLowerCase();
      return this.classList.filter(
        (c) =>
          c.className.toLowerCase().includes(keyword) ||
          (c.description?.toLowerCase().includes(keyword) ?? false)
      );
    },

    allClassTypes(): ClassType[] {
      return this.classType;
    },

    getClassByType: (state) => (type: number) => {
      return state.classList.filter((g) => g.type === type);
    },
  },

  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.classList = await classService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch class';
        console.error('Error fetching class:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchById(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        this.class = await classService.getById(idx);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch class';
        console.error('Error fetching class:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchClassType() {
      this.loading = true;
      this.error = null;
      try {
        this.classType = await classService.getClassType();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch class type';
        console.error('Error fetching class type:', error);
      } finally {
        this.loading = false;
      }
    },

    async createClass(classRequest: ClassRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newClass = await classService.create(classRequest);
        this.classList.push(newClass);
        return { success: true, data: newClass };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create class';
        console.error('Error creating class:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateClass(idx: number, classRequest: ClassRequest) {
      this.loading = true;
      this.error = null;
      try {
        const updatedClass = await classService.update(idx, classRequest);
        const index = this.classList.findIndex((c) => c.idx === idx);
        if (index !== -1) {
          this.classList[index] = updatedClass;
        }
        return { success: true, data: updatedClass };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update class';
        console.error('Error updating class:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteClass(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        await classService.delete(idx);
        this.classList = this.classList.filter((c) => c.idx !== idx);
        return { success: true };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete class';
        console.error('Error deleting class:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // � �� �� 0T
    initNewClass() {
      this.class = {
        idx: 0,
        className: '',
        cash: null,
        card: null,
        description: null,
        duration: 0,
        type: 0,
        useCount: 0,
        typeName:'',
        instructor: null,
        instructorName:null,
      };
    },
  },
});