<script setup lang="ts">
import { useGoodsStore } from "@/stores/goods";
import { useCategoryStore } from "@/stores/category";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import UiMainContainer from "@/components/shared/UiMainContainer.vue";

import { storeToRefs } from "pinia";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import NotificationBar from "@/components/shared/NotificeBar.vue";
import CategoryManageDialog from "@/components/shared/CategoryManageDialog.vue";
import CategoryInputDialog from "@/components/shared/CategoryInputDialog.vue";
import { router } from "@/router";

import { ref, onMounted, computed } from "vue";


const goodsStore = useGoodsStore();
const categoryStore = useCategoryStore();
const { filteredGoods, filter, loading } = storeToRefs(goodsStore)
const { goodsTypes } = storeToRefs(categoryStore);
const dialog = ref(false)

const notice = ref(false)
const selectedId = ref<number | null>(null)

// 카테고리 관리 다이얼로그
const categoryDialog = ref(false);
const categoryInputDialog = ref(false);
const categoryInputMode = ref<'add' | 'edit'>('add');
const selectedCategory = ref<any>(null);

onMounted(() => {
  goodsStore.fetchAll();
  categoryStore.fetchAll();
});

function editGoods(idx: number) {
  router.replace({ path: `/editGoods/${idx}` });
}

function deleteGoods(idx: number) {
  dialog.value = true
  selectedId.value = idx
}

function onConfirm() {
  if (selectedId.value !== null) {
    goodsStore.deleteGoods(selectedId.value)
      .then((res) => {
        dialog.value = false
        if (res.success) {
          notice.value = true
          setTimeout(() => {
            notice.value = false;
            goodsStore.fetchAll()
          }, 1000)
        }
      })
      .finally(() => selectedId.value = null);
  }
}

function onCancel() {
  dialog.value = false
}

function onClose() {
  notice.value = false
}

function onCreate() {
  router.replace({ path: '/goods/new' })
}

function getTypeName(typeIdx: number): string {
  const goodsType = goodsTypes.value.find(t => t.idx === typeIdx);
  return goodsType ? goodsType.typeName : '미분류';
}

// 카테고리 관리 함수들
async function openGoodsTypeDialog() {
  await categoryStore.fetchGoodsTypes();
  categoryDialog.value = true;
}

const currentCategories = computed(() => {
  return goodsTypes.value.map(g => ({ id: g.idx, name: g.typeName }));
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
    const result = await categoryStore.deleteGoodsType(category.id);
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
      result = await categoryStore.createGoodsType(name);
    } else {
      if (!selectedCategory.value) return;
      result = await categoryStore.updateGoodsType(selectedCategory.value.id, name);
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
    <UiParentCard title="상품 관리" :createFn="onCreate">
      <template v-slot:extra-actions>
        <v-btn @click="openGoodsTypeDialog" color="primary" variant="outlined">
          <template v-slot:prepend>
            <v-icon icon="$new" size="x-large"></v-icon>
          </template>
          상품 타입 관리
        </v-btn>
      </template>

      <div v-if="loading">
        <v-progress-linear color="secondary" height="6" indeterminate rounded></v-progress-linear>
      </div>
      <div v-if="!loading">

        <v-text-field v-model="filter" variant="solo-filled" class="pa-2" label="검색"></v-text-field>

        <v-divider class="mb-10" />
        <v-row>
          <v-col cols="12" md="4" sm="6" v-for="(goods, index) in filteredGoods" :key="goods?.idx || index">
            <v-card v-if="goods" variant="elevated" class="mx-auto ma-5" max-width="360">

              <v-card-title class="text-h3"> {{ goods.goodsName }}
              </v-card-title>

              <v-card-text>
                <div class="text-h6 mb-2">이용기간: {{ goods.duration }}개월</div>
                <div class="text-h6 mb-2">이용가능 횟수: {{ goods.useCount }}회</div>
                <div class="text-h6 mb-2">현금가: {{ goods.cash?.toLocaleString() }}원</div>
                <div class="text-h6 mb-2">카드가: {{ goods.card?.toLocaleString() }}원</div>
                <div class="text-body-2 mt-3" v-if="goods.description">
                  {{ goods.description }}
                </div>
              </v-card-text>

              <v-card-actions class="d-flex justify-space-between">
                <div>
                  <v-chip color="primary">타입: {{ getTypeName(goods.type) }}</v-chip>

                </div>
                <div>
                  <v-btn color="secondary mb-0" variant="outlined" text="수정" title="Edit" size="small"
                    @click="editGoods(goods.idx)"></v-btn>
                  <v-btn color="error" variant="plain" text="삭제" size="small"
                    @click="deleteGoods(goods.idx)"></v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" lg="12" class="d-flex justify-center">
            <v-chip class="text-h5" color="primary"> 총 상품 수: {{ filteredGoods.length }}</v-chip>
          </v-col>
        </v-row>
      </div>
    </UiParentCard>

    <ConfirmDialog :dialog="dialog" @onConfirm="onConfirm" @onCancel="onCancel" />
    <NotificationBar :notice="notice" @onClose="onClose" />

    <!-- 카테고리 관리 다이얼로그 -->
    <CategoryManageDialog
      v-model="categoryDialog"
      title="상품 타입 관리"
      :categories="currentCategories"
      @add="handleAddCategory"
      @edit="handleEditCategory"
      @delete="handleDeleteCategory"
    />

    <!-- 카테고리 입력 다이얼로그 -->
    <CategoryInputDialog
      v-model="categoryInputDialog"
      :title="categoryInputMode === 'add' ? '상품 타입 추가' : '상품 타입 수정'"
      label="타입 이름"
      :initial-value="selectedCategory?.name || ''"
      @confirm="handleCategoryInputConfirm"
    />
  </UiMainContainer>
</template>
<style lang="scss">
.product-img {
  border-top-left-radius: 5%;
  border-top-right-radius: 5%;

}

.price {
  color: rgb(226, 163, 45)
}

.chips {
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: end;
  justify-content: flex-end;
  margin-left: 1rem;
}

.chip {
  margin-left: calc(-0.75* var(8px));
  width: 20px;
  height: 20px;
  /* background-color: rgb(255, 192, 203); */
  border-radius: 50%;
  border: 2px solid rgb(255, 255, 255);
  box-shadow: rgba(0, 0, 0, 0.24) -1px 1px 2px inset
}
</style>
