<template>
  <button class="export-btn" @click="exportData">
    {{ $t('controls.buttons.export') }}
  </button>
</template>

<script>
import * as XLSX from 'xlsx';
import { writeFile } from 'xlsx';
import moment from 'moment';
import { useMonthlyDataStore } from '@/store/monthlyData';
import { mapStores } from 'pinia';

export default {
  computed: {
    ...mapStores(useMonthlyDataStore),

    dateRange() {
      return Array.from({ length: 12 }, (_, i) =>
        moment().month(i).format('MMM'),
      );
    },

    employeeData() {
      const employees = {};

      this.monthlyDataStore.data.forEach((entry) => {
        const employeeName = entry.employee_name;
        if (!employees[employeeName]) {
          employees[employeeName] = {};
          this.dateRange.forEach((month) => {
            employees[employeeName][month] = {
              employment_type_name: '-',
              calculated_remuneration: '-',
              currency: '-',
            };
          });
        }
      });

      this.monthlyDataStore.data.forEach((entry) => {
        const employeeName = entry.employee_name;
        const month = moment(entry.date, 'MM/DD/YYYY').format('MMM');

        employees[employeeName][month] = {
          employment_type_name: entry.employment_type_name || '-',
          calculated_remuneration: this.formatAmount(
            entry.calculated_remuneration,
          ),
          currency: entry.currency || '-',
        };
      });

      return employees;
    },
  },
  methods: {
    formatAmount(amount) {
      if (!amount || amount === '-') return '-';

      return amount === '###' ? '###' : Number(amount).toFixed(2);
    },

    async exportData() {
      const wb = XLSX.utils.book_new();
      const wsData = this.generateWorksheetData();
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      this.setColumnWidths(ws);
      this.setStyles(ws);

      XLSX.utils.book_append_sheet(wb, ws, 'Salary Sheet');
      const fileName = `salary_sheet_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      writeFile(wb, fileName);
    },

    generateWorksheetData() {
      const headerRow = ['Employee'];
      this.dateRange.forEach((month) => {
        headerRow.push(`${month} Type`, `${month} Amount`, `${month} Currency`);
      });

      const rows = Object.entries(this.employeeData).map(
        ([employeeName, monthlyData]) => {
          const row = [employeeName];

          this.dateRange.forEach((month) => {
            const monthData = monthlyData[month] || {
              employment_type_name: '-',
              calculated_remuneration: '-',
              currency: '-',
            };

            row.push(
              monthData.employment_type_name,
              monthData.calculated_remuneration,
              monthData.currency,
            );
          });

          return row;
        },
      );

      return [headerRow, ...rows];
    },

    setColumnWidths(ws) {
      ws['!cols'] = [
        { wch: 25 },
        ...Array(this.dateRange.length * 3)
          .fill()
          .map((_, index) => ({
            wch: index % 3 === 0 ? 15 : index % 3 === 1 ? 12 : 10,
          })),
      ];
    },

    setStyles(ws) {
      const range = XLSX.utils.decode_range(ws['!ref']);
      const headerStyle = {
        fill: {
          fgColor: { rgb: 'DCE6F1' },
          patternType: 'solid',
        },
      };

      for (let C = range.s.c; C <= range.e.c; C++) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
        ws[headerCell].s = headerStyle;
      }
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
