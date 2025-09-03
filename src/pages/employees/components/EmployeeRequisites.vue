<template>
  <n-form
    :v-model="localFormData"
    label-placement="left"
    :label-width="150"
    class="employee-form"
  >
    <n-form-item :label="$t('cryptoWalletNumber')" class="form-group">
      <n-input
        v-model:value="localFormData.crypto_wallet_number"
        :placeholder="$t('enterCryptoWalletNumber')"
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

    <n-form-item :label="$t('correspondentAccount')" class="form-group">
      <n-input
        v-model:value="localFormData.correspondent_account"
        :placeholder="$t('enterCorrespondentAccount')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('bankName')" class="form-group">
      <n-input
        v-model:value="localFormData.bank_name"
        :placeholder="$t('enterBankName')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('bankInn')" class="form-group">
      <n-input
        v-model:value="localFormData.bank_inn"
        :placeholder="$t('enterBankInn')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('bankBik')" class="form-group">
      <n-input
        v-model:value="localFormData.bank_bik"
        :placeholder="$t('enterBankBik')"
        :style="{ width: '350px' }"
      />
    </n-form-item>

    <n-form-item :label="$t('bankKpp')" class="form-group">
      <n-input
        v-model:value="localFormData.bank_kpp"
        :placeholder="$t('enterBankKpp')"
        :style="{ width: '350px' }"
      />
    </n-form-item>
  </n-form>

  <submit-employee :form-data="localFormData" />
</template>

<script>
import SubmitEmployee from './SubmitEmployee.vue';

export default {
  components: {
    SubmitEmployee,
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
