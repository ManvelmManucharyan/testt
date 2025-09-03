<template>
  <n-space>
    <n-dropdown
      trigger="click"
      :options="vacationOptions"
      @select="handleSelect"
    >
      <n-button ghost>+ {{ $t('add') }}</n-button>
    </n-dropdown>
  </n-space>

  <div class="header">
    <year-select v-model="selectedYear" :allow-empty="false" />
    <project-select v-model="selectedProject" />
    <employee-select v-model="selectedEmployee" />
    <vacation-type-select v-model="selectedVacationType" />
    <n-button class="btn" @click="onSearch">{{ $t('opexSearch') }}</n-button>
  </div>
</template>

<script>
import moment from 'moment';
import YearSelect from '@/components/YearSelect.vue';
import ProjectSelect from '@/components/ProjectSelect.vue';
import EmployeeSelect from '@/components/EmployeeSelect.vue';
import VacationTypeSelect from '@/components/VacationTypeSelect.vue';

const VACATION_KEYS = ['vacation', 'day-off', 'half-day-off', 'sick-leave'];

export default {
  name: 'FilterHeader',
  components: {
    YearSelect,
    ProjectSelect,
    EmployeeSelect,
    VacationTypeSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedYear: null,
      selectedProject: null,
      selectedEmployee: null,
      selectedVacationType: null,
    };
  },
  computed: {
    vacationOptions() {
      return [
        { label: this.$t('addVacation'), key: 'vacation' },
        { label: this.$t('addDayOff'), key: 'day-off' },
        { label: this.$t('addHalfDayOff'), key: 'half-day-off' },
        { label: this.$t('addSickLeave'), key: 'sick-leave' },
      ];
    },
  },

  created() {
    this.initializeSelections();
  },

  methods: {
    handleSelect(key) {
      if (VACATION_KEYS.includes(key)) {
        this.addVacation(key);
      }
    },

    initializeSelections() {
      const { year, project_id, vacation_type, employee_id } =
        this.$route.query;

      const yearId = year ? Number(year) : new Date().getFullYear();

      this.selectedYear = { id: yearId, name: String(yearId) };
      this.selectedProject = project_id || null;
      this.selectedVacationType = vacation_type || null;
      this.selectedEmployee = employee_id || null;
    },

    async onSearch() {
      const query = { ...this.$route.query };

      this.selectedYear
        ? (query.year = this.selectedYear.id)
        : delete query.year;
      this.selectedProject
        ? (query.project_id = this.selectedProject)
        : delete query.project_id;
      this.selectedVacationType
        ? (query.vacation_type = this.selectedVacationType)
        : delete query.vacation_type;
      this.selectedEmployee
        ? (query.employee_id = this.selectedEmployee)
        : delete query.employee_id;

      await this.$router.push({ path: this.$route.path, query });
      this.$emit('search');
    },

    addVacation(type) {
      const currentQuery = { ...this.$route.query, vacation: type };
      this.$router.push({ path: this.$route.path, query: currentQuery });
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 15px;
  font-size: 14px;
}

.green {
  background-color: green;
  color: white;
}
</style>
