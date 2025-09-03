<template>
  <div class="container">
    <the-filter @search="fetchData" />
    <div class="rounding-switcher-container">
      <rounding-switcher
        v-model:value="roundValues"
        local-storage-key="roundCurrencyRateValues"
        :label="$t('roundToInteger')"
      />
    </div>
    <currency-rates-table :round-values="roundValues" />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCurrencyRatesStore } from '@/store/currencyRates';
import CurrencyRatesTable from './components/CurrencyRatesTable.vue';
import TheFilter from '@/pages/financial_models/components/TheFilter.vue';
import RoundingSwitcher from '@/components/RoundingSwitcher.vue';

export default {
  components: {
    CurrencyRatesTable,
    TheFilter,
    RoundingSwitcher,
  },
  data() {
    return {
      roundValues: true,
    };
  },
  computed: mapStores(useCurrencyRatesStore),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const query = { ...this.$route.query };
      if (!query.year) {
        query.year = new Date().getFullYear();
      }

      const orderedQuery = {
        year: query.year,
        ...query,
      };

      await this.$router.replace({ query: orderedQuery });
      await this.currencyRatesStore.fetch({ year: this.$route.query.year });
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
}

.rounding-switcher-container {
  position: absolute;
  top: 40px;
  right: 80px;
  z-index: 10;
}
</style>
