<template>
  <button class="export-btn" @click="exportData">
    {{ $t('controls.buttons.export') }}
  </button>
</template>

<script>
import * as XLSX from 'xlsx';
import moment from 'moment';
import { getOfferAggregatesDetails } from '@/api/offer';

export default {
  name: 'Export',
  props: {
    offerId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async exportData() {
      const response = await getOfferAggregatesDetails(this.offerId, {});
      const { roles, opex_items } = response;

      const wb = XLSX.utils.book_new();

      const rolesWsData = this.generateRolesWorksheetData(roles);
      const opexItemsWsData = this.generateOpexItemsWorksheetData(opex_items);

      const rolesWs = XLSX.utils.aoa_to_sheet(rolesWsData);
      const opexItemsWs = XLSX.utils.aoa_to_sheet(opexItemsWsData);

      this.setColumnWidths(rolesWs, 'roles', roles);
      this.setColumnWidths(opexItemsWs, 'opexItems');

      XLSX.utils.book_append_sheet(wb, rolesWs, 'Roles');
      XLSX.utils.book_append_sheet(wb, opexItemsWs, 'Opex Items');

      const fileName = `offer_aggregates_${moment().format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
      XLSX.writeFile(wb, fileName);
    },
    generateRolesWorksheetData(roles) {
      const baseHeaders = [
        'Department',
        'Role',
        'Scheduled Load',
        'Total Hours',
        'Working Days',
      ];

      const financialSources =
        roles.length > 0 ? Object.keys(roles[0].fin_sources) : [];
      const finSourceHeaders = financialSources.flatMap((item) => [
        `${item.charAt(0).toUpperCase() + item.slice(1)} Rate`,
        `${item.charAt(0).toUpperCase() + item.slice(1)} Funding Share (%)`,
        `${item.charAt(0).toUpperCase() + item.slice(1)} Cost Contribution`,
      ]);

      const headerRow = [
        ...baseHeaders,
        ...finSourceHeaders,
        'Total Cost per Role',
      ];

      const dataRows = roles.map((role) => {
        const baseData = [
          role.department || '',
          role.role_name || '',
          role.scheduled_load || '',
          role.total_hours,
          role.working_days,
        ];

        const tariffData = financialSources.flatMap((item) => [
          role.fin_sources[item]?.rate || 0,
          role.fin_sources[item]?.funding_share || 0,
          role.fin_sources[item]?.cost_contribution || 0,
        ]);

        return [...baseData, ...tariffData, role.cost_per_role];
      });

      const totalHours = roles.reduce(
        (sum, role) => sum + (Number(role.total_hours) || 0),
        0,
      );
      const totalCost = roles.reduce(
        (sum, role) => sum + (Number(role.cost_per_role) || 0),
        0,
      );

      const totalRowBase = ['', 'Total', '', totalHours, ''];
      const totalRowFinSources = financialSources.flatMap(() => ['', '', '']);
      const totalRow = [...totalRowBase, ...totalRowFinSources, totalCost];

      return [headerRow, ...dataRows, totalRow];
    },
    generateOpexItemsWorksheetData(opexItems) {
      const headerRow = [
        'Currency',
        'Amount',
        'Exchange Rate',
        'Converted Amount',
      ];

      const dataRows = opexItems.map((item) => [
        item.currency || '',
        item.amount,
        item.exchange_rate,
        item.converted_amount,
      ]);

      const totalConverted = opexItems.reduce(
        (sum, item) => sum + (Number(item.converted_amount) || 0),
        0,
      );
      const totalRow = ['', 'Total', '', totalConverted];

      return [headerRow, ...dataRows, totalRow];
    },
    setColumnWidths(ws, type, roles = null) {
      if (type === 'roles') {
        const baseWidths = [
          { wch: 15 },
          { wch: 15 },
          { wch: 15 },
          { wch: 12 },
          { wch: 12 },
        ];
        const financialSources =
          roles && roles.length > 0 ? Object.keys(roles[0].fin_sources) : [];
        const tariffWidths = financialSources.flatMap(() => [
          { wch: 15 },
          { wch: 20 },
          { wch: 20 },
        ]);
        ws['!cols'] = [...baseWidths, ...tariffWidths, { wch: 15 }];
      } else if (type === 'opexItems') {
        ws['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
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
  margin-left: 1300px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 20px;
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
