<template>
  <table class="combined-table">
    <thead>
      <tr>
        <th class="fixed-col fixed-col-1" rowspan="2">
          {{ $t('userGroupTable.headers.userProject') }}
        </th>
        <th class="fixed-col fixed-col-8" rowspan="2">
          {{ $t('userGroupTable.headers.role') }}
        </th>
        <th style="z-index: 11" class="fixed-col fixed-col-2" colspan="3">
          {{ $t('userGroupTable.headers.hours') }}
        </th>
        <th
          v-for="date in dateRange"
          :key="date.format()"
          class="fixed-col fixed-col-3"
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
        <th class="fixed-col fixed-col-2">
          {{ $t('userGroupTable.headers.workingHoursByProject') }}
          <help-text
            style="align-items: center"
            :text="'workingDaysHelpText'"
          />
        </th>
        <th class="fixed-col fixed-col-3">
          {{ $t('userGroupTable.headers.workingHoursByContract') }}
          <help-text
            style="align-items: center"
            :text="'workingDaysByContractHelpText'"
          />
        </th>
        <th class="fixed-col fixed-col-4">
          {{ $t('userGroupTable.headers.logged') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(user, uIndex) in dataToDisplay" :key="`user-${uIndex}`">
        <tr class="project-row">
          <td class="project-name fixed-col fixed-col-1">
            <div class="user-info">
              <employee-avatar :employee="user" :size="20" />
            </div>
          </td>
          <td class="project-name fixed-col fixed-col-8"></td>
          <td
            class="fixed-col fixed-col-2"
            :class="
              getCellClass(
                user.working_hours_by_contract,
                user.total_working_hours_by_project,
              )
            "
          >
            {{
              user.total_working_hours_by_project
                ? formatHours(user.total_working_hours_by_project)
                : '-'
            }}
          </td>
          <td class="fixed-col fixed-col-3 total-hours">
            {{
              user.working_hours_by_contract
                ? formatHours(user.working_hours_by_contract)
                : '-'
            }}
          </td>
          <td
            class="fixed-col fixed-col-4"
            :class="
              getCellClass(
                user.working_hours_by_contract,
                user.total_logged_hours / 3600,
              )
            "
          >
            {{
              user.total_logged_hours
                ? parseSecondToHours(user.total_logged_hours)
                : '-'
            }}
          </td>
          <td v-for="date in dateRange" :key="date.format('DD/MMM/YYYY')"></td>
        </tr>
        <template
          v-for="(project, pIndex) in user.projects"
          :key="`user-${uIndex}-project-${pIndex}`"
        >
          <tr>
            <td class="fixed-col fixed-col-1 user-column">
              <router-link :to="projectUrl(project.id)" replace target="_blank">
                {{ project.name }}
              </router-link>
            </td>
            <td
              class="fixed-col fixed-col-8"
              :class="{ error: !project.roles }"
            >
              <template v-if="project.roles && project.roles.length">
                <employee-project-link
                  v-for="roleData in groupedRoles(project.roles)"
                  :key="roleData.name"
                  :role-data="roleData"
                  :offer-id="project.offerId"
                />
              </template>
              <span v-else>-</span>
            </td>
            <td class="fixed-col fixed-col-2">
              <employee-roles-link
                :employee-id="user.id"
                :project-id="project.id"
                :hours="project.working_hours_by_project"
                :date-range="dateRange"
              />
            </td>
            <td class="fixed-col fixed-col-3"></td>
            <td class="fixed-col fixed-col-4">
              {{ project.logged ? parseSecondToHours(project.logged) : '-' }}
            </td>
            <td
              v-for="date in dateRange"
              :key="date.format('DD/MMM/YYYY')"
              :class="cellClasses(date.format('DD/MMM/YYYY'), user, project)"
            >
              {{
                project.hours[date.format('YYYY-MM-DD')]
                  ? parseSecondToHours(project.hours[date.format('YYYY-MM-DD')])
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
  name: 'UserGroupTable',
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
.combined-table thead tr:nth-child(2) th {
  top: 40px;
  z-index: 10;
  height: 20px;
}
.fixed-col {
  position: sticky;
  background-color: #fff;
  z-index: 2;
}
.combined-table th {
  height: 90px;
  background-color: #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 3;
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
  width: 315px;
}
.fixed-col.fixed-col-3 {
  left: 545px;
  z-index: 4;
  width: 80px;
}
.fixed-col.fixed-col-6 {
  left: 652px;
  z-index: 4;
  width: 200px;
}
.fixed-col.fixed-col-4 {
  left: 655px;
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
.user-info {
  display: flex;
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
.total-hours {
  font-weight: normal;
  color: #555;
  text-align: center;
}
.date-header {
  font-size: 12px;
}
</style>
