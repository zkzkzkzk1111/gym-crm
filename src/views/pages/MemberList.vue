<script setup lang="ts">
import { useMembersStore } from "@/stores/members";
import { useGoodsStore } from "@/stores/goods";
import { useCategoryStore } from "@/stores/category";
import { usePurchaseStore } from "@/stores/purchase";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import UiMainContainer from "@/components/shared/UiMainContainer.vue";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import NotificationBar from "@/components/shared/NotificeBar.vue";
import MemberDetailSidebar from "@/components/member/MemberDetailSidebar.vue";
import PurchaseDialog from "@/components/member/PurchaseDialog.vue";
import CategoryManageDialog from "@/components/shared/CategoryManageDialog.vue";
import CategoryInputDialog from "@/components/shared/CategoryInputDialog.vue";
import { router } from "@/router";
import { memberService } from "@/services/memberService";
import type { PurchaseRequest } from "@/models/Purchase";

const headers = [
  { title: "", key: "avatar", align: "start" },
  { title: "상태", key: "status", align: "start" },
  { title: "이름", key: "userName", align: "start" },
  { title: "연락처", key: "phone", align: "start" },
  { title: "성별", key: "gender", align: "start" },
  { title: "생년월일", key: "birth", align: "start" },
  { title: "나이", key: "age", align: "end" },
  { title: "보유 이용권", key: "getUtilization", align: "end" },
  { title: "등록일", key: "regDt", align: "end" },
  { title: "종료일", key: "endDt", align: "end" },
  { title: "남은일수", key: "dayNum", align: "end" },
  { title: "상담자", key: "consultantName", align: "start" },
  { title: "", key: "idx", align: "end" },
];

const memberStore = useMembersStore();
const goodsStore = useGoodsStore();
const categoryStore = useCategoryStore();
const purchaseStore = usePurchaseStore();
const { filteredMembers, loading } = storeToRefs(memberStore);
const { goodsList } = storeToRefs(goodsStore);
const { visitPaths, purposes, memberStatuses } = storeToRefs(categoryStore);
const showConfirmDialog = ref(false);
const search = ref('');
const notice = ref(false);
const selectedId = ref<number | null>(null);
const AVATAR_PLACEHOLDER = "/src/assets/images/customer/avatar-0.webp";
const drawer = ref(false);
const selectedMember = ref<any>(null);
const purchaseDialog = ref(false);

// 카테고리 관리 다이얼로그
const categoryDialog = ref(false);
const currentCategoryType = ref<'visitPath' | 'purpose' | 'memberStatus'>('visitPath');

// 카테고리 입력 다이얼로그
const categoryInputDialog = ref(false);
const categoryInputMode = ref<'add' | 'edit'>('add');
const selectedCategory = ref<any>(null);

onMounted(() => {
  memberStore.fetchAll();
  goodsStore.fetchAll();
  categoryStore.fetchAll();
});

function editMember(idx: number) {
  router.replace({ path: `/member/${idx}` });
}

function deleteMember(idx: number) {
  showConfirmDialog.value = true;
  selectedId.value = idx;
}

async function confirmDelete() {
  if (selectedId.value !== null) {
    try {
      // API 호출하여 삭제
      await memberService.delete(selectedId.value);

      // 성공 알림 표시
      notice.value = true;

      // 회원 목록 새로고침
      setTimeout(() => {
        notice.value = false;
        memberStore.fetchAll();
      }, 1000);
    } catch (error: any) {
      console.error('회원 삭제 실패:', error);
      alert(`회원 삭제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      selectedId.value = null;
    }
  }
}

function onClose() {
  notice.value = false;
}

function onCreate() {
  router.replace({ path: '/member/write' });
}

function getGoodsName(utilizationIdx: number | null): string {
  if (!utilizationIdx) return '-';
  const goods = goodsList.value.find(g => g.idx === utilizationIdx);
  return goods ? goods.goodsName : '-';
}

function onRowClick(event: any, row: any) {
  selectedMember.value = row.item;
  drawer.value = true;
}

function closeDrawer() {
  drawer.value = false;
  selectedMember.value = null;
}

function openPurchaseDialog() {
  purchaseDialog.value = true;
}

function closePurchaseDialog() {
  purchaseDialog.value = false;
}

async function handlePurchase(cart: any[]) {
  if (!selectedMember.value) {
    alert('회원 정보를 찾을 수 없습니다.');
    return;
  }

  const totalPrice = cart.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);

  if (!confirm(`총 ${totalPrice.toLocaleString()}원을 결제하시겠습니까?`)) {
    return;
  }

  try {
    // 모든 cart 아이템을 PurchaseRequest 배열로 변환
    const purchaseRequestList: PurchaseRequest[] = cart.map((item) => ({
      memberIdx: selectedMember.value.idx,
      type: item.typeName || '상품', // goods의 typeName이 있으면 사용
      name: item.goodsName,
      cnt: item.quantity,
      price: item.selectedPrice,
      paymentMethod: item.paymentType === 'cash' ? '현금' : '카드',
    }));

    // 리스트로 한 번에 전송
    const result = await purchaseStore.createPurchaseBulk(purchaseRequestList);

    if (result.success) {
      notice.value = true;
      setTimeout(() => {
        notice.value = false;
      }, 1000);
      alert(`총 ${totalPrice.toLocaleString()}원 결제가 완료되었습니다.`);
      closePurchaseDialog();
      // 회원 목록 새로고침 (필요시)
      memberStore.fetchAll();
    } else {
      alert(`결제가 실패했습니다: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('결제 처리 실패:', error);
    alert(`결제 처리에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}

// 카테고리 관리 함수들
function openVisitPathDialog() {
  currentCategoryType.value = 'visitPath';
  categoryDialog.value = true;
}

function openPurposeDialog() {
  currentCategoryType.value = 'purpose';
  categoryDialog.value = true;
}

function openMemberStatusDialog() {
  currentCategoryType.value = 'memberStatus';
  categoryDialog.value = true;
}

// 현재 선택된 카테고리 타입에 맞는 데이터 반환
const currentCategories = computed(() => {
  if (currentCategoryType.value === 'visitPath') {
    return visitPaths.value.map(v => ({ id: v.idx, name: v.visitPathName }));
  } else if (currentCategoryType.value === 'purpose') {
    return purposes.value.map(p => ({ id: p.idx, name: p.purposeName }));
  } else {
    return memberStatuses.value.map(m => ({ id: m.idx, name: m.statusName }));
  }
});

// 현재 선택된 카테고리 타입에 맞는 제목 반환
const categoryDialogTitle = computed(() => {
  if (currentCategoryType.value === 'visitPath') return '방문경로 관리';
  if (currentCategoryType.value === 'purpose') return '운동목적 관리';
  return '회원상태 관리';
});

// 입력 다이얼로그 제목
const categoryInputTitle = computed(() => {
  let typeLabel = '방문경로';
  if (currentCategoryType.value === 'purpose') typeLabel = '운동목적';
  if (currentCategoryType.value === 'memberStatus') typeLabel = '회원상태';

  const actionLabel = categoryInputMode.value === 'add' ? '추가' : '수정';
  return `${typeLabel} ${actionLabel}`;
});

// 입력 다이얼로그 라벨
const categoryInputLabel = computed(() => {
  if (currentCategoryType.value === 'visitPath') return '방문경로 이름';
  if (currentCategoryType.value === 'purpose') return '운동목적 이름';
  return '회원상태 이름';
});

// 카테고리 추가
function handleAddCategory() {
  categoryInputMode.value = 'add';
  selectedCategory.value = null;
  categoryInputDialog.value = true;
}

// 카테고리 수정
function handleEditCategory(category: any) {
  categoryInputMode.value = 'edit';
  selectedCategory.value = category;
  categoryInputDialog.value = true;
}

// 카테고리 삭제
async function handleDeleteCategory(category: any) {
  if (!confirm(`${category.name}을(를) 삭제하시겠습니까?`)) {
    return;
  }

  try {
    let result;
    if (currentCategoryType.value === 'visitPath') {
      result = await categoryStore.deleteVisitPath(category.id);
    } else if (currentCategoryType.value === 'purpose') {
      result = await categoryStore.deletePurpose(category.id);
    } else {
      result = await categoryStore.deleteMemberStatus(category.id);
    }

    if (result.success) {
      notice.value = true;
      setTimeout(() => {
        notice.value = false;
      }, 1000);
    } else {
      alert(`삭제에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('카테고리 삭제 실패:', error);
    alert(`삭제에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}

// 카테고리 입력 확인
async function handleCategoryInputConfirm(name: string) {
  try {
    let result;

    if (categoryInputMode.value === 'add') {
      // 추가
      if (currentCategoryType.value === 'visitPath') {
        result = await categoryStore.createVisitPath(name);
      } else if (currentCategoryType.value === 'purpose') {
        result = await categoryStore.createPurpose(name);
      } else {
        result = await categoryStore.createMemberStatus(name);
      }
    } else {
      // 수정
      if (!selectedCategory.value) return;

      if (currentCategoryType.value === 'visitPath') {
        result = await categoryStore.updateVisitPath(selectedCategory.value.id, name);
      } else if (currentCategoryType.value === 'purpose') {
        result = await categoryStore.updatePurpose(selectedCategory.value.id, name);
      } else {
        result = await categoryStore.updateMemberStatus(selectedCategory.value.id, name);
      }
    }

    if (result.success) {
      notice.value = true;
      setTimeout(() => {
        notice.value = false;
      }, 1000);
    } else {
      alert(`${categoryInputMode.value === 'add' ? '추가' : '수정'}에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
    }
  } catch (error: any) {
    console.error('카테고리 처리 실패:', error);
    alert(`${categoryInputMode.value === 'add' ? '추가' : '수정'}에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
  }
}
</script>

<template>
  <UiMainContainer>
    <UiParentCard title="회원 관리" :createFn="onCreate">
      <template v-slot:extra-actions>
        <v-btn @click="openVisitPathDialog" color="primary" variant="outlined">
          <template v-slot:prepend>
            <v-icon icon="$new" size="x-large"></v-icon>
          </template>
          방문경로 관리
        </v-btn>
        <v-btn @click="openPurposeDialog" color="primary" variant="outlined">
          <template v-slot:prepend>
            <v-icon icon="$new" size="x-large"></v-icon>
          </template>
          운동목적 관리
        </v-btn>
      </template>

      <div v-if="loading">
        <v-progress-linear color="secondary" height="6" indeterminate rounded></v-progress-linear>
      </div>
      <div v-if="!loading">
        <v-data-table :headers="headers" :items="filteredMembers" :search="search" @click:row="onRowClick" hover>
          <template v-slot:top>
            <v-text-field v-model="search" variant="solo-filled" class="pa-2" label="검색"></v-text-field>
          </template>
          <template v-slot:[`item.avatar`]>
            <v-avatar size="36px">
              <v-img alt="Avatar" :src="AVATAR_PLACEHOLDER"></v-img>
            </v-avatar>
          </template>
          <template v-slot:[`item.getUtilization`]="{ value }">
            {{ getGoodsName(value) }}
          </template>
          <template v-slot:[`item.idx`]="{ value }">
            <div class="d-flex ga-6 p-r-5 justify-end" @click.stop>
              <v-icon color="secondary" icon="$edit" size="x-large" @click="editMember(value)"></v-icon>
              <v-icon color="disabled" icon="$delete" size="x-large" @click="deleteMember(value)"></v-icon>
            </div>
          </template>
        </v-data-table>
      </div>
    </UiParentCard>

    <!-- 삭제 확인 다이얼로그 -->
    <ConfirmDialog
      v-model="showConfirmDialog"
      title="회원 삭제"
      message="이 회원을 삭제하시겠습니까? 삭제된 회원 정보는 복구할 수 없습니다."
      icon="mdi-account-remove"
      confirm-text="삭제"
      cancel-text="취소"
      confirm-color="error"
      @confirm="confirmDelete"
    />

    <NotificationBar :notice="notice" @onClose="onClose" />

    <!-- 회원 정보 사이드바 -->
    <MemberDetailSidebar
      :drawer="drawer"
      :selectedMember="selectedMember"
      :getGoodsName="getGoodsName"
      @close="closeDrawer"
      @purchase="openPurchaseDialog"
    />

    <!-- 상품 구매 다이얼로그 -->
    <PurchaseDialog
      :dialog="purchaseDialog"
      :goodsList="goodsList"
      @close="closePurchaseDialog"
      @purchase="handlePurchase"
    />

    <!-- 카테고리 관리 다이얼로그 -->
    <CategoryManageDialog
      v-model="categoryDialog"
      :title="categoryDialogTitle"
      :categories="currentCategories"
      @add="handleAddCategory"
      @edit="handleEditCategory"
      @delete="handleDeleteCategory"
    />

    <!-- 카테고리 입력 다이얼로그 -->
    <CategoryInputDialog
      v-model="categoryInputDialog"
      :title="categoryInputTitle"
      :label="categoryInputLabel"
      :initial-value="selectedCategory?.name || ''"
      @confirm="handleCategoryInputConfirm"
    />
  </UiMainContainer>
</template>
