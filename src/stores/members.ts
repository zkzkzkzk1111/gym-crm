import { defineStore } from 'pinia';
import { memberService } from '@/services/memberService';
import type { Member, MemberRequest } from '@/models/Member';

export const useMembersStore = defineStore('Members', {
  state: () => ({
    members: [] as Member[],
    member: null as Member | null,
    loading: false,
    error: null as string | null,
    filter: '',
  }),

  getters: {
    // 필터링된 회원 목록
    filteredMembers(): Member[] {
      if (!this.filter) return this.members;

      const keyword = this.filter.toLowerCase();
      return this.members.filter(
        (m) =>
          m.userName.toLowerCase().includes(keyword) ||
          m.phone.includes(keyword) ||
          (m.consultantName?.toLowerCase().includes(keyword) ?? false)
      );
    },

    // 활성 회원 수
    activeMembers(): Member[] {
      return this.members.filter((m) => m.status === 1);
    },

    // 만료 임박 회원 (7일 이내)
    expiringMembers(): Member[] {
      return this.members.filter((m) => m.dayNum !== null && m.dayNum <= 7 && m.dayNum > 0);
    },
  },

  actions: {
    // 전체 회원 목록 가져오기
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        this.members = await memberService.getAll();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch members';
        console.error('Error fetching members:', error);
      } finally {
        this.loading = false;
      }
    },

    // 특정 회원 가져오기
    async fetchById(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        this.member = await memberService.getById(idx);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch member';
        console.error('Error fetching member:', error);
      } finally {
        this.loading = false;
      }
    },

    // 회원 생성
    async createMember(memberRequest: MemberRequest) {
      this.loading = true;
      this.error = null;
      try {
        const newMember = await memberService.create(memberRequest);
        this.members.push(newMember);
        return { success: true, data: newMember };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to create member';
        console.error('Error creating member:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 수정
    async updateMember(idx: number, memberRequest: MemberRequest) {
      this.loading = true;
      this.error = null;
      try {
        const updatedMember = await memberService.update(idx, memberRequest);
        const index = this.members.findIndex((m) => m.idx === idx);
        if (index !== -1) {
          this.members[index] = updatedMember;
        }
        return { success: true, data: updatedMember };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to update member';
        console.error('Error updating member:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 삭제
    async deleteMember(idx: number) {
      this.loading = true;
      this.error = null;
      try {
        await memberService.delete(idx);
        this.members = this.members.filter((m) => m.idx !== idx);
        return { success: true };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete member';
        console.error('Error deleting member:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // 회원 검색
    async searchMembers(keyword: string) {
      this.loading = true;
      this.error = null;
      try {
        this.members = await memberService.search(keyword);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to search members';
        console.error('Error searching members:', error);
      } finally {
        this.loading = false;
      }
    },

    // 새 회원 폼용 초기화
    initNewMember() {
      this.member = {
        idx: 0,
        userName: '',
        status: 1,
        gender: '',
        birth: null,
        age: null,
        phone: '',
        getUtilization: null,
        getRenting: null,
        locker: null,
        sort: 0,
        regDt: null,
        endDt: null,
        dayNum: null,
        regentRegDt: null,
        regentAtDt: null,
        AtNum: null,
        etcComment: null,
        purpose: null,
        visitPath: null,
        consultant: null,
        address: null,
        lockerName: null,
        getRentingName: null,
        getUtilizationName: null,
        purposeName: null,
        visitPathName: null,
        consultantName: null,
      };
    },
  },
});