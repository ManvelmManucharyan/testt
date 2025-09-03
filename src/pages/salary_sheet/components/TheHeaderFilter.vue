<template>
  <div class="header">
    <year-select v-model="selectedYear" :allow-empty="false" />
    <monthly-salary-type-select
      v-model="selectedSalaryType"
      :allow-empty="false"
    />
    <project-select v-model="selectedProject" />
    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
    <div class="export-container">
      <export-button></export-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import YearSelect from '@/components/YearSelect.vue';
import MonthlySalaryTypeSelect from '@/components/MonthlySalaryTypeSelect.vue';
import ProjectSelect from '@/components/ProjectSelect.vue';
import ExportButton from './Export.vue';

export default {
  name: 'FilterHeader',
  components: {
    YearSelect,
    MonthlySalaryTypeSelect,
    ProjectSelect,
    ExportButton,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedYear: null,
      selectedSalaryType: null,
      selectedProject: null,
    };
  },
  computed: {
    activeTab() {
      return this.$route.query.tab;
    },
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
  methods: {
    initializeSelections() {
      const { year, salary_type, project_id } = this.$route.query;

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

      if (project_id) {
        this.selectedProject = project_id;
      } else {
        this.selectedProject = null;
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
      if (this.selectedProject) {
        currentQuery.project_id = this.selectedProject;
      } else {
        delete currentQuery.project_id;
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
  justify-content: space-between;
}

.export-container {
  margin-left: auto;
}
</style>
