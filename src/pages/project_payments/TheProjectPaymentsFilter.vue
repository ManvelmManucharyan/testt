<template>
  <div class="header">
    <n-date-picker
      v-model:value="rangeDate"
      type="monthrange"
      format="y MMM"
      month-format="MMM"
      :shortcuts="shortcuts"
      :first-day-of-week="0"
      :update-value-on-close="true"
      clearable
      :actions="null"
    />
    <project-select
      :model-value="selectedProjects"
      multiple
      :max="3"
      @update:model-value="handleProjectSelect"
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
  name: 'FilterHeader',
  components: {
    ProjectSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedProjects: [],
      rangeDate: null,
    };
  },
  computed: {
    shortcuts() {
      return {
        [this.$t('thisMonth')]: () => {
          const thisMonth = moment().startOf('month').valueOf();
          return [thisMonth, thisMonth];
        },
        [this.$t('lastMonth')]: () => {
          const lastMonth = moment()
            .subtract(1, 'month')
            .startOf('month')
            .valueOf();
          return [lastMonth, lastMonth];
        },
        [this.$t('thisYear')]: () => {
          const start = moment().startOf('year').valueOf();
          const end = moment().endOf('year').valueOf();
          return [start, end];
        },
        [this.$t('lastYear')]: () => {
          const start = moment().subtract(1, 'year').startOf('year').valueOf();
          const end = moment().subtract(1, 'year').endOf('year').valueOf();
          return [start, end];
        },
      };
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
  mounted() {
    this.initializeSelections();
  },
  methods: {
    handleProjectSelect(selectedProjects) {
      this.selectedProjects = selectedProjects;
    },
    initializeSelections() {
      const { from_date, to_date, project_ids } = this.$route.query;

      if (from_date && to_date) {
        this.rangeDate = [
          new Date(from_date).getTime(),
          new Date(to_date).getTime(),
        ];
      }

      if (project_ids) {
        this.selectedProjects = project_ids;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.rangeDate) {
        currentQuery.from_date = moment(this.rangeDate[0]).format('YYYY-MM');
      } else {
        delete currentQuery.from_date;
      }

      if (this.rangeDate) {
        currentQuery.to_date = moment(this.rangeDate[1]).format('YYYY-MM');
      } else {
        delete currentQuery.to_date;
      }

      currentQuery.project_ids = this.selectedProjects;

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
