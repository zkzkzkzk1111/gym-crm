<script setup lang="ts">
import { usePurchaseStore } from "@/stores/purchase";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import UiMainContainer from "@/components/shared/UiMainContainer.vue";
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import NotificationBar from "@/components/shared/NotificeBar.vue";
import { router } from "@/router";

const headers = [

  { title: "타입", key: "type", align: "start" },
  { title: "상품명", key: "name", align: "start" },
  { title: "구매자", key: "buyer", align: "start" },
  { title: "갯수", key: "cnt", align: "start" },
  { title: "가격", key: "price", align: "end" },
  { title: "결제수단", key: "paymentMethod", align: "start" },
  { title: "결제일", key: "paidAt", align: "start" },
  { title: "연락처", key: "phone", align: "start" },
  { title: "상태", key: "statusName", align: "start" },
  { title: "", key: "idx", align: "end" },
] as const;

const purchaseStore = usePurchaseStore();
const { filteredPurchases, loading } = storeToRefs(purchaseStore);
const dialog = ref(false);
const search = ref('');
const notice = ref(false);
const selectedId = ref<number | null>(null);

onMounted(() => {
  purchaseStore.fetchAll();
});

function editPurchase(idx: number) {
  router.replace({ path: `/purchase/${idx}` });
}

function deletePurchase(idx: number) {
  dialog.value = true;
  selectedId.value = idx;
}

function onConfirm() {
  if (selectedId.value !== null) {
    purchaseStore.deletePurchase(selectedId.value)
      .then((res) => {
        dialog.value = false;
        if (res.success) {
          notice.value = true;
          setTimeout(() => {
            notice.value = false;
            purchaseStore.fetchAll();
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

function getStatusColor(status: number): string {
  switch (status) {
    case 1:
      return 'success';
    case 0:
      return 'warning';
    case -1:
      return 'error';
    default:
      return 'info';
  }
}
</script>

<template>
  <UiMainContainer>
    <UiParentCard title="구매 내역">
      <div v-if="loading">
        <v-progress-linear color="secondary" height="6" indeterminate rounded></v-progress-linear>
      </div>
      <div v-if="!loading">
        <v-data-table :headers="headers" :items="filteredPurchases" :search="search">
          <template v-slot:top>
            <v-text-field v-model="search" variant="solo-filled" class="pa-2" label="검색"></v-text-field>
          </template>
          <template v-slot:[`item.price`]="{ value }">
            {{ value?.toLocaleString() }}원
          </template>
          <template v-slot:[`item.statusName`]="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small">
              {{ item.statusName }}
            </v-chip>
          </template>
          <template v-slot:[`item.idx`]="{ value }">
            <div class="d-flex ga-6 p-r-5 justify-end">
              <v-icon color="secondary" icon="$edit" size="x-large" @click="editPurchase(value)"></v-icon>
              <v-icon color="disabled" icon="$delete" size="x-large" @click="deletePurchase(value)"></v-icon>
            </div>
          </template>
        </v-data-table>
      </div>
    </UiParentCard>
    <ConfirmDialog v-model="dialog" @confirm="onConfirm" @cancel="onCancel" />
    <NotificationBar :notice="notice" @onClose="onClose" />
  </UiMainContainer>
</template>
