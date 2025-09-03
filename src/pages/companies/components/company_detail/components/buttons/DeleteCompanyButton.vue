<template>
  <n-popconfirm @positive-click="handlePositiveClick">
    <template #trigger>
      <n-button type="error" class="delete-button">
        {{ $t('delete') }}
      </n-button>
    </template>
    {{ $t('confirmDeleteCompany') }}
  </n-popconfirm>
</template>

<script>
import { mapStores } from 'pinia';
import { useClientStore } from '@/store/client';

export default {
  props: {
    companyId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapStores(useClientStore),
  },
  methods: {
    async handlePositiveClick() {
      await this.clientStore.remove(this.companyId);
      this.$router.push('/companies');
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
