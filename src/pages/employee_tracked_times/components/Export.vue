<template>
  <button class="export-btn" @click="exportData">
    {{ $t('controls.buttons.export') }}
  </button>
</template>

<script>
import { useEmployeeTrackedTimeStore } from '@/store/employeeTrackedTime';
import { mapStores } from 'pinia';
import * as XLSX from 'xlsx';
import { writeFile } from 'xlsx';
import { parseSecondToHours } from '@/utils/dateUtils';

export default {
  props: {
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    groupBy: {
      type: String,
      required: true,
      validator: (value) => ['project', 'user', 'department'].includes(value),
    },
  },
  computed: {
    ...mapStores(useEmployeeTrackedTimeStore),
    dateRange() {
      const start = new Date(this.fromDate);
      const end = new Date(this.toDate);
      const dates = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
      return dates.map((date) => this.formatDate(date));
    },
  },
  methods: {
    async exportData() {
      const data = this.employeeTrackedTimeStore.structuredData({
        group_by: this.groupBy,
      });
      const wb = XLSX.utils.book_new();
      const wsData = this.generateWorksheetData(data);
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      this.setColumnWidths(ws);
      this.setOutlineLevels(ws, wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Time Tracking Report');
      const fileName = `time_tracking_report_by_${this.groupBy}_${this.fromDate}_${this.toDate}.xlsx`;
      writeFile(wb, fileName);
    },
    generateWorksheetData(data) {
      if (this.groupBy === 'project') {
        return this.getProjectBasedData(data);
      } else if (this.groupBy === 'user') {
        return this.getUserBasedData(data);
      } else if (this.groupBy === 'department') {
        return this.getDepartmentBasedData(data);
      }
      return [];
    },
    getProjectBasedData(data) {
      const headers = [
        'Project',
        'User',
        'Role',
        'Working hours by project',
        'Logged hours',
        ...this.dateRange,
      ];
      return [
        headers,
        ...data.flatMap((project) => [
          [
            project.name,
            '',
            '',
            project.total_working_hours_by_project,
            parseSecondToHours(project.total_logged_hours),
            ...Array(this.dateRange.length).fill(''),
          ],
          ...this.getEmployeeRows(project.employees),
        ]),
      ];
    },
    getUserBasedData(data) {
      const headers = [
        'User',
        'Project',
        'Role',
        'Working hours by project',
        'Working hours by contract',
        'Logged hours',
        ...this.dateRange,
      ];
      return [
        headers,
        ...data.flatMap((employee) => [
          [
            employee.full_name,
            '',
            '',
            employee.total_working_hours_by_project,
            employee.working_hours_by_contract,
            parseSecondToHours(employee.total_logged_hours),
            ...Array(this.dateRange.length).fill(''),
          ],
          ...this.getProjectRows(employee.projects),
        ]),
      ];
    },
    getDepartmentBasedData(data) {
      const headers = [
        'Department',
        'Employee',
        'Project',
        'Role',
        'Working hours by project',
        'Logged hours',
        ...this.dateRange,
      ];
      const rows = [headers];
      data.forEach((department) => {
        rows.push([
          department.department,
          '',
          '',
          '',
          department.total_working_hours || '-',
          department.total_logged_hours
            ? parseSecondToHours(department.total_logged_hours)
            : '-',
          ...Array(this.dateRange.length).fill(''),
        ]);
        department.assignments.forEach((assignment) => {
          rows.push([
            '',
            assignment.employee_name,
            assignment.project.name,
            this.formatRoles(assignment.roles),
            assignment.working_hours_by_project || '-',
            assignment.logged ? parseSecondToHours(assignment.logged) : '-',
            ...this.getDateColumns(assignment.hours),
          ]);
        });
      });
      return rows;
    },
    getEmployeeRows(employees) {
      return employees.map((user) => {
        const dateCols = this.getDateColumns(user.hours);
        return [
          '',
          user.full_name,
          this.formatRoles(user.roles),
          user.working_hours_by_project,
          parseSecondToHours(user.logged),
          ...dateCols,
        ];
      });
    },
    getProjectRows(projects) {
      return projects.map((project) => {
        const dateCols = this.getDateColumns(project.hours);
        return [
          '',
          project.name,
          this.formatRoles(project.roles),
          project.working_hours_by_project,
          '',
          parseSecondToHours(project.logged),
          ...dateCols,
        ];
      });
    },
    getDateColumns(hours) {
      const cols = Array(this.dateRange.length).fill('');
      Object.entries(hours).forEach(([date, seconds]) => {
        const index = this.dateRange.indexOf(this.formatDate(new Date(date)));
        if (index !== -1) {
          cols[index] = parseSecondToHours(seconds);
        }
      });
      return cols;
    },
    setColumnWidths(ws) {
      const fixedColumns = this.groupBy === 'project' ? 5 : 6;
      const cols = [];
      for (let i = 0; i < fixedColumns; i++) {
        cols.push(i === 0 ? { wch: 25 } : { wch: 15 });
      }
      this.dateRange.forEach(() => {
        cols.push({ wch: 10 });
      });
      ws['!cols'] = cols;
    },
    setOutlineLevels(ws, wsData) {
      ws['!rows'] = wsData.map((row, i) => ({
        outlineLevel: i === 0 || row[0] ? 0 : 1,
        hidden: false,
        collapsed: false,
      }));
    },
    formatRoles(roles) {
      if (!roles) return '-';
      const roleMap = roles.reduce((acc, r) => {
        if (!acc[r.name]) acc[r.name] = [];
        acc[r.name].push(r.load);
        return acc;
      }, {});
      return Object.entries(roleMap)
        .map(([name, loads]) => `${name} (${loads.join(', ')})`)
        .join(', ');
    },
    formatDate(date) {
      return `${String(date.getDate()).padStart(2, '0')}/${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date)}/${String(date.getFullYear()).slice(-2)}`;
    },
    parseSecondToHours,
  },
};
</script>

<style scoped>
.export-btn {
  background-color: #2ecc71;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.export-btn:hover {
  background-color: #27ae60;
}
.export-btn:active {
  transform: scale(0.95);
}
</style>
