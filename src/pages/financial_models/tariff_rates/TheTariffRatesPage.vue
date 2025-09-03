<template>
  <div class="container">
    <year-month-filter @search="fetchData" />
    <div class="button-container">
      <div class="button-group">
        <rounding-switcher
          v-model:value="roundValues"
          local-storage-key="roundTariffRateValues"
          :label="$t('roundToInteger')"
        />

        <rounding-switcher
          v-model:value="roundRubValues"
          local-storage-key="roundTariffRateRubValues"
          :label="$t('roundRub')"
        />

        <export-button :round-rub="roundRubValues" />

        <add-tariff-rate-button />
      </div>
    </div>
    <tariff-rates-table
      :round-values="roundValues"
      :round-rub-values="roundRubValues"
    />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import YearMonthFilter from '@/pages/financial_models/tariff_rates/components/YearMonthFilter.vue';
import TariffRatesTable from '@/pages/financial_models/tariff_rates/components/TariffRatesTable.vue';
import AddTariffRateButton from './buttons/AddTariffRateButton.vue';
import RoundingSwitcher from '@/components/RoundingSwitcher.vue';
import ExportButton from './buttons/ExportButton.vue';
import { useTariffRatesStore } from '@/store/tariffRates';

export default {
  components: {
    YearMonthFilter,
    TariffRatesTable,
    AddTariffRateButton,
    RoundingSwitcher,
    ExportButton,
  },
  data() {
    return {
      roundValues: true,
      roundRubValues: true,
    };
  },
  computed: mapStores(useTariffRatesStore),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const query = { ...this.$route.query };
      const now = new Date();

      if (!query.year) {
        query.year = now.getFullYear();
      }

      if (!query.month) {
        query.month = now.getMonth() + 1;
      }

      const orderedQuery = {
        year: query.year,
        month: query.month,
        ...query,
      };

      await this.$router.replace({ query: orderedQuery });
      await this.tariffRatesStore.fetch({
        year: query.year,
        month: query.month,
      });
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  position: absolute;
  right: 120px;
}

.button-group {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
