<template>
  <div>
    <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>
    <div v-else class="table-container" :style="thHeightStyle">
      <user-group-table
        v-if="groupBy === 'user'"
        :data-to-display="dataToDisplay"
        :date-range="dateRange"
        :parse-second-to-hours="parseSecondToHours"
        :employee-url="employeeUrl"
        :project-url="projectUrl"
        :grouped-roles="groupedRoles"
        :cell-classes="cellClasses"
        :get-cell-class="getCellClass"
      />
      <project-group-table
        v-else-if="groupBy === 'project'"
        :data-to-display="dataToDisplay"
        :date-range="dateRange"
        :parse-second-to-hours="parseSecondToHours"
        :employee-url="employeeUrl"
        :project-url="projectUrl"
        :grouped-roles="groupedRoles"
        :cell-classes="cellClasses"
        :get-cell-class="getCellClass"
      />
      <department-group-table
        v-else-if="groupBy === 'department'"
        :data-to-display="dataToDisplay"
        :date-range="dateRange"
        :parse-second-to-hours="parseSecondToHours"
        :employee-url="employeeUrl"
        :project-url="projectUrl"
        :grouped-roles="groupedRoles"
        :cell-classes="cellClasses"
        :get-cell-class="getCellClass"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useHolidaysStore } from '@/store/holidays';
import { parseSecondToHours } from '@/utils/dateUtils';
import UserGroupTable from './UserGroupTable.vue';
import ProjectGroupTable from './ProjectGroupTable.vue';
import DepartmentGroupTable from './DepartmentGroupTable.vue';

export default {
  name: 'CombinedTable',
  components: {
    UserGroupTable,
    ProjectGroupTable,
    DepartmentGroupTable,
  },
  props: {
    groupBy: {
      type: String,
      required: true,
      validator: (value) => ['user', 'project', 'department'].includes(value),
    },
    dataToDisplay: {
      type: Array,
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapStores(useHolidaysStore),
    isLoading() {
      return this.holidaysStore.isLoading;
    },
    thHeight() {
      return this.groupBy === 'project' ? 30 : 73;
    },
    thHeightStyle() {
      return {
        '--th-height': this.thHeight + 'px',
      };
    },
    dateRange() {
      const dates = [];
      let currentDate = moment(this.fromDate);
      const endDate = moment(this.toDate);
      while (currentDate.isSameOrBefore(endDate)) {
        dates.push(currentDate.clone());
        currentDate.add(1, 'days');
      }
      return dates;
    },
  },
  watch: {
    fromDate() {
      this.fetchHolidays();
    },
    toDate() {
      this.fetchHolidays();
    },
  },
  async created() {
    await this.fetchHolidays();
  },
  methods: {
    async fetchHolidays() {
      const startDate = moment(this.fromDate);
      const endDate = moment(this.toDate);
      const months = [];
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate, 'month')) {
        months.push({
          year: currentDate.year(),
          month: currentDate.month() + 1,
        });
        currentDate.add(1, 'month');
      }
      for (const { year } of months) {
        await this.holidaysStore.fetch(year);
      }
    },
    cellClasses(displayDate, user) {
      return [
        { weekend: this.isWeekend(displayDate) },
        { vacation: this.isVacation(user, displayDate) },
      ];
    },
    isWeekend(dateStr) {
      const date = moment(dateStr, 'DD/MMM/YYYY');
      const formattedDate = date.format('MM/DD/YYYY');
      const holiday = this.holidaysStore.data.find(
        (d) => d.date === formattedDate,
      );
      return holiday ? holiday.is_holiday : false;
    },
    isVacation(user, dateStr) {
      if (
        (!user.vacation_days || user.vacation_days.length === 0) &&
        (!user.sick_leave_days || user.sick_leave_days.length === 0)
      )
        return false;

      const date = moment(dateStr, 'DD/MMM/YYYY');

      const isOnLeave = (
        leaveList,
        fromKey = 'from_timestamp',
        toKey = 'to_timestamp',
      ) =>
        leaveList?.some((leave) => {
          const from = moment(leave[fromKey]).startOf('day');
          const to = moment(leave[toKey]).endOf('day');
          return date.isBetween(from, to, 'day', '[]');
        });

      return (
        isOnLeave(user.vacation_days) ||
        isOnLeave(user.sick_leave_days, 'from_date', 'to_date')
      );
    },
    employeeUrl(employeeId) {
      return {
        name: 'employees-page-detail',
        params: {
          employeeId: employeeId,
        },
      };
    },
    projectUrl(projectId) {
      return {
        name: 'projects-page-detail',
        params: {
          projectId: projectId,
        },
      };
    },
    getCellClass(firstValue, secondValue) {
      const difference = firstValue - secondValue;
      if (difference >= 16) {
        return 'red-background';
      } else if (difference >= 10) {
        return 'yellow-background';
      } else if (difference <= -16) {
        return 'green-background';
      }
      return '';
    },
    groupedRoles(roles) {
      const roleMap = {};
      roles.forEach((r) => {
        if (!r || !r.name || !r.load || !r.id) return;
        if (!roleMap[r.name]) {
          roleMap[r.name] = [];
        }
        roleMap[r.name].push({
          id: r.id,
          load: r.load,
          offerStageDepartmentRole: r.offerStageDepartmentRole,
        });
      });

      return Object.keys(roleMap).map((roleName) => ({
        name: roleName,
        entries: roleMap[roleName],
      }));
    },
    parseSecondToHours,
  },
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  max-height: 700px;
  overflow-y: auto;
  position: relative;
}
.loading {
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
}
</style>
