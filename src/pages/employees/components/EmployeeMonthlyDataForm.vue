<template>
  <n-form
    v-model="formData"
    label-placement="left"
    label-width="auto"
    :style="{
      maxWidth: '640px',
    }"
  >
    <n-form-item
      :label="$t('remunerationNet')"
      path="formData.remuneration"
      required
    >
      <n-input-number
        v-model:value="formData.remuneration"
        :placeholder="$t('enterRemuneration')"
        required
        :show-button="false"
        :min="0"
      />
    </n-form-item>

    <n-form-item :label="$t('currency')" path="formData.currency" required>
      <company-currency-select
        v-model="formData.currency"
        :placeholder="$t('selectCurrency')"
      />
    </n-form-item>

    <n-form-item
      :label="$t('employment_type')"
      path="formData.payment_type"
      required
    >
      <employment-type-select
        v-model="formData.payment_type"
        :placeholder="$t('selectEmploymentType')"
      />
    </n-form-item>

    <n-form-item
      :label="$t('payment_type')"
      path="formData.employment_type"
      required
    >
      <payment-type-select
        v-model="formData.employment_type"
        :placeholder="$t('selectPaymentType')"
      />
    </n-form-item>

    <n-form-item :label="$t('company')" path="formData.company" required>
      <company-select
        v-model="formData.company"
        :placeholder="$t('selectCompany')"
      />
    </n-form-item>

    <div v-if="monthlyDataId">
      <n-form-item
        v-for="(value, key) in readOnlyFields"
        :key="key"
        :label="$t(key)"
      >
        <n-input :value="`${value}`" disabled />
      </n-form-item>
    </div>
  </n-form>
</template>

<script>
import CompanyCurrencySelect from '@/components/CompanyCurrencySelect.vue';
import CompanySelect from '@/components/CompanySelect.vue';
import EmploymentTypeSelect from '@/components/EmploymentTypeSelect.vue';
import PaymentTypeSelect from '@/components/PaymentTypeSelect.vue';
export default {
  components: {
    CompanyCurrencySelect,
    CompanySelect,
    EmploymentTypeSelect,
    PaymentTypeSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    monthlyDataId() {
      return this.$route.query.monthly_data_id;
    },

    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },

    readOnlyFields() {
      return {
        hourly_rate__usd: this.formData.hourly_rate__usd,
        hourly_rate__rub: this.formData.hourly_rate__rub,
        hourly_rate__eur: this.formData.hourly_rate__eur,
        monthly_rate__usd: this.formData.monthly_rate__usd,
        monthly_rate__rub: this.formData.monthly_rate__rub,
        monthly_rate__eur: this.formData.monthly_rate__eur,
      };
    },
  },
};
</script>
