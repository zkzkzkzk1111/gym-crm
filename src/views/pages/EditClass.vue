<script setup lang="ts">
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useClassStore } from '@/stores/class';
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
const classStore = useClassStore()
const staffStore = useStaffStore()

onMounted(() => {
  classStore.fetchClassType();
  staffStore.fetchAll();
});

if (route.params['id']) {
    title.value = '수업 수정'
    classStore.fetchById(Number(route.params['id']))
}
else {
    title.value = '수업등록'
    classStore.initNewClass()
}

const { class: cls, allClassTypes } = storeToRefs(classStore)
const { staffList } = storeToRefs(staffStore)

const requiredRule =  (value: unknown) =>  value? true:'필수사항입니다.'
const nameRules = [requiredRule]



function onCancel() {
    router.replace({ path: `/class` });
}

async function submit(event:SubmitEvent) {
    event.preventDefault();

    const { valid: isValid } = await form.value.validate()

    if (isValid && cls.value) {
        loading.value = true
        let result;

        if (route.params['id']) {
            // ClassRequest 형태로 변환하여 수정
            const classRequest = {
                className: cls.value.className,
                cash: cls.value.cash ? Number(cls.value.cash) : null,
                card: cls.value.card ? Number(cls.value.card) : null,
                description: cls.value.description,
                duration: Number(cls.value.duration),
                type: cls.value.type,
                useCount: Number(cls.value.useCount),
                instructor: cls.value.instructor
            }
            result = await classStore.updateClass(cls.value.idx, classRequest)
        } else {
            // ClassRequest 형태로 변환하여 생성
            const classRequest = {
                className: cls.value.className,
                cash: cls.value.cash ? Number(cls.value.cash) : null,
                card: cls.value.card ? Number(cls.value.card) : null,
                description: cls.value.description,
                duration: Number(cls.value.duration),
                type: cls.value.type,
                useCount: Number(cls.value.useCount),
                instructor: cls.value.instructor
            }
            result = await classStore.createClass(classRequest)
        }

        if (result.success) {
            router.replace({ path: '/class' })
        }
        loading.value = false
    }
}



</script>

<template>

    <UiMainContainer>

        <UiParentCard :title="title">

            <div v-if="!classStore.loading && cls">
                <v-form ref="form" v-model="valid" @submit.prevent>
                    <v-container>


                        <v-row>
                          <v-col cols="12" md="4">
                            <v-select
                              v-model="cls.type"
                              :rules="[requiredRule]"
                              label="종류"
                              :items="allClassTypes"
                              item-title="typeName"
                              item-value="idx"
                              variant="solo-filled"
                              required
                            ></v-select>
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-select
                              v-model="cls.instructor"
                              :rules="[requiredRule]"
                              label="강사"
                              :items="staffList"
                              item-title="name"
                              item-value="idx"
                              variant="solo-filled"
                              required
                            ></v-select>
                          </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field v-model="cls.className" :rules="nameRules" label="수업명"
                                    variant="solo-filled" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="cls.cash" :rules="[requiredRule]" variant="solo-filled"
                                  label="현금가" required></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                              <v-text-field type="number" v-model="cls.card" :rules="[requiredRule]" variant="solo-filled"
                                            label="카드가" required></v-text-field>
                            </v-col>


                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="cls.duration" :rules="[requiredRule]" label="이용기간(일)"
                                    variant="solo-filled" required></v-text-field>
                            </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field type="number" v-model="cls.useCount"  label="이용횟수"
                                          variant="solo-filled" required></v-text-field>
                          </v-col>
                          <v-col cols="12" md="8">
                            <v-text-field
                              v-model="cls.description"
                              label="상세설명"
                              variant="solo-filled"
                            ></v-text-field>
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

    </UiMainContainer>

</template>