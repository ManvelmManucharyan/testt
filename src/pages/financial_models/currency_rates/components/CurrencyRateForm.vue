<template>
  <n-form v-model="formData" class="currency-form">
    <n-form-item
      :label="$t('usd_aldan_modifier')"
      path="formData.usd_aldan_modifier"
      class="form-group"
      required
    >
      <n-input-number
        v-model:value="formData.usd_aldan_modifier"
        :placeholder="$t('enterUsdAldanModifier')"
        required
        :show-button="false"
        :min="0"
      />
    </n-form-item>

    <n-form-item
      :label="$t('eur_aldan_modifier')"
      path="formData.eur_aldan_modifier"
      class="form-group"
      required
    >
      <n-input-number
        v-model:value="formData.eur_aldan_modifier"
        :placeholder="$t('enterEurAldanModifier')"
        required
        :show-button="false"
        :min="0"
      />
    </n-form-item>
  </n-form>
</template>

<script>
export default {
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
.currency-form {
  padding: 16px;
  background-color: #fff;
}
.form-group {
  margin-bottom: 16px;
}
.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.form-group {
  margin-bottom: 12px;
}
</style>
