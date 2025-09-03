<template>
  <n-form label-placement="left" :label-width="100" class="company-form">
    <n-form-item :label="$t('Name')" class="form-group">
      <n-input
        v-model:value="localFormData.name"
        :placeholder="$t('enterClientName')"
      />
    </n-form-item>

    <n-form-item :label="$t('jurisdiction')" class="form-group">
      <country-select
        v-model="localFormData.jurisdiction"
        :placeholder="$t('selectJurisdiction')"
      />
    </n-form-item>

    <n-form-item :label="$t('innOrEquivalent')" class="form-group">
      <n-input
        v-model:value="localFormData.inn_or_equivalent"
        :placeholder="$t('enterinnOrEquivalent')"
      />
    </n-form-item>

    <n-form-item :label="$t('ceoFullName')" class="form-group">
      <n-input
        v-model:value="localFormData.ceo_full_name"
        :placeholder="$t('enterCeoFullName')"
      />
    </n-form-item>

    <n-form-item :label="$t('ceoEmail')" class="form-group">
      <n-input
        v-model:value="localFormData.ceo_email"
        :placeholder="$t('enterCeoEmail')"
      />
    </n-form-item>

    <n-form-item :label="$t('ceoTelagram')" class="form-group">
      <n-input
        v-model:value="localFormData.ceo_telegram"
        :placeholder="$t('enterCeoTelagram')"
      />
    </n-form-item>

    <n-form-item :label="$t('ceoPhoneNumber')" class="form-group">
      <n-input
        v-model:value="localFormData.ceo_phone_number"
        :placeholder="$t('enterCeoPhoneNumber')"
      />
    </n-form-item>

    <link-input v-model="localFormData.link" />
  </n-form>

  <submit-company-button v-if="!isCreating" :form-data="localFormData" />
  <delete-company-button v-if="!isCreating" :company-id="companyId" />
</template>

<script>
import SubmitCompanyButton from '../buttons/SubmitCompanyButton.vue';
import CountrySelect from '@/components/CountrySelect.vue';
import DeleteCompanyButton from '../buttons/DeleteCompanyButton.vue';
import LinkInput from '@/components/LinkInput.vue';
export default {
  components: {
    CountrySelect,
    SubmitCompanyButton,
    DeleteCompanyButton,
    LinkInput,
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
      countries: [],
    };
  },
  computed: {
    companyId() {
      return this.$route.params.companyId;
    },
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
        this.localFormData = newValue;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.company-form {
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
