<template>
  <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>

  <n-form
    v-else
    :v-model="formData"
    label-placement="left"
    class="employee-form"
  >
    <n-form-item :label="$t('value')" class="form-group">
      <n-input v-model:value="formData.value" :placeholder="$t('enterValue')" />
    </n-form-item>
  </n-form>
</template>

<script>
import { mapStores } from 'pinia';
import { useCardStore } from '@/store/card';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    ...mapStores(useCardStore),
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
  methods: {
    async submitForm() {
      await this.cardStore.update(this.$route.params.cardId, this.formData);
      this.$router.push('/cards');
    },
  },
};
</script>

<style scoped>
.employee-form {
  padding: 16px;
  background-color: #fff;
}

.form-group {
  gap: 30px;
}

.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
