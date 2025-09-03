<template>
  <div>
    <span class="info">{{ $t('tariffRateNotice') }}</span>
    {{ formatSingleDate(tariffRateDate) }}
  </div>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('payrollFund') }}:</span>
    {{ formatNumber(data.payroll_fund_total, 1) }}
  </div>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('opex') }}:</span>
    {{ formatNumber(data.opex_total, 1) }}
  </div>
  <n-tabs type="line" animated>
    <n-tab-pane name="roles" :tab="$t('payrollFund')">
      <plan-roles-table :data="data.roles" :offer-id="offerId" :date="date" />
    </n-tab-pane>

    <n-tab-pane name="opex" :tab="$t('opex')">
      <opex-table :data="data.opex" :offer-id="offerId" :date="date" />
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import PlanRolesTable from './components/PlanRolesTable.vue';
import OpexTable from './components/OpexTable.vue';
import { formatSingleDate } from '@/utils/time';
import { formatNumber } from '@/utils/numeric';

export default {
  name: 'PaymentDetailedTable',
  components: {
    PlanRolesTable,
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
    tariffRateDate: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  methods: {
    formatSingleDate,
    formatNumber,
  },
};
</script>

<style scoped>
.info {
  font-weight: 550;
}
</style>
