<template>
  <div>
    <div v-if="isLoading" class="loading-indicator">{{ $t('loading') }}</div>

    <div v-else class="tables-wrapper">
      <div class="table-container">
        <n-table size="small" class="naive-table">
          <n-thead>
            <n-tr>
              <n-th colspan="2">
                {{ $t('totalAmountGroupedByCurrencyOfDenomination') }}
              </n-th>
            </n-tr>
            <n-tr>
              <n-th>{{ $t('amount') }}</n-th>
              <n-th>{{ $t('currency') }}</n-th>
            </n-tr>
          </n-thead>
          <n-tbody>
            <n-tr
              v-for="(totalData, index) in totalsGroupedByCurrency"
              :key="index"
            >
              <n-td data-label="Amount">{{ formatAmount(totalData[1]) }}</n-td>
              <n-td data-label="Currency">{{ totalData[0] }}</n-td>
            </n-tr>
          </n-tbody>
        </n-table>
      </div>

      <div class="table-container">
        <n-table size="small" class="naive-table">
          <n-thead>
            <n-tr>
              <n-th colspan="2">
                {{ $t('totalAmountInAllCurrenciesConvertedTo') }}
              </n-th>
            </n-tr>
            <n-tr>
              <n-th>{{ $t('amount') }}</n-th>
              <n-th>{{ $t('currency') }}</n-th>
            </n-tr>
          </n-thead>
          <n-tbody>
            <n-tr v-for="(totalData, index) in convertedTotals" :key="index">
              <n-td data-label="Amount">{{ formatAmount(totalData[1]) }}</n-td>
              <n-td data-label="Currency">{{ totalData[0] }}</n-td>
            </n-tr>
          </n-tbody>
        </n-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useProjectOpexTotalsStore } from '@/store/projectOpexTotals';
import { useOfferOpexTotalsStore } from '@/store/offerOpexTotals';

export default {
  name: 'TotalsTable',
  computed: {
    ...mapStores(useProjectOpexTotalsStore, useOfferOpexTotalsStore),
    activeTab() {
      return this.$route.query.tab;
    },
    currentStore() {
      return this.activeTab === 'project'
        ? this.projectOpexTotalsStore
        : this.offerOpexTotalsStore;
    },
    isLoading() {
      if (this.activeTab === 'project') {
        return this.projectOpexTotalsStore.isLoading;
      } else {
        return this.offerOpexTotalsStore.isLoading;
      }
    },
    totalsGroupedByCurrency() {
      return this.currentStore.data.totals_grouped_by_currency;
    },
    convertedTotals() {
      return this.currentStore.data.converted_totals;
    },
  },
  methods: {
    formatAmount(amount) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) return this.$t('invalidAmount');
      return parsedAmount.toLocaleString();
    },
  },
};
</script>

<style scoped>
.tables-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
}

.table-container {
  flex: 1;
  min-width: 300px;
  overflow-x: auto;
}

.loading-indicator {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
  padding: 20px 0;
}
</style>
