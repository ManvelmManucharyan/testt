<template>
  <div class="header">
    <year-select v-model="selectedYear" :allow-empty="false" />
    <month-select v-model="selectedMonth" :allow-empty="false" />
    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import YearSelect from '@/components/YearSelect.vue';
import MonthSelect from '@/components/MonthSelect.vue';

export default {
  name: 'YearMonthFilter',
  components: {
    YearSelect,
    MonthSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedYear: null,
      selectedMonth: null,
    };
  },
  watch: {
    '$route.query': {
      handler() {
        this.initializeSelections();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initializeSelections();
  },
  methods: {
    initializeSelections() {
      const { year, month } = this.$route.query;

      if (year) {
        const yearId = parseInt(year, 10);
        this.selectedYear = { id: yearId, name: `${yearId}` };
      } else {
        this.selectedYear = null;
      }
      if (month) {
        const monthId = parseInt(month, 10);
        const monthName = moment.months()[monthId - 1];
        this.selectedMonth = { id: monthId, name: monthName };
      } else {
        this.selectedMonth = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.selectedYear) {
        currentQuery.year = this.selectedYear.id;
      } else {
        delete currentQuery.year;
      }

      if (this.selectedMonth) {
        currentQuery.month = this.selectedMonth.id;
      } else {
        delete currentQuery.month;
      }

      await this.$router.push({
        path: this.$route.path,
        query: currentQuery,
      });

      this.$emit('search');
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
</style>
