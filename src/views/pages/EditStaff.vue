<script setup lang="ts">
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useStaffStore } from '@/stores/staff';
import { staffService } from '@/services/staffService';
import type { Staff, StaffGrade } from '@/models/Staff';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const title = ref('');
const valid = ref(false);
const loading = ref(false);
const form = ref();
const staffStore = useStaffStore();
const gradeList = ref<StaffGrade[]>([]);

if (route.params['id']) {
    title.value = '직원 수정';
    staffStore.fetchById(Number(route.params['id']));
} else {
    title.value = '직원 등록';
    staffStore.initNewStaff();
}

const { staff } = storeToRefs(staffStore);

// API에서 등급 리스트 가져오기
onMounted(async () => {
    try {
        gradeList.value = await staffService.getGradeList();
    } catch (error) {
        console.error('Failed to fetch grade list:', error);
        gradeList.value = [];
    }
});

const requiredRule = (value: string | number | null | undefined) => value ? true : 'This field is required.';
const nameRules = [
    requiredRule,
    (value: string) =>
        (value?.length <= 20) ? true :
        'Name must be less than 20 characters.'
];

const phoneRules = [
    requiredRule,
    (value: string | number | null) => {
        if (!value) return 'Phone is required.';
        const phoneStr = value.toString();
        if (/^[0-9]+$/.test(phoneStr)) return true;
        return 'Phone must contain only numbers.';
    }
];

function onCancel() {
    router.replace({ path: `/staffs` });
}

async function submit(event: Event) {
    event.preventDefault();

    const { valid } = await form.value.validate();

    if (valid && staff.value) {
        loading.value = true;
        let results: { success: boolean; error?: string; data?: Staff };

        if (staff.value.idx) {
            results = await staffStore.updateStaff(staff.value.idx, staff.value);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { idx, ...staffData } = staff.value;
            results = await staffStore.createStaff(staffData);
        }

        if (results.success) {
            router.replace({ path: '/staffs' });
        }
        loading.value = false;
    }
}
</script>

<template>
    <UiMainContainer>
        <UiParentCard :title="title">
            <div v-if="!staffStore.loading && staff">
                <v-form ref="form" v-model="valid" @submit.prevent>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="staff.name"
                                    :rules="nameRules"
                                    label="이름"
                                    variant="solo-filled"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="staff.gender"
                                    :rules="[requiredRule]"
                                    label="성별"
                                    :items="['남', '여']"
                                    variant="solo-filled"
                                    required
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="staff.phone"
                                    :rules="phoneRules"
                                    label="연락처"
                                    variant="solo-filled"
                                    required
                                    placeholder="01012345678"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="staff.grade"
                                    :items="gradeList"
                                    item-title="name"
                                    item-value="idx"
                                    label="등급"
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
                                <v-btn
                                    :loading="loading"
                                    color="secondary"
                                    variant="flat"
                                    type="submit"
                                    @click="submit"
                                >
                                    수정
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