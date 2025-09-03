<template>
  <div class="table">
    <n-data-table
      :columns="columns"
      :data="tableData"
      :max-height="600"
      :scroll-x="1700"
      bordered
    />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useTariffRatesStore } from '@/store/tariffRates';
import { h } from 'vue';
import { formatNumber } from '@/utils/numeric';
import HelpText from '@/components/HelpText.vue';
import { getCustomSettings } from '@/api/customSettings.js';

export default {
  props: {
    roundValues: {
      type: Boolean,
      required: true,
    },
    roundRubValues: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      columns: [],
      roundingStep: 0,
    };
  },
  computed: {
    ...mapStores(useTariffRatesStore),
    tableData() {
      return this.tariffRatesStore.data.map((item) => ({
        id: item.id,
        role: item.role_name,
        rubPerMonth: formatNumber(this.applyRounding(item.rub_per_month, true)),
        rub: {
          value: formatNumber(this.applyRounding(item.rate_rub, true)),
          isSet: false,
        },
        usd: {
          value: formatNumber(this.applyRounding(item.rate_usd)),
          isSet: item.rate_usd_is_set,
        },
        eur: {
          value: formatNumber(this.applyRounding(item.rate_eur)),
          isSet: item.rate_eur_is_set,
        },
        tariff1Rub: {
          value: formatNumber(this.applyRounding(item.cost_rub, true)),
          isSet: item.cost_rub_is_set,
        },
        tariff1Usd: {
          value: formatNumber(this.applyRounding(item.cost_usd)),
          isSet: item.cost_usd_is_set,
        },
        tariff1Eur: {
          value: formatNumber(this.applyRounding(item.cost_eur)),
          isSet: item.cost_eur_is_set,
        },
        tariff2Rub: {
          value: formatNumber(this.applyRounding(item.development_rub, true)),
          isSet: item.development_rub_is_set,
        },
        tariff2Usd: {
          value: formatNumber(this.applyRounding(item.development_usd)),
          isSet: item.development_usd_is_set,
        },
        tariff2Eur: {
          value: formatNumber(this.applyRounding(item.development_eur)),
          isSet: item.development_eur_is_set,
        },
        tariff3Rub: {
          value: formatNumber(this.applyRounding(item.profit_rub, true)),
          isSet: item.profit_rub_is_set,
        },
        tariff3Usd: {
          value: formatNumber(this.applyRounding(item.profit_usd)),
          isSet: item.profit_usd_is_set,
        },
        tariff3Eur: {
          value: formatNumber(this.applyRounding(item.profit_eur)),
          isSet: item.profit_eur_is_set,
        },
      }));
    },
  },
  watch: {
    '$i18n.locale'(newLocale) {
      this.setColumns(newLocale);
    },
  },
  created() {
    this.loadRoundingStep();
    this.setColumns(this.$i18n.locale);
  },
  methods: {
    async loadRoundingStep() {
      if (!this.roundRubValues) return;
      const settingsResponse = await getCustomSettings({
        name: 'RATES_ROUNDING_STEP',
      });
      const roundingSetting = settingsResponse[0];
      this.roundingStep = roundingSetting ? Number(roundingSetting.value) : 0;
    },
    customHeader(title, tooltipKey = null) {
      return h('div', [
        title,
        tooltipKey ? h(HelpText, { text: tooltipKey }) : null,
      ]);
    },
    applyRounding(value, isRub = false) {
      if (this.roundRubValues && isRub && this.roundingStep > 0) {
        return Math.ceil(value / this.roundingStep) * this.roundingStep;
      }
      if (this.roundValues) {
        return Math.round(value);
      }
      return value;
    },

    tariffRateLink(row) {
      return {
        path: this.$route.path,
        query: {
          ...this.$route.query,
          edit_rate: row.id,
        },
      };
    },
    rateSorter(currency) {
      return (row1, row2) => {
        const val1 = Number(row1[currency].value.replace(/\s/g, ''));
        const val2 = Number(row2[currency].value.replace(/\s/g, ''));
        return val1 - val2;
      };
    },
    setColumns() {
      const renderHighlightedCell = (row, key) =>
        h(
          'div',
          {
            style: {
              backgroundColor:
                row[key].isSet && row[key].value !== '0'
                  ? 'lightgreen'
                  : 'transparent',
              padding: '5px',
            },
          },
          row[key].value,
        );
      this.columns = [
        {
          title: this.$t('role'),
          key: 'role',
          fixed: 'left',
          sorter: 'default',
          render: (row) => {
            return h(
              'a',
              {
                href: '#',
                onClick: (event) => {
                  event.preventDefault();
                  this.$router.push(this.tariffRateLink(row));
                },
              },
              row.role,
            );
          },
        },
        {
          title: () =>
            this.customHeader(this.$t('rubPerMonth'), 'rubPerMonthHelpText'),
          key: 'rubPerMonth',
          width: 160,
          sorter: 'default',
        },
        {
          title: () => this.customHeader(this.$t('rub'), 'rubHelpText'),
          key: 'rub',
          sorter: this.rateSorter('rub'),
          render: (row) => renderHighlightedCell(row, 'rub'),
          width: 100,
        },
        {
          title: () => this.customHeader(this.$t('usd'), 'usdHelpText'),
          key: 'usd',
          sorter: this.rateSorter('usd'),
          render: (row) => renderHighlightedCell(row, 'usd'),
          width: 100,
        },
        {
          title: () => this.customHeader(this.$t('eur'), 'eurHelpText'),
          key: 'eur',
          sorter: this.rateSorter('eur'),
          render: (row) => renderHighlightedCell(row, 'eur'),
          width: 100,
        },
        {
          title: this.$t('tariff1Title'),
          key: 'tariff1Title',
          children: [
            {
              title: this.$t('rub'),
              key: 'tariff1Rub',
              sorter: this.rateSorter('rub'),
              render: (row) => renderHighlightedCell(row, 'tariff1Rub'),
              width: 100,
            },
            {
              title: this.$t('usd'),
              key: 'tariff1Usd',
              sorter: this.rateSorter('usd'),
              render: (row) => renderHighlightedCell(row, 'tariff1Usd'),
              width: 100,
            },
            {
              title: this.$t('eur'),
              key: 'tariff1Eur',
              sorter: this.rateSorter('eur'),
              render: (row) => renderHighlightedCell(row, 'tariff1Eur'),
              width: 100,
            },
          ],
        },
        {
          title: this.$t('tariff2Title'),
          key: 'tariff2Title',
          children: [
            {
              title: this.$t('rub'),
              key: 'tariff2Rub',
              sorter: this.rateSorter('rub'),
              render: (row) => renderHighlightedCell(row, 'tariff2Rub'),
              width: 100,
            },
            {
              title: this.$t('usd'),
              key: 'tariff2Usd',
              sorter: this.rateSorter('usd'),
              render: (row) => renderHighlightedCell(row, 'tariff2Usd'),
              width: 100,
            },
            {
              title: this.$t('eur'),
              key: 'tariff2Eur',
              sorter: this.rateSorter('eur'),
              render: (row) => renderHighlightedCell(row, 'tariff2Eur'),
              width: 100,
            },
          ],
        },
        {
          title: this.$t('tariff3Title'),
          key: 'tariff3Title',
          children: [
            {
              title: this.$t('rub'),
              key: 'tariff3Rub',
              sorter: this.rateSorter('rub'),
              render: (row) => renderHighlightedCell(row, 'tariff3Rub'),
              width: 100,
            },
            {
              title: this.$t('usd'),
              key: 'tariff3Usd',
              sorter: this.rateSorter('usd'),
              render: (row) => renderHighlightedCell(row, 'tariff3Usd'),
              width: 100,
            },
            {
              title: this.$t('eur'),
              key: 'tariff3Eur',
              sorter: this.rateSorter('eur'),
              render: (row) => renderHighlightedCell(row, 'tariff3Eur'),
              width: 100,
            },
          ],
        },
      ];
    },
    formatNumber,
  },
};
</script>

<style scoped>
.table {
  max-width: 95%;
  white-space: nowrap;
  border: 1px solid #ddd;
  max-height: 650px;
}
:deep(.n-data-table .n-data-table-td) {
  border-right: 1px solid #ddd;
}
:deep(.n-data-table .n-data-table-td:last-child) {
  border-right: none;
}
:deep(.n-data-table .n-data-table-th) {
  white-space: normal;
  word-wrap: break-word;
  line-height: 1.4;
  padding: 8px;
}
</style>
