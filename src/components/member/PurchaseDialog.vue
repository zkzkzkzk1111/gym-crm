<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';

const props = defineProps<{
  dialog: boolean;
  goodsList: any[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'purchase', cart: any[]): void;
}>();

const cart = ref<any[]>([]);

function addToCart(goods: any) {
  const existingItem = cart.value.find(item => item.idx === goods.idx);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.value.push({
      ...goods,
      quantity: 1,
      paymentType: 'cash',
      selectedPrice: goods.cash
    });
  }
}

function changePaymentType(index: number, paymentType: 'cash' | 'card') {
  const item = cart.value[index];
  cart.value[index].paymentType = paymentType;
  cart.value[index].selectedPrice = paymentType === 'cash' ? item.cash : item.card;
}

function clearCart() {
  cart.value = [];
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1);
}

function updateQuantity(index: number, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(index);
  } else {
    cart.value[index].quantity = quantity;
  }
}

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);
});

function handlePurchase() {
  if (cart.value.length === 0) {
    alert('상품을 선택해주세요.');
    return;
  }
  emit('purchase', cart.value);
  cart.value = [];
}

function handleClose() {
  emit('close');
  cart.value = [];
}
</script>

<template>
  <v-dialog :model-value="dialog" max-width="1200px" scrollable @update:model-value="handleClose">
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        <v-icon class="mr-2">mdi-shopping</v-icon>
        상품 구매
        <v-spacer></v-spacer>
        <v-btn icon @click="handleClose" variant="text">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-4">
        <v-row>
          <!-- 상품 목록 -->
          <v-col cols="12" md="8">
            <h3 class="mb-3">상품 목록</h3>
            <div style="max-height: 500px; overflow-y: auto; padding-right: 8px;">
              <v-row>
                <v-col v-for="goods in goodsList" :key="goods.idx" cols="12" sm="6" md="4" lg="3">
                  <v-card hover elevation="2" @click="addToCart(goods)" class="cursor-pointer">
                    <v-card-text>
                      <h4 class="mb-2">{{ goods.goodsName }}</h4>
                      <div class="mb-2">
                        <v-chip size="small" color="primary">
                          {{ goods.duration }}개월
                        </v-chip>
                        <v-chip size="small" color="secondary" class="ml-1">
                          {{ goods.useCount }}회
                        </v-chip>
                      </div>
                      <div class="mt-2">
                        <div class="text-caption text-grey-darken-1">현금</div>
                        <div class="text-body-1 font-weight-bold text-success">
                          {{ goods.cash?.toLocaleString() }}원
                        </div>
                      </div>
                      <div class="mt-1">
                        <div class="text-caption text-grey-darken-1">카드</div>
                        <div class="text-body-1 font-weight-bold text-info">
                          {{ goods.card?.toLocaleString() }}원
                        </div>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" variant="text" size="small" block>
                        <v-icon left>mdi-cart-plus</v-icon>
                        담기
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <!-- 장바구니 -->
          <v-col cols="12" md="4">
            <v-card elevation="3" class="sticky-cart">
              <v-card-title class="bg-grey-lighten-4 d-flex align-center">
                <v-icon class="mr-2">mdi-cart</v-icon>
                장바구니
                <v-chip class="ml-2" size="small" color="primary">{{ cart.length }}</v-chip>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="cart.length > 0"
                  icon
                  size="small"
                  color="error"
                  variant="text"
                  @click="clearCart"
                >
                  <v-icon>mdi-delete-sweep</v-icon>
                </v-btn>
              </v-card-title>

              <v-divider></v-divider>

              <v-card-text style="max-height: 400px; overflow-y: auto;">
                <div v-if="cart.length === 0" class="text-center py-8 text-grey">
                  <v-icon size="64" color="grey-lighten-1">mdi-cart-outline</v-icon>
                  <p class="mt-3">상품을 선택해주세요</p>
                </div>

                <v-list v-else>
                  <v-list-item v-for="(item, index) in cart" :key="index" class="mb-3 border rounded pa-2">
                    <div class="w-100">
                      <div class="d-flex align-center mb-2">
                        <v-icon color="primary" class="mr-2">mdi-package-variant</v-icon>
                        <div class="flex-grow-1">
                          <div class="font-weight-bold">{{ item.goodsName }}</div>
                          <div class="text-caption text-grey">
                            {{ item.duration }}개월 / {{ item.useCount }}회
                          </div>
                        </div>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeFromCart(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>

                      <v-divider class="my-2"></v-divider>

                      <div class="d-flex align-center mb-2">
                        <v-select
                          :items="[
                            { title: `현금: ${item.cash?.toLocaleString()}원`, value: 'cash' },
                            { title: `카드: ${item.card?.toLocaleString()}원`, value: 'card' }
                          ]"
                          v-model="item.paymentType"
                          @update:modelValue="changePaymentType(index, $event)"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="flex-grow-1"
                        ></v-select>
                      </div>

                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="updateQuantity(index, item.quantity - 1)"
                          >
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>
                          <span class="mx-3 font-weight-bold">{{ item.quantity }}</span>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="updateQuantity(index, item.quantity + 1)"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </div>
                        <div class="text-h6 text-primary font-weight-bold">
                          {{ (item.selectedPrice * item.quantity)?.toLocaleString() }}원
                        </div>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-text class="bg-grey-lighten-5">
                <div class="d-flex justify-space-between align-center mb-3">
                  <span class="text-h6">총 금액</span>
                  <span class="text-h5 text-primary font-weight-bold">
                    {{ totalPrice.toLocaleString() }}원
                  </span>
                </div>
                <v-btn
                  color="success"
                  variant="elevated"
                  block
                  size="large"
                  :disabled="cart.length === 0"
                  @click="handlePurchase"
                >
                  <v-icon left>mdi-credit-card</v-icon>
                  결제하기
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.sticky-cart {
  position: sticky;
  top: 20px;
}

.border {
  border: 1px solid #e0e0e0;
}
</style>