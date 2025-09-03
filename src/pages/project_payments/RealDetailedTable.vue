<template>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('realTabName') }}:</span>
    {{ formatNumber(data.employees_total, 1) }}
  </div>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('opex') }}:</span>
    {{ formatNumber(data.opex_total, 1) }}
  </div>
  <n-tabs type="line" animated>
    <n-tab-pane name="real" :tab="$t('realTabName')">
      <real-employees-table
        :data="data.employees"
        :project-id="projectId"
        :date="date"
      />
    </n-tab-pane>
    <n-tab-pane name="opex" :tab="$t('opex')">
      <opex-table :data="data.opex" :offer-id="offerId" :date="date" />
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import { formatNumber } from '@/utils/numeric';
import RealEmployeesTable from './components/RealEmployeesTable.vue';
import OpexTable from './components/OpexTable.vue';

export default {
  name: 'PaymentDetailedTable',
  components: {
    RealEmployeesTable,
    OpexTable,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    offerId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  methods: {
    formatNumber,
  },
};
</script>

<style scoped>
.popover-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 300px;
  font-size: 14px;
  font-family: Arial, sans-serif;
}

.popover-table th,
.popover-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.popover-table thead th {
  background-color: #f7f7f7;
  font-weight: 600;
}

.popover-table tbody tr:nth-child(even) {
  background-color: #fafafa;
}

.popover-table tbody tr:hover {
  background-color: #f0f0f0;
}

.popover-table th {
  color: #333;
}

.popover-table td {
  color: #555;
}

.info {
  font-weight: 550;
}
</style>
