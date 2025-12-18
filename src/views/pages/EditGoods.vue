<script setup lang="ts">
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
import { useGoodsStore } from '@/stores/goods';
import { useStaffStore } from '@/stores/staff';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const title = ref('')
const valid = ref(false)
const loading = ref(false)
const form = ref()
const goodsStore = useGoodsStore()
const staffStore = useStaffStore()
const showSuccessDialog = ref(false)
const successMessage = ref('')

const { goods, allGoodsTypes } = storeToRefs(goodsStore)
const { staffList } = storeToRefs(staffStore)

onMounted(async () => {
  // 먼저 기본 데이터 로드
  await Promise.all([
    goodsStore.fetchGoodsType(),
    staffStore.fetchAll()
  ]);

  // 수정 모드인 경우 상품 데이터 로드
  if (route.params['id']) {
    title.value = '상품 수정'
    await goodsStore.fetchById(Number(route.params['id']))
  } else {
    title.value = '상품등록'
    goodsStore.initNewGoods()
  }
});

const requiredRule =  (value: unknown) =>  value? true:'필수사항입니다.'
const nameRules = [requiredRule]



function onCancel() {
    router.replace({ path: `/goods` });
}

function handleSuccessConfirm() {
    router.replace({ path: '/goods' });
}

async function submit(event:SubmitEvent) {
    event.preventDefault();

    const { valid: isValid } = await form.value.validate()

    if (isValid && goods.value) {
        loading.value = true
        let result;

        // GoodsRequest 형태로 변환
        const goodsRequest: any = {
            goodsName: goods.value.goodsName,
            duration: Number(goods.value.duration),
            type: goods.value.type,
            useCount: Number(goods.value.useCount),
            instructor: goods.value.instructor || null
        }

        // null이 아닌 값만 추가
        if (goods.value.cash) goodsRequest.cash = Number(goods.value.cash);
        if (goods.value.card) goodsRequest.card = Number(goods.value.card);
        if (goods.value.description) goodsRequest.description = goods.value.description;

        try {
            if (route.params['id']) {
                result = await goodsStore.updateGoods(goods.value.idx, goodsRequest)
                successMessage.value = '상품이 성공적으로 수정되었습니다.'
            } else {
                result = await goodsStore.createGoods(goodsRequest)
                successMessage.value = '상품이 성공적으로 등록되었습니다.'
            }

            if (result.success) {
                showSuccessDialog.value = true
            } else {
                alert(`작업 실패: ${result.error || '알 수 없는 오류'}`)
            }
        } catch (error: any) {
            console.error('상품 저장 실패:', error)
            alert(`작업 실패: ${error.message || '알 수 없는 오류'}`)
        } finally {
            loading.value = false
        }
    }
}



</script>

<template>

    <UiMainContainer>

        <UiParentCard :title="title">

            <div v-if="!goodsStore.loading && goods">
                <v-form ref="form" v-model="valid" @submit.prevent>
                    <v-container>


                        <v-row>
                          <v-col cols="12" md="4">
                            <v-select
                              v-model="goods.type"
                              :rules="[requiredRule]"
                              label="종류"
                              :items="allGoodsTypes"
                              item-title="typeName"
                              item-value="idx"
                              variant="solo-filled"
                              required
                            ></v-select>
                          </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="goods.goodsName" :rules="nameRules" label="상품명"
                                    variant="solo-filled" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="goods.cash" :rules="[requiredRule]" variant="solo-filled"
                                  label="현금가" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-text-field type="number" v-model="goods.card" :rules="[requiredRule]" variant="solo-filled"
                                            label="카드가" required></v-text-field>
                            </v-col>


                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="goods.duration" :rules="[requiredRule]" label="이용기간(일)"
                                    variant="solo-filled" required></v-text-field>
                            </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field type="number" v-model="goods.useCount"  label="이용횟수"
                                          variant="solo-filled" required></v-text-field>
                          </v-col>
                          <v-col cols="12" md="8">
                            <v-text-field
                              v-model="goods.description"
                              label="상세설명"
                              variant="solo-filled"
                            ></v-text-field>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-select
                              v-model="goods.instructor"
                              :items="staffList"
                              item-title="name"
                              item-value="idx"
                              label="담당강사"
                              variant="solo-filled"
                              clearable
                            ></v-select>
                          </v-col>

                        </v-row>
                    </v-container>
                    <v-divider></v-divider>
                    <v-row justify="end">
                        <v-col cols="12" lg="2" md="6" sm="12" justify="end" class="">
                            <v-spacer></v-spacer>
                            <div class="d-flex ga-6 mt-8 justify-end">
                                <v-btn      :loading="loading" color="secondary" variant="flat" type="submit" @click="submit">
                                    등록
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

        <!-- 성공 다이얼로그 -->
        <ConfirmDialog
            v-model="showSuccessDialog"
            title="완료"
            :message="successMessage"
            icon="mdi-check-circle"
            confirm-text="확인"
            cancel-text="닫기"
            confirm-color="primary"
            @confirm="handleSuccessConfirm"
            @cancel="handleSuccessConfirm"
        />

    </UiMainContainer>

</template>