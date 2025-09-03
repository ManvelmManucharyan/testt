<template>
  <div class="header">
    <employee-activity-select
      v-model="selectedEmployeeActivity"
      :allow-empty="false"
    />

    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import EmployeeActivitySelect from '@/components/EmployeeActivitySelect.vue';
export default {
  name: 'FilterHeader',
  components: {
    EmployeeActivitySelect,
  },
  emits: ['search'],
  data() {
    return {
      selectedEmployeeActivity: null,
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
      const employee_activity = this.$route.query.employee_activity;
      if (employee_activity) {
        this.selectedEmployeeActivity = employee_activity;
      } else {
        this.selectedEmployeeActivity = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };
      if (this.selectedEmployeeActivity) {
        currentQuery.employee_activity = this.selectedEmployeeActivity;
      } else {
        delete currentQuery.employee_activity;
      }
      await this.$router.push({ path: this.$route.path, query: currentQuery });
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
