<template>
  <table class="combined-table">
    <thead>
      <tr>
        <th class="fixed-col fixed-col-1" rowspan="2">
          {{ $t('projectGroupTable.headers.projectUser') }}
        </th>
        <th class="fixed-col fixed-col-8" rowspan="2">
          {{ $t('projectGroupTable.headers.role') }}
        </th>
        <th class="fixed-col fixed-col-2" colspan="2">
          {{ $t('projectGroupTable.headers.workingHoursByProject') }}
        </th>
        <th class="fixed-col fixed-col-6" rowspan="2">
          {{ $t('projectGroupTable.headers.logged') }}
        </th>
        <th
          v-for="date in dateRange"
          :key="date.format()"
          style="z-index: 2; width: 60px"
          rowspan="2"
        >
          <div class="date-header">
            {{ date.format('DD') }}/{{
              date.locale($i18n.locale).format('MMM')
            }}/{{ date.format('YY') }}
          </div>
        </th>
      </tr>
      <tr>
        <th class="hours-fixed-col-1">
          {{ $t('projectGroupTable.headers.byWorkingDays') }}
          <help-text
            style="align-items: center"
            :text="'workingDaysHelpText'"
          />
        </th>
        <th class="hours-fixed-col-2">
          {{ $t('projectGroupTable.headers.byTotalDays') }}
          <help-text style="align-items: center" :text="'totalDaysHelpText'" />
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(project, pIndex) in dataToDisplay" :key="project.key">
        <tr class="project-row">
          <td class="fixed-col fixed-col-1 project-name">
            <router-link :to="projectUrl(project.id)" replace target="_blank">
              {{ project.name }}
            </router-link>
          </td>
          <td class="project-name fixed-col fixed-col-8"></td>
          <td class="fixed-col fixed-col-2 project-name">
            {{ formatHours(project.total_working_hours_by_project) }}
          </td>
          <td class="fixed-col fixed-col-3 project-name">
            {{ formatHours(project.total_hours_by_total_days) }}
          </td>
          <td
            class="fixed-col fixed-col-6"
            :class="
              getCellClass(
                project.total_working_hours_by_project,
                project.total_logged_hours / 3600,
              )
            "
          >
            {{ parseSecondToHours(project.total_logged_hours) }}
          </td>
          <td v-for="date in dateRange" :key="date.format('DD/MMM/YYYY')"></td>
        </tr>
        <template
          v-for="(user, uIndex) in project.employees"
          :key="`project-${pIndex}-user-${uIndex}`"
        >
          <tr>
            <td class="fixed-col fixed-col-1 user-column">
              <employee-avatar :employee="user" :size="20" />
            </td>
            <td class="fixed-col fixed-col-8">
              <template v-if="user.roles && user.roles.length">
                <employee-project-link
                  v-for="roleData in groupedRoles(user.roles)"
                  :key="roleData.name"
                  :role-data="roleData"
                  :offer-id="project.offer_id"
                />
              </template>
              <span v-else>-</span>
            </td>

            <td class="fixed-col fixed-col-2">
              <employee-roles-link
                :employee-id="user.id"
                :project-id="project.id"
                :hours="user.working_hours_by_project"
                :date-range="dateRange"
              />
            </td>
            <td class="fixed-col fixed-col-3">
              <employee-roles-link
                :employee-id="user.id"
                :project-id="project.id"
                :hours="user.working_hours_by_total_days"
                :date-range="dateRange"
              />
            </td>
            <td
              class="fixed-col fixed-col-6"
              :class="
                getCellClass(user.working_hours_by_project, user.logged / 3600)
              "
            >
              {{ parseSecondToHours(user.logged) }}
            </td>
            <td
              v-for="date in dateRange"
              :key="date.format('DD/MMM/YYYY')"
              :class="cellClasses(date.format('DD/MMM/YYYY'), user, project)"
            >
              {{
                user.hours[date.format('YYYY-MM-DD')]
                  ? parseSecondToHours(user.hours[date.format('YYYY-MM-DD')])
                  : '-'
              }}
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
import HelpText from '@/components/HelpText.vue';
import EmployeeRolesLink from './EmployeeRolesLink.vue';
import EmployeeProjectLink from './EmployeeProjectLink.vue';
import EmployeeAvatar from '@/components/EmployeeAvatar.vue';
import { formatHours } from '@/utils/dateUtils';

export default {
  name: 'ProjectGroupTable',
  components: {
    HelpText,
    EmployeeRolesLink,
    EmployeeProjectLink,
    EmployeeAvatar,
  },
  props: {
    dataToDisplay: {
      type: Array,
      required: true,
    },
    dateRange: {
      type: Array,
      required: true,
    },
    parseSecondToHours: {
      type: Function,
      required: true,
    },
    employeeUrl: {
      type: Function,
      required: true,
    },
    projectUrl: {
      type: Function,
      required: true,
    },
    groupedRoles: {
      type: Function,
      required: true,
    },
    cellClasses: {
      type: Function,
      required: true,
    },
    getCellClass: {
      type: Function,
      required: true,
    },
  },
  methods: {
    formatHours,
  },
};
</script>

<style scoped>
.combined-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background-color: #f9f9f9;
}
.combined-table th,
.combined-table td {
  border: 1px solid #ddd;
  padding: 8px;
  white-space: nowrap;
  background-clip: padding-box;
  width: 200px;
}
.combined-table thead tr:nth-child(1) th {
  top: 0;
  z-index: 10;
  height: 20px;
}
.fixed-col {
  position: sticky;
  background-color: #fff;
  z-index: 2;
}
.combined-table th {
  background-color: #f0f0f0;
  position: sticky;
  top: 39px;
  z-index: 10;
  text-wrap: auto;
}
.fixed-col.fixed-col-1 {
  left: 0;
  z-index: 4;
  width: 200px;
}
.fixed-col.fixed-col-8 {
  left: 218px;
  z-index: 4;
  width: 200px;
}
.fixed-col.fixed-col-2 {
  left: 435px;
  z-index: 4;
  width: 245px;
}
.fixed-col.fixed-col-3 {
  left: 565px;
  z-index: 4;
  width: 200px;
}
.fixed-col.fixed-col-6 {
  left: 696px;
  z-index: 4;
  width: 68px;
}
.fixed-col.fixed-col-4 {
  left: 580px;
  z-index: 4;
  width: 200px;
}
thead .fixed-col {
  z-index: 5;
}
.project-row {
  background-color: #e0e0e0;
  font-weight: bold;
  text-align: left;
}
.project-name {
  background-color: #f2f2f2;
  text-align: left;
  padding: 8px;
}
.user-column {
  align-items: center;
}
.role-name {
  margin-left: 5px;
}
.red-background {
  background-color: #e74c3c;
  color: #ffffff;
}
.yellow-background {
  background-color: #f1c40f;
  color: #ffffff;
}
.green-background {
  background-color: #0cb328;
  color: #ffffff;
}
.error {
  background-color: #ffcccc;
  color: #333;
}
.weekend {
  background-color: #c2c7d0;
  color: #ffffff;
}
.vacation {
  background-color: #0d4468;
  color: #ffffff;
}
.date-header {
  font-size: 12px;
}
.combined-table thead tr:nth-child(2) th[data-v-128fe185] {
  top: 39px;
  z-index: 10;
  height: 0;
  position: sticky;
}
.hours-fixed-col-1 {
  left: 435px;
}
.hours-fixed-col-2 {
  left: 565px;
}
</style>
