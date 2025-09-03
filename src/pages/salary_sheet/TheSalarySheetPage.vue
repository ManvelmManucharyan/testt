<template>
  <div class="container">
    <the-header-filter @search="fetchData" />
    <salary-sheet />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useMonthlyDataStore } from '@/store/monthlyData';
import SalarySheet from './components/SalarySheet.vue';
import TheHeaderFilter from '@/pages/salary_sheet/components/TheHeaderFilter.vue';

export default {
  components: {
    SalarySheet,
    TheHeaderFilter,
  },
  computed: mapStores(useMonthlyDataStore),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const query = { ...this.$route.query };

      if (!query.year) {
        query.year = new Date().getFullYear();
      }

      if (!query.salary_type) {
        query.salary_type = 'gross';
      }

      const orderedQuery = {
        year: query.year,
        ...query,
      };

      await this.$router.replace({ query: orderedQuery });
      await this.monthlyDataStore.fetchMonthlyData({
        year: this.$route.query.year,
        salary_type: this.$route.query.salary_type,
        project: this.$route.query.project_id,
      });
    },
  },
};
</script>
