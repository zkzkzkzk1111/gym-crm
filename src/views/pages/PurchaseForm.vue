<script setup lang="ts">
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { usePurchaseStore } from '@/stores/purchase';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { PurchaseRequest } from '@/models/Purchase';

const route = useRoute();
const router = useRouter();
const title = ref('구매 내역 등록');
const valid = ref(false);
const loading = ref(false);
const form = ref();
const purchaseStore = usePurchaseStore();

const purchaseData = ref<PurchaseRequest>({
  type: '',
  name: '',
  buyer: '',
  cnt: 0,
  price: 0,
  paymentMethod: '',
  paidAt: '',
  status: 0,
  phone: '',
});

const isEditMode = ref(false);
const purchaseId = ref<number | null>(null);

if (route.params['idx']) {
  title.value = '구매 내역 수정';
  isEditMode.value = true;
  purchaseId.value = parseInt(route.params['idx'] as string);
  purchaseStore.fetchById(purchaseId.value);
}

const { purchase } = storeToRefs(purchaseStore);

onMounted(() => {
  if (isEditMode.value && purchase.value) {
    purchaseData.value = {
      type: purchase.value.type,
      name: purchase.value.name,
      buyer: purchase.value.buyer,
      cnt: purchase.value.cnt,
      price: purchase.value.price,
      paymentMethod: purchase.value.paymentMethod,
      paidAt: purchase.value.paidAt,
      status: purchase.value.status,
      phone: purchase.value.phone,
    };
  }
});

const requiredRule = (value: any) => value ? true : '필수 입력 항목입니다.';
const nameRules = [
  requiredRule,
  (value: any) => (value?.length <= 50) ? true : '이름은 50자 이하여야 합니다.'
];
const phoneRules = [
  requiredRule,
  (value: any) => /^[0-9-]+$/.test(value) ? true : '올바른 전화번호 형식이 아닙니다.'
];
const numberRules = [
  requiredRule,
  (value: any) => value > 0 ? true : '0보다 큰 값을 입력해주세요.'
];

function onCancel() {
  router.replace({ path: '/purchase' });
}

async function submit(event: any) {
  event.preventDefault();

  const { valid: isValid } = await form.value.validate();

  if (isValid) {
    loading.value = true;

    try {
      let result;
      if (isEditMode.value && purchaseId.value) {
        result = await purchaseStore.updatePurchase(purchaseId.value, purchaseData.value);
      } else {
        result = await purchaseStore.createPurchase(purchaseData.value);
      }

      if (result.success) {
        router.replace({ path: '/purchase' });
      } else {
        alert(`저장에 실패했습니다: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error: any) {
      console.error('구매 내역 저장 실패:', error);
      alert(`저장에 실패했습니다: ${error.message || '알 수 없는 오류'}`);
    } finally {
      loading.value = false;
    }
  }
}
</script>

<template>
  <UiMainContainer>
    <UiParentCard :title="title">
      <div v-if="!purchaseStore.loading">
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="purchaseData.type"
                  :rules="nameRules"
                  label="타입"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="purchaseData.name"
                  :rules="nameRules"
                  label="상품명"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="purchaseData.buyer"
                  :rules="nameRules"
                  label="구매자"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="purchaseData.phone"
                  :rules="phoneRules"
                  label="연락처"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="purchaseData.cnt"
                  :rules="numberRules"
                  label="갯수"
                  type="number"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="purchaseData.price"
                  :rules="numberRules"
                  label="가격"
                  type="number"
                  variant="solo-filled"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="purchaseData.paymentMethod"
                  :items="['현금', '카드', '계좌이체']"
                  :rules="[requiredRule]"
                  label="결제수단"
                  variant="solo-filled"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="purchaseData.paidAt"
                  :rules="[requiredRule]"
                  label="결제일 (YYYY-MM-DD)"
                  variant="solo-filled"
                  placeholder="2024-01-01"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model.number="purchaseData.status"
                  :items="[
                    { title: '대기', value: 0 },
                    { title: '완료', value: 1 },
                    { title: '취소', value: -1 }
                  ]"
                  :rules="[requiredRule]"
                  label="상태"
                  variant="solo-filled"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-5" />

          <v-row justify="end">
            <v-col cols="12" lg="2" md="6" sm="12" justify="end">
              <v-spacer></v-spacer>
              <div class="d-flex ga-6 mt-8 justify-end">
                <v-btn
                  :loading="loading"
                  color="secondary"
                  variant="flat"
                  type="submit"
                >
                  {{ isEditMode ? '수정' : '등록' }}
                </v-btn>

                <v-btn @click="onCancel" color="primary" variant="outlined">
                  취소
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </UiParentCard>
  </UiMainContainer>
</template>
