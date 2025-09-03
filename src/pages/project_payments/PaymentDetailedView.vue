<template>
  <div class="text-center">
    <n-popover v-if="monthlyData" placement="bottom" trigger="click">
      <template #trigger>
        <div style="cursor: pointer">{{ monthlyData }}</div>
      </template>
      <template #default>
        <plan-detailed-table
          v-if="type == 'plan'"
          :data="data"
          :offer-id="offerId"
          :tariff-rate-date="tariffRateDate"
          :date="date"
        />
        <invoice-detailed-table
          v-if="type == 'invoice'"
          :data="data"
          :offer-id="offerId"
          :project-id="projectId"
          :tariff-rate-date="tariffRateDate"
          :date="date"
        />
        <real-detailed-table
          v-if="type == 'real'"
          :data="data"
          :offer-id="offerId"
          :project-id="projectId"
          :date="date"
        />
      </template>
    </n-popover>
  </div>
</template>

<script>
import PlanDetailedTable from './PlanDetailedTable.vue';
import InvoiceDetailedTable from './InvoiceDetailedTable.vue';
import RealDetailedTable from './RealDetailedTable.vue';

export default {
  name: 'PlanDetailedView',
  components: {
    PlanDetailedTable,
    InvoiceDetailedTable,
    RealDetailedTable,
  },
  props: {
    monthlyData: {
      type: [Number, String],
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    offerId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tariffRateDate: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    projectId: {
      type: String,
    },
  },
};
</script>
