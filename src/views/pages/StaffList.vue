<script setup lang="ts">
import { useStaffStore } from "@/stores/staff";
import { useCategoryStore } from "@/stores/category";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import UiMainContainer from "@/components/shared/UiMainContainer.vue";
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import NotificationBar from "@/components/shared/NotificeBar.vue";
import CategoryManageDialog from "@/components/shared/CategoryManageDialog.vue";
import CategoryInputDialog from "@/components/shared/CategoryInputDialog.vue";
import { router } from "@/router";

const headers = [
  { title: "", key: "avatar", align: "start" },
  { title: "등급", key: "gradeName", align: "start" },
  { title: "이름", key: "name", align: "start" },
  { title: "연락처", key: "phone", align: "start" },
  { title: "성별", key: "gender", align: "start" },
  { title: "", key: "idx", align: "end" },
];

const staffStore = useStaffStore();
const categoryStore = useCategoryStore();
const { filteredStaff, loading } = storeToRefs(staffStore);
const { staffGrades } = storeToRefs(categoryStore);
const dialog = ref(false);
const search = ref('');
const notice = ref(false);
const selectedId = ref<number | null>(null);
const AVATAR_PLACEHOLDER = "/src/assets/images/customer/avatar-0.webp";

// 카테고리 관리 다이얼로그
const categoryDialog = ref(false);
const categoryInputDialog = ref(false);
const categoryInputMode = ref<'add' | 'edit'>('add');
const selectedCategory = ref<any>(null);

onMounted(() => {
  staffStore.fetchAll();
  categoryStore.fetchAll();
});

function editStaff(idx: number) {
  router.replace({ path: `/staff/${idx}` });
}

function deleteStaff(idx: number) {
  dialog.value = true;
  selectedId.value = idx;
}

function onConfirm() {
  if (selectedId.value !== null) {
    staffStore.deleteStaff(selectedId.value)
      .then((res) => {
        dialog.value = false;
        if (res.success) {
          notice.value = true;
          setTimeout(() => {
            notice.value = false;
            staffStore.fetchAll();
          }, 1000);
        }
      })
      .finally(() => selectedId.value = null);
  }
}

function onCancel() {
  dialog.value = false;
}

function onClose() {
  notice.value = false;
}

function onCreate() {
  router.replace({ path: '/staff/write' });
}

// 카테고리 관리 함수들
async function openStaffGradeDialog() {
  await categoryStore.fetchStaffGrades();
  categoryDialog.value = true;
}

const currentCategories = computed(() => {
  return staffGrades.value.map(g => ({ id: g.idx, name: g.name }));
});

function handleAddCategory() {
  categoryInputMode.value = 'add';
  selectedCategory.value = null;
  categoryInputDialog.value = true;
}

function handleEditCategory(category: any) {
  categoryInputMode.value = 'edit';
  selectedCategory.value = category;
  categoryInputDialog.value = true;
}

async function handleDeleteCategory(category: any) {
  if (!confirm(`${category.name}을(를) 삭제하시겠습니까?`)) {
    return;
  }

  try {
    const result = await categoryStore.deleteStaffGrade(category.id);
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

async function handleCategoryInputConfirm(name: string) {
  try {
    let result;

    if (categoryInputMode.value === 'add') {
      result = await categoryStore.createStaffGrade(name);
    } else {
      if (!selectedCategory.value) return;
      result = await categoryStore.updateStaffGrade(selectedCategory.value.id, name);
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
    <UiParentCard title="직원 관리" :createFn="onCreate">
      <template v-slot:extra-actions>
        <v-btn @click="openStaffGradeDialog" color="primary" variant="outlined">
          <template v-slot:prepend>
            <v-icon icon="$new" size="x-large"></v-icon>
          </template>
          직원 등급 관리
        </v-btn>
      </template>

      <div v-if="loading">
        <v-progress-linear color="secondary" height="6" indeterminate rounded></v-progress-linear>
      </div>
      <div v-if="!loading">
        <v-data-table :headers="headers" :items="filteredStaff" :search="search">
          <template v-slot:top>
            <v-text-field v-model="search" variant="solo-filled" class="pa-2" label="검색"></v-text-field>
          </template>
          <template v-slot:[`item.avatar`]>
            <v-avatar size="36px">
              <v-img alt="Avatar" :src="AVATAR_PLACEHOLDER"></v-img>
            </v-avatar>
          </template>
          <template v-slot:[`item.idx`]="{ value }">
            <div class="d-flex ga-6 p-r-5 justify-end">
              <v-icon color="secondary" icon="$edit" size="x-large" @click="editStaff(value)"></v-icon>
              <v-icon color="disabled" icon="$delete" size="x-large" @click="deleteStaff(value)"></v-icon>
            </div>
          </template>
        </v-data-table>
      </div>
    </UiParentCard>

    <ConfirmDialog :dialog="dialog" @onConfirm="onConfirm" @onCancel="onCancel" />
    <NotificationBar :notice="notice" @onClose="onClose" />

    <!-- 카테고리 관리 다이얼로그 -->
    <CategoryManageDialog
      v-model="categoryDialog"
      title="직원 등급 관리"
      :categories="currentCategories"
      @add="handleAddCategory"
      @edit="handleEditCategory"
      @delete="handleDeleteCategory"
    />

    <!-- 카테고리 입력 다이얼로그 -->
    <CategoryInputDialog
      v-model="categoryInputDialog"
      :title="categoryInputMode === 'add' ? '직원 등급 추가' : '직원 등급 수정'"
      label="등급 이름"
      :initial-value="selectedCategory?.name || ''"
      @confirm="handleCategoryInputConfirm"
    />
  </UiMainContainer>
</template>