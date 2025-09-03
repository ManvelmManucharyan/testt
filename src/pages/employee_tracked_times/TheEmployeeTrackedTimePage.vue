<template>
  <div class="time-logging-table">
    <controls-view
      :from-date="fromDate"
      :to-date="toDate"
      :group-by="group_by"
      :selected-project-ids="project_ids"
      :selected-employee-ids="employee_ids"
      @update-date-range="updateDateRange"
      @update-project-ids="updateProjectIds"
      @update-employee-ids="updateEmployeeIds"
      @update-group-by="updateGroupBy"
    />
    <div class="table-container">
      <combined-table
        v-if="!isLoading"
        :group-by="group_by"
        :data-to-display="dataToDisplay"
        :from-date="fromDate"
        :to-date="toDate"
      />
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useEmployeeTrackedTimeStore } from '@/store/employeeTrackedTime';
import moment from 'moment';
import ControlsView from './components/Controls.vue';
import { getLocalStorageKey, setLocalStorageKey } from '@/utils/localStorage';
import CombinedTable from './components/CombinedTable.vue';

export default {
  components: {
    ControlsView,
    CombinedTable,
  },
  data() {
    const initialGroupBy =
      this.$route.query.group_by ||
      getLocalStorageKey('tracked_time_group_by') ||
      'user';
    const defaultFromDate =
      moment().date() === 1 || moment().date() === 2
        ? moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
        : moment().startOf('month').format('YYYY-MM-DD');
    const defaultToDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const fromDate =
      this.$route.query.from_date ||
      getLocalStorageKey('tracked_time_from_date') ||
      defaultFromDate;
    const toDate =
      this.$route.query.to_date ||
      getLocalStorageKey('tracked_time_to_date') ||
      defaultToDate;
    let project_ids =
      this.$route.query.project_ids ||
      getLocalStorageKey('tracked_time_project_ids') ||
      null;
    if (project_ids && typeof project_ids === 'string') {
      project_ids = project_ids.split(',');
    }

    let employee_ids =
      this.$route.query.employee_ids ||
      getLocalStorageKey('tracked_time_employee_ids') ||
      null;
    if (employee_ids && typeof employee_ids === 'string') {
      employee_ids = employee_ids.split(',');
    }

    return {
      fromDate,
      toDate,
      group_by: initialGroupBy,
      project_ids,
      employee_ids,
    };
  },
  computed: {
    ...mapStores(useEmployeeTrackedTimeStore),
    dataToDisplay() {
      return this.employeeTrackedTimeStore.structuredData({
        group_by: this.group_by,
      });
    },
    isLoading() {
      return this.employeeTrackedTimeStore.isLoading;
    },
  },
  watch: {
    fromDate() {
      this.fetchDataAndUpdate();
    },
    toDate() {
      this.fetchDataAndUpdate();
    },
    project_ids() {
      this.fetchDataAndUpdate();
    },
    employee_ids() {
      this.fetchDataAndUpdate();
    },
    group_by() {
      this.fetchDataAndUpdate();
    },
    '$route.query.group_by'(newVal) {
      if (newVal) {
        this.group_by = newVal;
      } else {
        this.group_by = getLocalStorageKey('tracked_time_group_by') || 'user';
      }
    },
    '$route.query.from_date'(newVal) {
      if (newVal) {
        this.fromDate = newVal;
      } else {
        this.fromDate =
          getLocalStorageKey('tracked_time_from_date') ||
          moment().startOf('month').format('YYYY-MM-DD');
      }
    },
    '$route.query.to_date'(newVal) {
      if (newVal) {
        this.toDate = newVal;
      } else {
        this.toDate =
          getLocalStorageKey('tracked_time_to_date') ||
          moment().subtract(1, 'day').format('YYYY-MM-DD');
      }
    },
    '$route.query.project_ids'(newVal) {
      if (newVal) {
        this.project_ids = Array.isArray(newVal) ? newVal : newVal.split(',');
      } else {
        const localProjectIds = getLocalStorageKey('tracked_time_project_ids');
        this.project_ids =
          localProjectIds && typeof localProjectIds === 'string'
            ? localProjectIds.split(',')
            : localProjectIds || null;
      }
    },
    '$route.query.employee_ids'(newVal) {
      if (newVal) {
        this.employee_ids = Array.isArray(newVal) ? newVal : newVal.split(',');
      } else {
        const localEmployeeIds = getLocalStorageKey(
          'tracked_time_employee_ids',
        );
        this.employee_ids =
          localEmployeeIds && typeof localEmployeeIds === 'string'
            ? localEmployeeIds.split(',')
            : localEmployeeIds || null;
      }
    },
  },
  async mounted() {
    this.syncStateFromLocalStorage();
    await this.fetchDataAndUpdate();
  },
  methods: {
    syncStateFromLocalStorage() {
      if (!this.$route.query.group_by) {
        this.group_by =
          getLocalStorageKey('tracked_time_group_by') || this.group_by;
      }
      if (!this.$route.query.from_date) {
        this.fromDate =
          getLocalStorageKey('tracked_time_from_date') || this.fromDate;
      }
      if (!this.$route.query.to_date) {
        this.toDate = getLocalStorageKey('tracked_time_to_date') || this.toDate;
      }
      if (!this.$route.query.project_ids) {
        const localProjectIds = getLocalStorageKey('tracked_time_project_ids');
        this.project_ids =
          localProjectIds && typeof localProjectIds === 'string'
            ? localProjectIds.split(',')
            : localProjectIds || this.project_ids;
      }
      if (!this.$route.query.employee_ids) {
        const localEmployeeIds = getLocalStorageKey(
          'tracked_time_employee_ids',
        );
        this.employee_ids =
          localEmployeeIds && typeof localEmployeeIds === 'string'
            ? localEmployeeIds.split(',')
            : localEmployeeIds || this.employee_ids;
      }
    },
    updateLocalStorage() {
      setLocalStorageKey('tracked_time_from_date', this.fromDate);
      setLocalStorageKey('tracked_time_to_date', this.toDate);
      setLocalStorageKey('tracked_time_group_by', this.group_by);
      setLocalStorageKey(
        'tracked_time_project_ids',
        this.project_ids ? this.project_ids.join(',') : null,
      );
      setLocalStorageKey(
        'tracked_time_employee_ids',
        this.employee_ids ? this.employee_ids.join(',') : null,
      );
    },
    async updateURL() {
      const projectIds = this.project_ids
        ? Array.isArray(this.project_ids)
          ? this.project_ids
          : this.project_ids.split(',')
        : null;
      const employeeIds = this.employee_ids
        ? Array.isArray(this.employee_ids)
          ? this.employee_ids
          : this.employee_ids.split(',')
        : null;

      const query = {
        group_by: this.group_by,
        from_date: this.fromDate,
        to_date: this.toDate,
        project_ids: projectIds ? projectIds.join(',') : undefined,
        employee_ids: employeeIds ? employeeIds.join(',') : undefined,
      };
      if (
        JSON.stringify(query) !==
        JSON.stringify({
          group_by: this.$route.query.group_by,
          from_date: this.$route.query.from_date,
          to_date: this.$route.query.to_date,
          project_ids: this.$route.query.project_ids,
          employee_ids: this.$route.query.employee_ids,
        })
      ) {
        await this.$router.replace({
          path: this.$route.path,
          query,
        });
      }
    },
    async fetchData() {
      const params = {
        fromDate: this.fromDate,
        toDate: this.toDate,
        project_ids: this.project_ids,
        employee_ids: this.employee_ids,
      };
      await this.employeeTrackedTimeStore.fetch(params);
    },
    updateDateRange({ fromDate, toDate }) {
      this.fromDate = moment(fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      this.toDate = moment(toDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    },
    updateProjectIds(ids) {
      this.project_ids = ids;
    },
    updateEmployeeIds(ids) {
      this.employee_ids = ids;
    },
    updateGroupBy(newGroupBy) {
      this.group_by = newGroupBy;
    },
    async fetchDataAndUpdate() {
      this.updateLocalStorage();
      await this.updateURL();
      await this.fetchData();
    },
  },
};
</script>
