<template>
  <n-card :title="$t('currencyRates')">
    <n-table bordered>
      <thead>
        <tr>
          <th></th>
          <th v-for="(month, index) in months" :key="month">
            <router-link
              class="clickable-month"
              :class="{ 'disabled-month': isMonthDisabled(month) }"
              :to="rateLink(month)"
              @click.prevent="
                isMonthDisabled(month) ? null : openRateModal(index)
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
          <tr v-if="fieldName === 'eur_aldan_modifier'" class="row-separator">
            <td :colspan="months.length + 1" />
          </tr>
        </template>
      </tbody>
    </n-table>
  </n-card>

  <n-modal
    v-model:show="showRateModal"
    preset="dialog"
    :show-icon="false"
    style="width: 35%"
    transform-origin="center"
    @close="onClickCloseStageModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="modalTitle"
    >
      <currency-rate-form v-model="form" />
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
import { useCurrencyRatesStore } from '@/store/currencyRates';
import { useCurrencyRateStore } from '@/store/currencyRate';
import CurrencyRateForm from './CurrencyRateForm.vue';
import { formatNumber } from '@/utils/numeric';
import HelpText from '@/components/HelpText.vue';
export default {
  name: 'MonthlyCurrencyRates',
  components: { CurrencyRateForm, HelpText },
  props: {
    roundValues: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showRateModal: false,
      selectedMonth: '',
      form: {},
    };
  },

  computed: {
    ...mapStores(useCurrencyRatesStore, useCurrencyRateStore),
    months() {
      return Array.from({ length: 12 }, (_, i) =>
        moment().locale(this.$i18n.locale).month(i).format('MMM'),
      );
    },
    transformedData() {
      const rawData = this.currencyRatesStore.data;
      const months = this.months;

      const roundIfNeeded = (value) => {
        if (value === null) return value;
        return this.roundValues ? Math.round(value) : value;
      };

      const structuredData = {
        usd_aldan_modifier: Object.fromEntries(months.map((m) => [m, null])),
        eur_aldan_modifier: Object.fromEntries(months.map((m) => [m, null])),
        usd_average_rate: Object.fromEntries(months.map((m) => [m, null])),
        eur_average_rate: Object.fromEntries(months.map((m) => [m, null])),
        usd_aldan_rate: Object.fromEntries(months.map((m) => [m, null])),
        eur_aldan_rate: Object.fromEntries(months.map((m) => [m, null])),
      };

      rawData.forEach((entry) => {
        const month = moment(entry.date, 'MM/DD/YYYY')
          .locale(this.$i18n.locale)
          .format('MMM');

        structuredData.usd_average_rate[month] = formatNumber(
          roundIfNeeded(entry.usd_average_rate),
        );
        structuredData.eur_average_rate[month] = formatNumber(
          roundIfNeeded(entry.eur_average_rate),
        );
        structuredData.usd_average_rate.helpText = 'help_text_usd_average_rate';
        structuredData.eur_average_rate.helpText = 'help_text_eur_average_rate';

        structuredData.usd_aldan_modifier[month] = formatNumber(
          roundIfNeeded(entry.usd_aldan_modifier),
        );
        structuredData.usd_aldan_modifier.helpText =
          'help_text_usd_aldan_modifier';
        structuredData.eur_aldan_modifier[month] = formatNumber(
          roundIfNeeded(entry.eur_aldan_modifier),
        );
        structuredData.eur_aldan_modifier.helpText =
          'help_text_eur_aldan_modifier';

        structuredData.usd_aldan_rate[month] = formatNumber(
          roundIfNeeded(entry.usd_aldan_rate),
        );
        structuredData.usd_aldan_rate.helpText = 'help_text_usd_aldan_rate';
        structuredData.eur_aldan_rate[month] = formatNumber(
          roundIfNeeded(entry.eur_aldan_rate),
        );
        structuredData.eur_aldan_rate.helpText = 'help_text_eur_aldan_rate';
      });

      return structuredData;
    },

    modalTitle() {
      return `${this.$t('edit_currency_rate')} ${moment()
        .month(this.selectedMonth)
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
          this.showRateModal = true;
          const rateId = this.$route.query.rate_id;
          await this.currencyRateStore.fetch(rateId);
          this.form = this.currencyRateStore.data;
        }
      },
    },
    '$route.query.tab': {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.showRateModal = false;
        }
      },
    },
    showRateModal(newVal) {
      if (!newVal) {
        this.closeRateRouteParams();
      }
    },
  },
  methods: {
    formatFieldName(fieldName) {
      return fieldName
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

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
      const rateEntry = this.currencyRatesStore.data.find((entry) => {
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
      this.showRateModal = true;
    },

    onPositiveClickSubmitForm() {
      this.currencyRateStore.update(this.form.id, this.form).then(() => {
        this.closeRateRouteParams();
      });
    },

    onClickCloseStageModal() {
      this.showRateModal = false;
    },

    closeRateRouteParams() {
      const currentQuery = { ...this.$route.query };
      delete currentQuery.rate_id;
      this.$router.push({ path: this.$route.path, query: currentQuery });
      this.form = {};
      this.showRateModal = false;
    },
    formatNumber,
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

.row-separator td {
  padding: 0;
  height: 25px;
}
</style>
