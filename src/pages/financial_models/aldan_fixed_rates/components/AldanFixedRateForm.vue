<template>
  <n-form v-model="formData" class="aldan-rate-form">
    <div class="form-row">
      <n-form-item :label="$t('insurance_premiums')" class="form-group">
        <n-input-number
          v-model:value="formData.insurance_premiums"
          required
          :show-button="false"
        />
      </n-form-item>
      <n-form-item :label="$t('personal_income_tax')" class="form-group">
        <n-input-number
          v-model:value="formData.personal_income_tax"
          required
          :show-button="false"
        />
      </n-form-item>
    </div>

    <div class="form-row">
      <n-form-item :label="$t('total_expenses')" class="form-group">
        <n-input-number
          v-model:value="totalExpensesString"
          required
          :show-button="false"
          :min="0"
        />
      </n-form-item>
      <n-form-item :label="$t('income_flex')" class="form-group">
        <n-input-number
          v-model:value="formData.income_flex"
          :show-button="false"
        />
      </n-form-item>
    </div>

    <div class="form-row">
      <n-form-item :label="$t('income_fix')" class="form-group">
        <n-input-number
          v-model:value="incomeFixString"
          required
          :show-button="false"
          :min="0"
        />
      </n-form-item>
      <n-form-item :label="$t('utilization_rate')" class="form-group">
        <n-input-number
          v-model:value="formData.utilization_rate"
          required
          :show-button="false"
        />
      </n-form-item>
    </div>
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
    usdFixedrateString: {
      get() {
        return this.formData.usd_fixed_rate
          ? Number(this.formData.usd_fixed_rate)
          : null;
      },
      set(newVal) {
        this.formData.usd_fixed_rate = newVal;
      },
    },
    eurFixedrateString: {
      get() {
        return this.formData.eur_fixed_rate
          ? Number(this.formData.eur_fixed_rate)
          : null;
      },
      set(newVal) {
        this.formData.eur_fixed_rate = newVal;
      },
    },
    totalExpensesString: {
      get() {
        return this.formData.total_expenses
          ? Number(this.formData.total_expenses)
          : null;
      },
      set(newVal) {
        this.formData.total_expenses = newVal;
      },
    },
    incomeFixString: {
      get() {
        return this.formData.income_fix
          ? Number(this.formData.income_fix)
          : null;
      },
      set(newVal) {
        this.formData.income_fix = newVal;
      },
    },
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
    isLoading() {
      return this.aldanFixedRateStore.isLoading;
    },
  },
  methods: {
    parseInput(input) {
      return +input;
    },
    onlyAllowNumber(value) {
      return /^\d*\.?\d*$/.test(value);
    },
    roundValue(field) {
      const numericVal = parseFloat(this.formData[field]);
      if (!isNaN(numericVal)) {
        this.formData[field] = parseFloat(numericVal.toFixed(2));
      }
    },
  },
};
</script>

<style scoped>
.aldan-rate-form {
  padding: 16px;
  background-color: #fff;
}

.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1 1 45%;
  min-width: 200px;
}
</style>
