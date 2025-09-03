<template>
  <n-card :title="$t('aldanFixedRates')">
    <n-table bordered>
      <thead>
        <tr>
          <th></th>
          <th v-for="month in months" :key="month">
            <router-link
              class="clickable-month"
              :class="{ 'disabled-month': isMonthDisabled(month) }"
              :to="rateLink(month)"
              @click.prevent="
                isMonthDisabled(month) ? null : openRateModal(month)
              "
            >
              {{ month }}
            </router-link>
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-for="(values, fieldName) in transformedData"
          :key="fieldName"
        >
          <tr>
            <td>
              {{ $t(fieldName) }}
              <help-text style="align-items: center" :text="values.helpText" />
            </td>
            <td v-for="month in months" :key="month">
              {{ values[month] !== null ? values[month] : '-' }}
            </td>
          </tr>
          <tr v-if="fieldName === 'utilization_rate'" class="row-separator">
            <td :colspan="months.length + 1" />
          </tr>
        </template>
      </tbody>
    </n-table>
  </n-card>

  <n-modal
    v-model:show="showAldanRateModal"
    preset="dialog"
    :show-icon="false"
    style="width: 40%"
    transform-origin="center"
    @close="onClickCloseStageModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="modalTitle"
    >
      <aldan-fixed-rate-form v-model="form" />
    </n-card>
    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseStageModal">{{ $t('cancel') }}</n-button>
        <n-button type="primary" @click="onPositiveClickSubmitForm">
          {{ $t('confirm') }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useAldanFixedRatesStore } from '@/store/aldanFixedRates';
import { useAldanFixedRateStore } from '@/store/aldanFixedRate';
import { useCurrencyRatesStore } from '@/store/currencyRates';
import AldanFixedRateForm from './AldanFixedRateForm.vue';
import HelpText from '@/components/HelpText.vue';

export default {
  name: 'MonthlyCurrencyRates',
  components: { AldanFixedRateForm, HelpText },
  props: {
    roundValues: {
      type: Boolean,
      default: true,
    },
    localCurrencyRates: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      showAldanRateModal: false,
      selectedMonth: '',
      form: {},
    };
  },
  computed: {
    ...mapStores(
      useAldanFixedRatesStore,
      useAldanFixedRateStore,
      useCurrencyRatesStore,
    ),
    months() {
      return Array.from({ length: 12 }, (_, i) =>
        moment().locale(this.$i18n.locale).month(i).format('MMM'),
      );
    },
    transformedData() {
      const rawData = this.aldanFixedRatesStore.data;
      const currencyRates = this.localCurrencyRates;

      const months = this.months;

      const roundValue = (value) => {
        if (value === null) return value;
        return this.roundValues ? Math.round(value) : Number(value.toFixed(2));
      };

      const structuredData = {
        personal_income_tax: Object.fromEntries(months.map((m) => [m, null])),
        insurance_premiums: Object.fromEntries(months.map((m) => [m, null])),
        total_expenses: Object.fromEntries(months.map((m) => [m, null])),
        income_flex: Object.fromEntries(months.map((m) => [m, null])),
        income_fix: Object.fromEntries(months.map((m) => [m, null])),
        utilization_rate: Object.fromEntries(months.map((m) => [m, null])),
        usd_previous_month_currency_fixed_rate: Object.fromEntries(
          months.map((m) => [m, null]),
        ),
        eur_previous_month_currency_fixed_rate: Object.fromEntries(
          months.map((m) => [m, null]),
        ),
      };

      rawData.forEach((entry) => {
        const month = moment(entry.date, 'MM/DD/YYYY')
          .locale(this.$i18n.locale)
          .format('MMM');

        const roundOrRawValue = (value) =>
          this.roundValues ? roundValue(value) : value;

        structuredData.personal_income_tax[month] = roundOrRawValue(
          entry.personal_income_tax,
        );
        structuredData.personal_income_tax.helpText =
          'help_text_personal_income_tax';
        structuredData.insurance_premiums[month] = roundOrRawValue(
          entry.insurance_premiums,
        );
        structuredData.insurance_premiums.helpText =
          'help_text_insurance_premiums';
        structuredData.total_expenses[month] = roundOrRawValue(
          entry.total_expenses,
        );
        structuredData.total_expenses.helpText = 'help_text_total_expenses';
        structuredData.income_flex[month] = roundOrRawValue(entry.income_flex);
        structuredData.income_flex.helpText = 'help_text_income_flex';
        structuredData.income_fix[month] = roundOrRawValue(entry.income_fix);
        structuredData.income_fix.helpText = 'help_text_income_fix';
        structuredData.utilization_rate[month] = roundOrRawValue(
          entry.utilization_rate,
        );
        structuredData.utilization_rate.helpText = 'help_text_utilization_rate';
      });

      months.forEach((month, idx) => {
        const currentMoment = moment().month(idx).startOf('month');
        const prevMonth = currentMoment.clone().subtract(1, 'month');

        const prevRate = currencyRates.find((rate) =>
          moment(rate.date, 'MM/DD/YYYY').isSame(prevMonth, 'month'),
        );

        structuredData.usd_previous_month_currency_fixed_rate[month] = prevRate
          ? roundValue(prevRate.usd_aldan_rate)
          : null;
        structuredData.usd_previous_month_currency_fixed_rate.helpText =
          'help_text_usd_aldan_fixed_rate';

        structuredData.eur_previous_month_currency_fixed_rate[month] = prevRate
          ? roundValue(prevRate.eur_aldan_rate)
          : null;
        structuredData.eur_previous_month_currency_fixed_rate.helpText =
          'help_text_eur_aldan_fixed_rate';
      });

      return structuredData;
    },
    modalTitle() {
      return `${this.$t('edit_aldan_rate')} ${moment(this.selectedMonth, 'MMM')
        .locale(this.$i18n.locale)
        .format('MMMM')}`;
    },
    isMonthDisabled() {
      return (month) => {
        return Object.values(this.transformedData).every(
          (values) => values[month] === null,
        );
      };
    },
  },
  watch: {
    '$route.query.rate_id': {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.showAldanRateModal = true;
          const rateId = this.$route.query.rate_id;
          await this.aldanFixedRateStore.fetch(rateId);
          this.form = this.aldanFixedRateStore.data;
        }
      },
    },
    showAldanRateModal(newVal) {
      if (!newVal) {
        this.closeRateRouteParams();
      }
    },
  },
  methods: {
    rateLink(month) {
      if (!this.isMonthDisabled(month)) {
        return {
          name: this.$route.name,
          query: {
            ...this.$route.query,
            rate_id: this.getRateIdByMonth(month),
          },
        };
      } else {
        return {
          name: this.$route.name,
          query: this.$route.query,
        };
      }
    },
    getRateIdByMonth(month) {
      const rateEntry = this.aldanFixedRatesStore.data.find((entry) => {
        return (
          moment(entry.date, 'MM/DD/YYYY')
            .locale(this.$i18n.locale)
            .format('MMM') === month
        );
      });
      return rateEntry ? rateEntry.id : null;
    },
    openRateModal(month) {
      this.selectedMonth = month;
      this.showAldanRateModal = true;
    },
    onPositiveClickSubmitForm() {
      this.aldanFixedRateStore.update(this.form.id, this.form).then(() => {
        this.closeRateRouteParams();
      });
    },
    onClickCloseStageModal() {
      this.showAldanRateModal = false;
    },
    closeRateRouteParams() {
      const currentQuery = { ...this.$route.query };
      delete currentQuery.rate_id;
      this.$router.push({ path: this.$route.path, query: currentQuery });
      this.showAldanRateModal = false;
    },
  },
};
</script>

<style scoped>
.clickable-month {
  cursor: pointer;
  color: #007bff;
  text-decoration: underline;
  font-weight: bold;
}

.clickable-month:hover {
  color: #0056b3;
}

.disabled-month {
  cursor: not-allowed;
  color: gray;
  text-decoration: none;
  font-weight: normal;
}
</style>
