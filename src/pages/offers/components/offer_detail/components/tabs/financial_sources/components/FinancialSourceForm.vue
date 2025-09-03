<template>
  <n-form v-model="formData">
    <n-form-item :label="$t('company')" class="form-group">
      <client-select
        v-model="formData.client"
        :placeholder="$t('selectClient')"
      />
    </n-form-item>

    <n-form-item :label="$t('tariff')" class="form-group">
      <tariff-choices-select
        v-model="formData.tariff"
        :placeholder="$t('selectTariff')"
      />
    </n-form-item>

    <n-form-item :label="$t('funding_share')">
      <n-input-number
        v-model:value="formData.funding_share"
        :placeholder="$t('enterFundingShare')"
        style="width: 100%"
        size="medium"
        min="0"
        max="100"
        :show-button="false"
      >
        <template #suffix> % </template>
      </n-input-number>
    </n-form-item>

    <n-form-item :label="$t('equity')">
      <n-input-number
        v-model:value="formData.equity"
        :placeholder="$t('enterEquity')"
        style="width: 100%"
        size="medium"
        min="0"
        max="100"
        :show-button="false"
      >
        <template #suffix> % </template>
      </n-input-number>
    </n-form-item>
  </n-form>
</template>

<script>
import ClientSelect from '@/components/ClientSelect.vue';
import TariffChoicesSelect from '@/components/TariffChoicesSelect.vue';

export default {
  components: {
    ClientSelect,
    TariffChoicesSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 16px;
}

.loading {
  text-align: center;
}
</style>
