<template>
  <div class="container">
    <the-filter @search="fetchData" />
    <div class="rounding-switcher-container">
      <rounding-switcher
        v-model:value="roundValues"
        local-storage-key="roundAldanFixedRateValues"
        :label="$t('roundToInteger')"
      />
    </div>
    <aldan-fixed-rates-table
      :round-values="roundValues"
      :local-currency-rates="localCurrencyRates"
    />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAldanFixedRatesStore } from '@/store/aldanFixedRates';
import { useCurrencyRatesStore } from '@/store/currencyRates';
import { getCurrencyRates } from '@/api/currencyRates.js';
import AldanFixedRatesTable from './components/AldanFixedRatesTable.vue';
import TheFilter from '@/pages/financial_models/components/TheFilter.vue';
import RoundingSwitcher from '@/components/RoundingSwitcher.vue';

export default {
  components: {
    AldanFixedRatesTable,
    TheFilter,
    RoundingSwitcher,
  },
  data() {
    return {
      roundValues: true,
      localCurrencyRates: [],
    };
  },
  computed: mapStores(useAldanFixedRatesStore, useCurrencyRatesStore),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const query = { ...this.$route.query };

      if (!query.year) {
        query.year = new Date().getFullYear();
      }

      const year = Number(query.year);

      const orderedQuery = {
        year,
        ...query,
      };

      await this.$router.replace({ query: orderedQuery });
      await this.aldanFixedRatesStore.fetch({ year });
      await this.currencyRatesStore.fetch({ year });

      const previousYearRates = await getCurrencyRates({ year: year - 1 });

      this.localCurrencyRates = [
        ...this.currencyRatesStore.data,
        ...previousYearRates,
      ];
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
