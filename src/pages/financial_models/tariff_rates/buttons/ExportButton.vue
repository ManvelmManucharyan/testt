<template>
  <button class="export-btn" @click="exportData">
    {{ $t('controls.buttons.export') }}
  </button>
</template>

<script>
import * as XLSX from 'xlsx';
import { writeFile } from 'xlsx';
import moment from 'moment';
import { useTariffRatesStore } from '@/store/tariffRates';
import { useAldanFixedRatesStore } from '@/store/aldanFixedRates';
import { useCurrencyRatesStore } from '@/store/currencyRates';
import { getCustomSettings } from '@/api/customSettings.js';
import { mapStores } from 'pinia';

export default {
  props: {
    roundRub: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      previousMonthUsdFixedRate: 0,
      previousMonthEurFixedRate: 0,
      roundingStep: 0,
      data: null,
    };
  },

  computed: {
    ...mapStores(
      useTariffRatesStore,
      useAldanFixedRatesStore,
      useCurrencyRatesStore,
    ),
  },

  methods: {
    formatNumber(value) {
      return value != null ? parseFloat(value) : '';
    },

    generateWorksheetData() {
      const rate = this.data || {};
      const firstRows = [
        [
          { v: 'Previous month USD Aldan rate', t: 's' },
          { v: this.previousMonthUsdFixedRate, t: 'n' },
        ],
        [
          { v: 'Previous month EUR Aldan rate', t: 's' },
          { v: this.previousMonthEurFixedRate, t: 'n' },
        ],
        [
          { v: 'Personal income tax (%)', t: 's' },
          { v: rate.personal_income_tax, t: 'n' },
        ],
        [
          { v: 'Insurance premiums (%)', t: 's' },
          { v: rate.insurance_premiums, t: 'n' },
        ],
        [
          { v: 'Total expenses', t: 's' },
          { v: rate.total_expenses, t: 'n' },
        ],
        [
          { v: 'Utilization rate (%)', t: 's' },
          { v: rate.utilization_rate, t: 'n' },
        ],
        [
          { v: 'Income flex (%)', t: 's' },
          { v: rate.income_flex, t: 'n' },
        ],
        [
          { v: 'Income fix (%)', t: 's' },
          { v: rate.income_fix, t: 'n' },
        ],
        [
          { v: 'Rates rounding step', t: 's' },
          { v: this.roundingStep, t: 'n' },
        ],
      ];

      const headerRow = [
        'Role',
        'RUB',
        'RUB per Month',
        'USD',
        'EUR',
        'Minimal RUB',
        'Minimal USD',
        'Minimal EUR',
        'Tariff 1 (Cost project) RUB',
        'Tariff 1 (Cost project) USD',
        'Tariff 1 (Cost project) EUR',
        'Tariff 2 (Cost company) RUB',
        'Tariff 2 (Cost company) USD',
        'Tariff 2 (Cost company) EUR',
        'Tariff 3 (Profit) RUB',
        'Tariff 3 (Profit) USD',
        'Tariff 3 (Profit) EUR',
      ];

      const emptyRows = this.tariffRatesStore.data.map(() =>
        Array(18).fill(''),
      );

      return {
        data: [...firstRows, [], headerRow, ...emptyRows],
        headerRowIndex: firstRows.length + 2,
      };
    },

    async exportData() {
      const settingsResponse = await getCustomSettings({
        name: 'RATES_ROUNDING_STEP',
      });
      const roundingSetting = settingsResponse[0];

      this.roundingStep = roundingSetting ? roundingSetting.value : 0;

      const { year, month } = this.$route.query;

      if (!this.aldanFixedRatesStore.data.length) {
        await this.aldanFixedRatesStore.fetch({ year, month });
      }

      const fixedRate = this.aldanFixedRatesStore.data[0];
      this.data = fixedRate;

      const currentMoment = moment(
        `${year}-${String(month).padStart(2, '0')}-01`,
      );

      const prevMoment = currentMoment.clone().subtract(1, 'month');
      const prevYear = prevMoment.year();
      const prevMonth = prevMoment.month();

      const isPrevYearLoaded = this.currencyRatesStore.data.some(
        (rate) => moment(rate.date, 'MM/DD/YYYY').year() === prevYear,
      );

      if (!isPrevYearLoaded) {
        await this.currencyRatesStore.fetch({ year: prevYear });
      }

      const prevRate = this.currencyRatesStore.data.find((rate) => {
        const rateMoment = moment(rate.date, 'MM/DD/YYYY');
        return (
          rateMoment.year() === prevYear && rateMoment.month() === prevMonth
        );
      });

      if (prevRate) {
        this.previousMonthUsdFixedRate = parseFloat(
          prevRate.usd_aldan_rate || 0,
        );
        this.previousMonthEurFixedRate = parseFloat(
          prevRate.eur_aldan_rate || 0,
        );
      }

      const wb = XLSX.utils.book_new();
      const { data: wsData, headerRowIndex } = this.generateWorksheetData();
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      this.setColumnWidths(ws);

      for (let col = 0; col < 18; col++) {
        const colLetter = String.fromCharCode(65 + col);
        const cellRef = `${colLetter}${headerRowIndex + 1}`;
        if (ws[cellRef]) {
          ws[cellRef].s = { font: { bold: true } };
        }
      }

      for (let i = 0; i < this.tariffRatesStore.data.length; i++) {
        const rowIndex = headerRowIndex + 1 + i;
        const item = this.tariffRatesStore.data[i];
        const rubValue = parseFloat(item.rate_rub);

        const makeRef = (col) => `${col}${rowIndex}`;

        const cellMap = {
          role: makeRef('A'),
          grade: makeRef('B'),
          rub: makeRef('C'),
          rubPerMonth: makeRef('D'),
          usd: makeRef('E'),
          eur: makeRef('F'),
          minRub: makeRef('G'),
          minUsd: makeRef('H'),
          minEur: makeRef('I'),
          t1Rub: makeRef('J'),
          t1Usd: makeRef('K'),
          t1Eur: makeRef('L'),
          t2Rub: makeRef('M'),
          t2Usd: makeRef('N'),
          t2Eur: makeRef('O'),
          t3Rub: makeRef('P'),
          t3Usd: makeRef('Q'),
          t3Eur: makeRef('R'),
        };

        const grossBeforeInsurance = `C${rowIndex} / (1 - B3 / 100)`;
        const minimalRubFormula = `${grossBeforeInsurance} + (${grossBeforeInsurance} * B4 / 100)`;

        const grossBeforeInsuranceUsd = `E${rowIndex} / (1 - B3 / 100)`;
        const minimalUsdFormula = `${grossBeforeInsuranceUsd} + (${grossBeforeInsuranceUsd} * B4 / 100)`;

        const grossBeforeInsuranceEur = `F${rowIndex} / (1 - B3 / 100)`;
        const minimalEurFormula = `${grossBeforeInsuranceEur} + (${grossBeforeInsuranceEur} * B4 / 100)`;

        const tariff1RubFormula = `G${rowIndex} + G${rowIndex} * B6 / 100`;

        const tariff1UsdFormula = `ROUND(H${rowIndex} + H${rowIndex} * B6 / 100, 2)`;
        const tariff1EurFormula = `ROUND(I${rowIndex} + I${rowIndex} * B6 / 100, 2)`;

        const tariff2RubFormula = `ROUND(J${rowIndex} + B5 / 1, 2)`;
        const tariff2UsdFormula = `ROUND(K${rowIndex} + B5 / B1, 2)`;
        const tariff2EurFormula = `ROUND(L${rowIndex} + B5 / B2, 2)`;

        const tariff3RubFormula = `M${rowIndex} * (B7 + 100) / 100 + B8 / 1`;

        const tariff3UsdFormula = `ROUND(N${rowIndex} * (B7 + 100) / 100 + B8 / B1, 2)`;
        const tariff3EurFormula = `ROUND(O${rowIndex} * (B7 + 100) / 100 + B8 / B2, 2)`;
        Object.assign(ws, {
          [cellMap.role]: { v: item.role_name },
          [cellMap.grade]: { v: item.role_grade_code },
          [cellMap.rub]: { v: rubValue, t: 'n' },
          [cellMap.rubPerMonth]: { f: `${rubValue} * 160`, v: rubValue * 160 },
          [cellMap.usd]: { f: `ROUND(C${rowIndex} / B1, 2)` },
          [cellMap.eur]: { f: `ROUND(C${rowIndex} / B2, 2)` },
          [cellMap.minRub]: { f: minimalRubFormula },
          [cellMap.minUsd]: { f: minimalUsdFormula },
          [cellMap.minEur]: { f: minimalEurFormula },
          [cellMap.t1Rub]: { f: tariff1RubFormula },
          [cellMap.t1Usd]: { f: tariff1UsdFormula },
          [cellMap.t1Eur]: { f: tariff1EurFormula },
          [cellMap.t2Rub]: { f: tariff2RubFormula },
          [cellMap.t2Usd]: { f: tariff2UsdFormula },
          [cellMap.t2Eur]: { f: tariff2EurFormula },
          [cellMap.t3Rub]: { f: tariff3RubFormula },
          [cellMap.t3Usd]: { f: tariff3UsdFormula },
          [cellMap.t3Eur]: { f: tariff3EurFormula },
        });
      }

      XLSX.utils.book_append_sheet(wb, ws, 'Tariff Rates');

      const fileName = `tariff_rates_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      writeFile(wb, fileName);
    },

    setColumnWidths(ws) {
      ws['!cols'] = [
        { wch: 26 },
        { wch: 6 },
        { wch: 8 },
        { wch: 13 },
        { wch: 7 },
        { wch: 7 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 21 },
        { wch: 21 },
        { wch: 21 },
        { wch: 21 },
        { wch: 23 },
        { wch: 21 },
        { wch: 23 },
        { wch: 23 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
      ];
    },
  },
};
</script>

<style scoped>
.export-btn {
  background-color: #2ecc71;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.export-btn:hover {
  background-color: #27ae60;
}
.export-btn:active {
  transform: scale(0.95);
}
</style>
