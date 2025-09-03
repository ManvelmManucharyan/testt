<template>
  <n-popconfirm @positive-click="handlePositiveClick">
    <template #trigger>
      <n-button type="error" class="delete-button">
        {{ $t('delete') }}
      </n-button>
    </template>
    {{ $t('confirmDeleteOffer') }}
  </n-popconfirm>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStore } from '@/store/offer';

export default {
  props: {
    offerId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapStores(useOfferStore),
  },
  methods: {
    async handlePositiveClick() {
      await this.offerStore.remove(this.offerId);
      this.$router.push('/offers');
    },
  },
};
</script>

<style scoped>
.delete-button {
  background-color: red;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 5px;
}
</style>
