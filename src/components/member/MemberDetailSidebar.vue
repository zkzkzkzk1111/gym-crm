<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  drawer: boolean;
  selectedMember: any;
  getGoodsName: (idx: number | null) => string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'purchase'): void;
}>();

const AVATAR_PLACEHOLDER = "/src/assets/images/customer/avatar-0.webp";
</script>

<template>
  <v-navigation-drawer :model-value="drawer" location="right" temporary width="400" @update:model-value="emit('close')">
    <template v-slot:prepend>
      <v-toolbar color="primary" dark>
        <v-toolbar-title>회원 정보</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
    </template>

    <v-card v-if="selectedMember" flat>
      <v-card-text>
        <!-- 프로필 섹션 -->
        <div class="text-center mb-4">
          <v-avatar size="80" color="primary">
            <v-img :src="AVATAR_PLACEHOLDER"></v-img>
          </v-avatar>
          <h3 class="mt-3">{{ selectedMember.userName }}</h3>
          <v-chip :color="selectedMember.status === '정상' ? 'success' : 'warning'" size="small" class="mt-2">
            {{ selectedMember.status }}
          </v-chip>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 기본 정보 -->
        <div class="info-section mb-4">
          <h4 class="text-h6 mb-3">기본 정보</h4>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">연락처</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.phone || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">성별</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.gender || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">생년월일</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.birth || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">나이</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.age ? `${selectedMember.age}세` : '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 이용권 정보 -->
        <div class="info-section mb-4">
          <h4 class="text-h6 mb-3">이용권 정보</h4>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">보유 이용권</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ getGoodsName(selectedMember.getUtilization) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">등록일</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.regDt || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">종료일</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.endDt || '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">남은일수</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.dayNum ? `${selectedMember.dayNum}일` : '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 담당자 정보 -->
        <div class="info-section mb-4">
          <h4 class="text-h6 mb-3">담당자</h4>
          <v-list density="compact">
            <v-list-item>
              <v-list-item-title class="text-grey-darken-1">상담자</v-list-item-title>
              <v-list-item-subtitle class="text-body-1">{{ selectedMember.consultantName || '-' }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>

        <!-- 액션 버튼 -->
        <div class="mt-4">
          <v-btn variant="elevated" block size="large" @click="emit('purchase')" class="purchase-btn">
            <v-icon start>$creditCard</v-icon>
            구매하기
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
.purchase-btn {
  background: #121212 !important;
  color: white !important;
}
</style>