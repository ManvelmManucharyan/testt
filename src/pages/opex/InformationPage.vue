<template>
  <div class="container">
    <filter-header @search="fetchData" />
    <expenses-table />
    <br />
    <totals-table />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useProjectOperationalExpensesStore } from '@/store/projectOperationalExpenses';
import { useOfferOperationalExpensesStore } from '@/store/offerOperationalExpenses';
import { useOfferOpexTotalsStore } from '@/store/offerOpexTotals';
import { useProjectOpexTotalsStore } from '@/store/projectOpexTotals';
import FilterHeader from './components/FilterHeader.vue';
import TotalsTable from './components/TotalsTable.vue';
import ExpensesTable from './components/ExpensesTable.vue';

export default {
  components: {
    FilterHeader,
    TotalsTable,
    ExpensesTable,
  },
  computed: {
    ...mapStores(
      useProjectOpexTotalsStore,
      useProjectOperationalExpensesStore,
      useOfferOperationalExpensesStore,
      useOfferOpexTotalsStore,
    ),
  },
  watch: {
    '$route.query.tab': {
      immediate: false,
      handler(newTab, oldTab) {
        if (newTab !== oldTab) {
          this.fetchData();
        }
      },
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const { tab, project_id, from_date, to_date, offer_id } =
        this.$route.query;

      if (tab === 'project') {
        await this.projectOperationalExpensesStore.fetch(
          project_id,
          from_date,
          to_date,
          true,
        );
        await this.projectOpexTotalsStore.fetch(project_id, from_date, to_date);
      } else {
        await this.offerOperationalExpensesStore.fetch(
          offer_id,
          from_date,
          to_date,
          true,
        );
        await this.offerOpexTotalsStore.fetch(offer_id, from_date, to_date);
      }
    },
  },
};
</script>
