<template>
  <n-form label-placement="left" :label-width="300" class="offer-form">
    <n-form-item :label="$t('offerName')" required>
      <n-input
        v-model:value="localFormData.name"
        :placeholder="$t('enterOfferName')"
        type="text"
        style="width: 100%"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('monthsDuration')">
      <n-input-number
        v-model:value="localFormData.months_duration"
        :placeholder="$t('enterMonthDuration')"
        style="width: 100%"
        size="medium"
        :default-value="12"
      />
    </n-form-item>

    <n-form-item :label="$t('offerComment')">
      <n-input
        v-model:value="localFormData.comment"
        :placeholder="$t('enterComment')"
        size="small"
        type="textarea"
      />
    </n-form-item>

    <n-form-item :label="$t('rateCalculationReferenceDate')">
      <date-select
        v-model="localFormData.rate_calculation_reference_date"
        :placeholder="$t('selectDate')"
        style="width: 100%"
        :format="'dd MMMM YYYY'"
        size="medium"
      />
    </n-form-item>

    <link-input v-model="localFormData.link" />

    <n-form-item :label="$t('company')" required>
      <client-select
        v-model="localFormData.client"
        :placeholder="$t('selectCompany')"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('associateWithProject')">
      <project-select v-model="localFormData.project" size="medium" />
    </n-form-item>

    <n-form-item :label="$t('status')">
      <offer-status-select
        v-model="localFormData.status"
        :placeholder="$t('selectStatus')"
        size="medium"
      />
    </n-form-item>

    <n-form-item v-if="offerId" :label="$t('author')">
      <span>{{ localFormData.author_name }}</span>
    </n-form-item>

    <n-form-item v-if="offerId" :label="$t('createdAt')">
      <span>{{ formatDate(localFormData.created_at) }}</span>
    </n-form-item>

    <n-form-item v-if="offerId" :label="$t('updatedAt')">
      <span>{{ formatDate(localFormData.updated_at) }}</span>
    </n-form-item>
  </n-form>

  <submit-offer-button v-if="offerId" :form-data="localFormData" />
  <delete-offer-button v-if="offerId" :offer-id="offerId" />
</template>

<script>
import ClientSelect from '@/components/ClientSelect.vue';
import ProjectSelect from '@/components/ProjectSelect.vue';
import OfferStatusSelect from '@/components/OfferStatusSelect.vue';
import SubmitOfferButton from '@/pages/offers/components/offer_detail/components/buttons/SubmitOfferButton.vue';
import DeleteOfferButton from '@/pages/offers/components/offer_detail/components/buttons/DeleteOfferButton.vue';
import DateSelect from '@/components/DateSelect.vue';
import LinkInput from '@/components/LinkInput.vue';
import { format } from 'date-fns';

export default {
  components: {
    ClientSelect,
    ProjectSelect,
    OfferStatusSelect,
    SubmitOfferButton,
    DateSelect,
    DeleteOfferButton,
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
    };
  },
  computed: {
    offerId() {
      return this.$route.params.offerId;
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
  methods: {
    formatDate(date) {
      return date ? format(new Date(date), 'PPpp') : '-';
    },
  },
};
</script>

<style scoped>
.offer-form {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}
</style>
