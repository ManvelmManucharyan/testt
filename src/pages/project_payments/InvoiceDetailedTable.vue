<template>
  <div>
    <span class="info">{{ $t('tariffRateNotice') }}</span>
    {{ formatSingleDate(tariffRateDate) }}
  </div>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('realTabName') }}:</span>
    {{ formatNumber(data.employees_total, 1) }}
  </div>
  <div>
    <span class="info">{{ $t('overall') }} {{ $t('opex') }}:</span>
    {{ formatNumber(data.opex_total, 1) }}
  </div>
  <n-tabs type="line" animated>
    <n-tab-pane name="roles" :tab="$t('realTabName')">
      <invoice-table
        :data="data.employees"
        :offer-id="offerId"
        :date="date"
        :project-id="projectId"
      />
    </n-tab-pane>
    <n-tab-pane name="opex" :tab="$t('opex')">
      <opex-table :data="data.opex" :offer-id="offerId" :date="date" />
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import { formatNumber } from '@/utils/numeric';
import { formatSingleDate } from '@/utils/time';
import InvoiceTable from './components/InvoiceTable.vue';
import OpexTable from './components/OpexTable.vue';

export default {
  name: 'PaymentDetailedTable',
  components: {
    InvoiceTable,
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
    projectId: {
      type: String,
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
