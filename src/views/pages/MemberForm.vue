<script setup lang="ts">
import UiMainContainer from '@/components/shared/UiMainContainer.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useMembersStore } from '@/stores/members';
import type { Member } from '@/models/Member';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axiosInstance from '@/utils/axios';

interface PurposeItem {
    idx: number;
    purposeName: string;
}

interface VisitPathItem {
  idx: number;
  visitPathName: string;
}

interface StaffItem {
  idx: number;
  name: string;
}

const route = useRoute();
const router = useRouter();
const title = ref('');
const valid = ref(false);
const loading = ref(false);
const form = ref();
const membersStore = useMembersStore();
const purposeList = ref<PurposeItem[]>([]);
const visitPathList = ref<VisitPathItem[]>([]);
const staffList = ref<StaffItem[]>([]);


if (route.params['id']) {
    title.value = 'Edit Member';
    membersStore.fetchById(Number(route.params['id']));
} else {
    title.value = '회원 등록';
    membersStore.initNewMember();
}

const { member } = storeToRefs(membersStore);

// API에서 목적 리스트 가져오기
onMounted(async () => {
    try {
        const response = await axiosInstance.get<{ status: number; message: string; data: PurposeItem[] }>('/api/common/getPurposeList');
        purposeList.value = response.data.data;
    } catch (error) {
        console.error('Failed to fetch purpose list:', error);
        purposeList.value = [];
    }
});

onMounted(async () => {
  try {
    const response = await axiosInstance.get<{ status: number; message: string; data: VisitPathItem[] }>('/api/common/getVisitPathList');
    visitPathList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch visitpath list:', error);
    visitPathList.value = [];
  }
});

// API에서 스태프 리스트 가져오기
onMounted(async () => {
  try {
    const response = await axiosInstance.get<{ status: number; message: string; data: StaffItem[] }>('/api/member/getStaffList');
    staffList.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch staff list:', error);
    staffList.value = [];
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
    (value: string) => {
        if (/^[0-9-]+$/.test(value)) return true;
        return 'Phone must contain only numbers and hyphens.';
    }
];

function onCancel() {
    router.replace({ path: `/Member` });
}

async function submit(event: Event) {
    event.preventDefault();

    const { valid } = await form.value.validate();

    if (valid && member.value) {
        loading.value = true;
        let results: { success: boolean; error?: string; data?: Member };

        // MemberRequest 형태로 변환
        const memberRequest: any = {
            userName: member.value.userName,
            gender: member.value.gender,
            phone: member.value.phone
        }

        // null이 아닌 값만 추가
        if (member.value.birth) memberRequest.birth = Number(member.value.birth);
        if (member.value.age) memberRequest.age = Number(member.value.age);
        if (member.value.address) memberRequest.address = member.value.address;
        if (member.value.consultant) memberRequest.consultant = member.value.consultant;
        if (member.value.purpose) memberRequest.purpose = member.value.purpose;
        if (member.value.visitPath) memberRequest.visitPath = member.value.visitPath;
        if (member.value.getUtilization) memberRequest.getUtilization = member.value.getUtilization;
        if (member.value.getRenting) memberRequest.getRenting = member.value.getRenting;

        console.log('Sending memberRequest:', memberRequest);

        if (member.value.idx) {
            results = await membersStore.updateMember(member.value.idx, memberRequest);
        } else {
            results = await membersStore.createMember(memberRequest);
        }

        if (results.success) {
            router.replace({ path: '/Member' });
        }
        loading.value = false;
    }
}
</script>

<template>
    <UiMainContainer>
        <UiParentCard :title="title">
            <div v-if="!membersStore.loading && member">
                <v-form ref="form" v-model="valid" @submit.prevent>
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="member.userName"
                                    :rules="nameRules"
                                    label="이름"
                                    variant="solo-filled"
                                    required
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="member.gender"
                                    :rules="[requiredRule]"
                                    label="성별"
                                    :items="['남', '여']"
                                    variant="solo-filled"
                                    required
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model.number="member.birth"
                                    type="number"
                                    label="생년월일 (예: 19900101)"
                                    variant="solo-filled"
                                    placeholder="YYYYMMDD"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model.number="member.age"
                                    type="number"
                                    label="나이"
                                    variant="solo-filled"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="12" md="4">
                                <v-text-field
                                    v-model="member.phone"
                                    :rules="phoneRules"
                                    label="연락처"
                                    variant="solo-filled"
                                    required
                                    placeholder="010-1234-5678"
                                ></v-text-field>
                            </v-col>



                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="member.consultant"
                                    :items="staffList"
                                    item-title="name"
                                    item-value="idx"
                                    label="상담자"
                                    variant="solo-filled"
                                    clearable
                                ></v-select>
                            </v-col>

                          <v-col cols="12" md="4">
                            <v-select
                              v-model="member.visitPath"
                              :items="visitPathList"
                              item-title="visitPathName"
                              item-value="idx"
                              label="방문 경로"
                              variant="solo-filled"
                              clearable
                            ></v-select>
                          </v-col>

                            <v-col cols="12" md="4">
                                <v-select
                                    v-model="member.purpose"
                                    :items="purposeList"
                                    item-title="purposeName"
                                    item-value="idx"
                                    label="운동 목적"
                                    variant="solo-filled"
                                    clearable
                                ></v-select>
                            </v-col>

                            <v-col cols="12" md="8">
                                <v-text-field
                                    v-model="member.address"
                                    label="주소"
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
                                <v-btn
                                    :loading="loading"
                                    color="secondary"
                                    variant="flat"
                                    type="submit"
                                    @click="submit"
                                >
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