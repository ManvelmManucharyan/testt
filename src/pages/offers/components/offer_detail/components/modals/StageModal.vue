<template>
  <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>
  <n-form v-else v-model="formData">
    <n-form-item
      :label="$t('name')"
      path="formData.name"
      class="form-group"
      required
    >
      <n-input
        id="name"
        v-model:value="formData.name"
        :placeholder="$t('enterStageName')"
        required
      />
    </n-form-item>

    <div class="date">
      <n-form-item
        :label="$t('from')"
        path="formData.from_date"
        class="form-group"
        required
      >
        <date-select
          v-model:value="formData.from_date"
          :placeholder="$t('selectDate')"
          format="dd MMM y"
          type="date"
        />
      </n-form-item>

      <n-form-item
        :label="$t('to')"
        path="formData.to_date"
        class="form-group"
        required
      >
        <date-select
          v-model:value="formData.to_date"
          :placeholder="$t('selectDate')"
          format="dd MMM y"
          type="date"
        />
      </n-form-item>
    </div>

    <n-form-item
      :label="$t('tariffRateDate')"
      path="formData.tariff_rate_date"
      class="form-group"
      required
    >
      <date-select
        v-model:value="formData.tariff_rate_date"
        :placeholder="$t('selectDate')"
        format="dd MMM y"
        type="date"
        :is-date-disabled="dateDisabled"
      />
    </n-form-item>

    <n-form-item :label="$t('tariff')" class="form-group">
      <tariff-choices-select
        v-model="formData.tariff"
        :placeholder="$t('selectTariff')"
      />
    </n-form-item>

    <n-form-item
      :label="$t('kpi')"
      path="formData.kpi"
      class="form-group"
      required
    >
      <n-input
        id="kpi"
        v-model:value="formData.kpi"
        type="textarea"
        :placeholder="$t('enterKpi')"
        required
      />
    </n-form-item>

    <form-group-select
      v-model="formData.currency"
      :options="currenciesStore.data"
      :label-name="$t('currency')"
    ></form-group-select>

    <n-form-item
      :label="$t('bonus')"
      path="formData.bonus"
      label-placement="left"
      class="form-group"
      required
      style="gap: 60%"
    >
      <n-input
        id="bonus"
        v-model:value="formData.bonus"
        type="number"
        :placeholder="$t('enterBonus')"
        required
      />
    </n-form-item>
  </n-form>
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useCurrenciesStore } from '@/store/currencies';
import FormGroupSelect from '@/components/FormGroupSelect.vue';
import DateSelect from '@/components/DateSelect.vue';
import TariffChoicesSelect from '@/components/TariffChoicesSelect.vue';

export default {
  components: {
    FormGroupSelect,
    DateSelect,
    TariffChoicesSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      validationErrors: [],
      showModal: false,
      selectedOffer: null,
    };
  },
  computed: {
    ...mapStores(useCurrenciesStore),
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
    isLoading() {
      return this.currenciesStore.isLoading;
    },
  },
  async created() {
    this.currenciesStore.fetch();
  },
  methods: {
    dateDisabled(ts) {
      const date = new Date(ts);
      return date > moment(this.localToDate).toDate();
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

.date {
  display: flex;
  gap: 20%;
}
</style>
