<template>
  <div class="header">
    <year-select v-model="selectedYear" :allow-empty="false" />
    <salary-type-select v-model="selectedSalaryType" />
    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import YearSelect from '@/components/YearSelect.vue';
import SalaryTypeSelect from '@/components/SalaryTypeSelect.vue';

export default {
  name: 'FilterHeader',
  components: {
    YearSelect,
    SalaryTypeSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedYear: null,
      selectedSalaryType: null,
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
      const { year, salary_type } = this.$route.query;

      if (year) {
        const yearId = parseInt(year, 10);
        this.selectedYear = { id: yearId, name: `${yearId}` };
      } else {
        this.selectedYear = null;
      }

      if (salary_type) {
        this.selectedSalaryType = salary_type;
      } else {
        this.selectedSalaryType = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.selectedYear) {
        currentQuery.year = this.selectedYear.id;
      } else {
        delete currentQuery.year;
      }

      if (this.selectedSalaryType) {
        currentQuery.salary_type = this.selectedSalaryType;
      } else {
        delete currentQuery.salary_type;
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
