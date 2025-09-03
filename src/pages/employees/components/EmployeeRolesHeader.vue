<template>
  <div class="header">
    <project-select v-model="selectedProject" />
    <n-date-picker
      v-model:value="rangeDate"
      type="daterange"
      format="yyyy MMM dd"
      value-format="timestamp"
      month-format="MMM"
      :shortcuts="shortcuts"
      :first-day-of-week="0"
      :update-value-on-close="true"
      clearable
      :actions="null"
    />
    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import ProjectSelect from '@/components/ProjectSelect.vue';

export default {
  name: 'EmployeeRolesFilter',
  components: { ProjectSelect },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedProject: null,
      rangeDate: null,
    };
  },
  computed: {
    shortcuts() {
      return {
        [this.$t('thisMonth')]: () => {
          const thisMonthStart = moment().startOf('month').valueOf();
          const thisMonthEnd = moment().endOf('month').valueOf();
          return [thisMonthStart, thisMonthEnd];
        },
      };
    },
  },
  watch: {
    '$route.query': {
      immediate: true,
      deep: true,
      handler() {
        const { project, from_date, to_date } = this.$route.query;
        this.selectedProject = project ?? null;
        this.rangeDate =
          from_date && to_date
            ? [Date.parse(from_date), Date.parse(to_date)]
            : null;
      },
    },
  },
  methods: {
    async onSearch() {
      const query = { ...this.$route.query };
      this.selectedProject
        ? (query.project = this.selectedProject)
        : delete query.project;

      if (Array.isArray(this.rangeDate) && this.rangeDate.length) {
        query.from_date = moment(this.rangeDate[0]).format('YYYY-MM-DD');
        query.to_date = moment(this.rangeDate[1]).format('YYYY-MM-DD');
      } else {
        delete query.from_date;
        delete query.to_date;
      }

      await this.$router.push({ path: this.$route.path, query });
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
