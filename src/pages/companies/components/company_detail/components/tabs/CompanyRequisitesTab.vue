<template>
  <n-form
    :v-model="localFormData"
    label-placement="left"
    :label-width="150"
    class="employee-form"
  >
    <n-form-item
      :label="$t('currency')"
      path="formData.currency"
      class="form-group"
      required
    >
      <company-currency-select
        v-model="localFormData.payment_currency"
        :placeholder="$t('selectCurrency')"
      />
    </n-form-item>
    <n-form-item :label="$t('cryptoWallet')" class="form-group">
      <n-input
        v-model:value="localFormData.crypto_wallet"
        :placeholder="$t('enterCryptoWallet')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('fiatSwift')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_swift"
        :placeholder="$t('enterFiatSwift')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('fiatAccountNumber')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_account_number"
        :placeholder="$t('enterFiatAccountNumber')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('fiatBankName')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_bank_name"
        :placeholder="$t('enterFiatBankName')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('fiatBankInn')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_bank_inn"
        :placeholder="$t('enterFiatBankInn')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('fiatBankBik')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_bank_bik"
        :placeholder="$t('enterFiatBankBik')"
        :style="{ width: '350px' }"
      />
    </n-form-item>
    <n-form-item :label="$t('fiatBankKpp')" class="form-group">
      <n-input
        v-model:value="localFormData.fiat_bank_kpp"
        :placeholder="$t('enterfiatBankKpp')"
        :style="{ width: '350px' }"
      />
    </n-form-item>
  </n-form>

  <submit-company-button v-if="!isCreating" :form-data="localFormData" />
</template>

<script>
import SubmitCompanyButton from '../buttons/SubmitCompanyButton.vue';
import CompanyCurrencySelect from '@/components/CompanyCurrencySelect.vue';

export default {
  components: {
    SubmitCompanyButton,
    CompanyCurrencySelect,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:formData'],
  data() {
    return {
      localFormData: { ...this.formData },
    };
  },
  computed: {
    isCreating() {
      return !!this.$route.query.create;
    },
  },
  watch: {
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
    formData: {
      handler(newValue) {
        this.localFormData = { ...newValue };
      },
      deep: true,
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
  margin-bottom: 16px;
}

.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
