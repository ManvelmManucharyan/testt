import { defineStore } from 'pinia';
import { getEmployees } from '@/api/employees';
import { getProjects } from '@/api/project';
import { getEmployeeProjects } from '@/api/employeeProject';
import { getEmployeeTrackedTime } from '@/api/employeeTrackedTime';
import { getWorkingHoursTotals } from '@/api/employeeTrackedTime';

function transformEmployeeData(
  rawEmployeeTrackedTimes,
  rawEmployeeProjects,
  rawEmployees,
  rawProjects,
  rawWorkingHoursTotals,
) {
  const employeeMap = new Map();
  rawEmployees.forEach((emp) => {
    employeeMap.set(emp.id, { ...emp, projects: [] });
  });
  const projectMap = new Map();
  rawProjects.forEach((proj) => {
    projectMap.set(proj.id, proj);
  });
  const employeeTotalSecondsMap = new Map();
  rawEmployeeTrackedTimes.totals_by_employees.forEach((item) => {
    employeeTotalSecondsMap.set(item.employee_id, item.total_seconds);
  });
  const employeeProjectMap = new Map();
  rawEmployeeTrackedTimes.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    if (!employeeProjectMap.has(key)) {
      employeeProjectMap.set(key, {
        total_seconds: 0,
        daily_tracked_times: {},
      });
    }
    const existing = employeeProjectMap.get(key);
    existing.total_seconds += item.total_seconds;
    item.daily_tracked_times.forEach((dt) => {
      if (existing.daily_tracked_times[dt.date]) {
        existing.daily_tracked_times[dt.date] += dt.seconds;
      } else {
        existing.daily_tracked_times[dt.date] = dt.seconds;
      }
    });
  });
  const employeeProjectHoursMap = new Map();
  rawWorkingHoursTotals.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    employeeProjectHoursMap.set(key, item.hours_by_project);
  });
  const hoursByContractMap = new Map();
  rawWorkingHoursTotals.hours_by_contract.forEach((item) => {
    hoursByContractMap.set(item.employee_id, item.working_hours_by_contract);
  });
  const totalHoursByEmployeeMap = new Map();
  rawWorkingHoursTotals.total_hours_by_employee.forEach((item) => {
    totalHoursByEmployeeMap.set(item.employee_id, item.total_hours);
  });
  rawEmployees.forEach((employee) => {
    const emp = employeeMap.get(employee.id);
    emp.total_logged_hours = employeeTotalSecondsMap.get(employee.id) || 0;
    emp.working_hours_by_contract = hoursByContractMap.get(employee.id) || 0;
    emp.total_working_hours_by_project =
      totalHoursByEmployeeMap.get(employee.id) || 0;
    employeeProjectMap.forEach((value, key) => {
      const [empId, projId] = key.split('_');
      if (empId === employee.id) {
        const project = projectMap.get(projId) || { name: 'Unknown Project' };
        const workingHours = employeeProjectHoursMap.get(key) || 0;
        emp.projects.push({
          id: projId,
          name: project.name,
          roles: [],
          logged: value.total_seconds,
          offerId: project.offer_id,
          payment_type: null,
          working_hours_by_project: workingHours,
          hours: { ...value.daily_tracked_times },
        });
      }
    });
    rawEmployeeProjects
      .filter((projAssignment) => projAssignment.employee === employee.id)
      .forEach((projAssignment) => {
        const project = emp.projects.find(
          (p) => p.id === projAssignment.project.id,
        );
        if (project) {
          project.roles.push({
            id: projAssignment.id,
            offerStageDepartmentRole:
              projAssignment.offer_stage_department_role,
            name: projAssignment.role_name,
            load: projAssignment.effective_payment_type,
          });
        }
      });
  });
  return Array.from(employeeMap.values());
}

function transformProjectData(
  rawEmployeeTrackedTimes,
  rawEmployeeProjects,
  rawEmployees,
  rawProjects,
  rawWorkingHoursTotals,
) {
  const employeeMap = new Map();
  rawEmployees.forEach((emp) => {
    employeeMap.set(emp.id, emp);
  });

  const projectMap = new Map();
  rawProjects.forEach((proj) => {
    projectMap.set(proj.id, {
      ...proj,
      employees: [],
      total_logged_hours: 0,
      total_working_hours_by_project: 0,
      total_hours_by_total_days: 0,
    });
  });

  const employeeTotalSecondsMap = new Map();
  rawEmployeeTrackedTimes.totals_by_employees.forEach((item) => {
    employeeTotalSecondsMap.set(item.employee_id, item.total_seconds);
  });

  const projectTotalSecondsMap = new Map();
  rawEmployeeTrackedTimes.totals_by_projects.forEach((item) => {
    projectTotalSecondsMap.set(item.project_id, item.total_seconds);
  });

  const employeeProjectMap = new Map();
  rawEmployeeTrackedTimes.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    if (!employeeProjectMap.has(key)) {
      employeeProjectMap.set(key, {
        total_seconds: 0,
        daily_tracked_times: {},
      });
    }
    const existing = employeeProjectMap.get(key);
    existing.total_seconds += item.total_seconds;
    item.daily_tracked_times.forEach((dt) => {
      if (existing.daily_tracked_times[dt.date]) {
        existing.daily_tracked_times[dt.date] += dt.seconds;
      } else {
        existing.daily_tracked_times[dt.date] = dt.seconds;
      }
    });
  });

  const allEmployeeProjectPairs = new Map();

  employeeProjectMap.forEach((value, key) => {
    allEmployeeProjectPairs.set(key, true);
  });

  rawEmployeeProjects.forEach((assignment) => {
    const key = `${assignment.employee}_${assignment.project.id}`;
    allEmployeeProjectPairs.set(key, true);
  });

  const employeeProjectHoursMap = new Map();
  const employeeProjectTotalDaysHoursMap = new Map();
  rawWorkingHoursTotals.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    employeeProjectHoursMap.set(key, item.hours_by_project);
    employeeProjectTotalDaysHoursMap.set(key, item.total_hours_by_total_days);
  });

  const totalHoursByProjectMap = new Map();
  const totalHoursByTotalDaysProjectMap = new Map();
  rawWorkingHoursTotals.total_hours_by_project.forEach((item) => {
    totalHoursByProjectMap.set(item.project_id, item.total_hours);
    totalHoursByTotalDaysProjectMap.set(
      item.project_id,
      item.total_hours_by_total_days,
    );
  });

  employeeProjectMap.forEach((value, key) => {
    const [empId, projId] = key.split('_');
    const employee = employeeMap.get(empId);
    const project = projectMap.get(projId);
    if (!employee || !project) return;

    let userEntry = project.employees.find((user) => user.id === empId);
    if (!userEntry) {
      userEntry = {
        id: empId,
        full_name: employee.full_name,
        date_of_dismissal: employee.date_of_dismissal,
        avatar: employee.avatar,
        roles: null,
        working_hours_by_project: null,
        working_hours_by_total_days: null,
        logged: 0,
        hours: {},
        vacation_days: employee.vacation_days || [],
        sick_leave_days: employee.sick_leave_days || [],
      };
      project.employees.push(userEntry);
    }
    userEntry.logged = value.total_seconds;
    project.total_logged_hours += value.total_seconds;
    userEntry.hours = { ...userEntry.hours, ...value.daily_tracked_times };

    const workingHours = employeeProjectHoursMap.get(key);
    userEntry.working_hours_by_project = workingHours;

    userEntry.working_hours_by_total_days =
      employeeProjectTotalDaysHoursMap.get(key);

    const relevantProjects = rawEmployeeProjects.filter(
      (projAssignment) =>
        projAssignment.employee === empId &&
        projAssignment.project.id === projId,
    );
    relevantProjects.forEach((projAssignment) => {
      if (!userEntry.roles) {
        userEntry.roles = [];
      }
      userEntry.roles.push({
        id: projAssignment.id,
        offerStageDepartmentRole: projAssignment.offer_stage_department_role,
        name: projAssignment.role_name,
        load: projAssignment.effective_payment_type,
      });
    });
  });

  rawEmployeeProjects.forEach((assignment) => {
    const empId = assignment.employee;
    const projId = assignment.project.id;
    const key = `${empId}_${projId}`;

    if (employeeProjectMap.has(key)) return;

    const employee = employeeMap.get(empId);
    const project = projectMap.get(projId);

    if (!employee || !project) return;

    let userEntry = project.employees.find((user) => user.id === empId);

    if (!userEntry) {
      userEntry = {
        id: empId,
        full_name: employee.full_name,
        avatar: employee.avatar,
        date_of_dismissal: employee.date_of_dismissal,
        roles: [
          {
            id: assignment.id,
            name: assignment.role_name,
            load: assignment.effective_payment_type,
          },
        ],
        working_hours_by_project: employeeProjectHoursMap.get(key),
        working_hours_by_total_days: employeeProjectTotalDaysHoursMap.get(key),
        logged: 0,
        hours: {},
        vacation_days: employee.vacation_days || [],
      };
      project.employees.push(userEntry);
    } else if (!userEntry.roles) {
      userEntry.roles = [
        {
          id: assignment.id,
          name: assignment.role_name,
          load: assignment.effective_payment_type,
        },
      ];
    } else {
      const roleExists = userEntry.roles.some(
        (role) =>
          role.name === assignment.role_name &&
          role.load === assignment.effective_payment_type,
      );

      if (!roleExists) {
        userEntry.roles.push({
          id: assignment.id,
          name: assignment.role_name,
          load: assignment.effective_payment_type,
        });
      }
    }

    if (userEntry.working_hours_by_project === 0) {
      userEntry.working_hours_by_project = employeeProjectHoursMap.get(key);
    }

    if (userEntry.working_hours_by_total_days === 0) {
      userEntry.working_hours_by_total_days =
        employeeProjectTotalDaysHoursMap.get(key);
    }
  });

  projectMap.forEach((project, projId) => {
    project.total_logged_hours = projectTotalSecondsMap.get(projId) || 0;
    project.total_working_hours_by_project =
      totalHoursByProjectMap.get(projId) || 0;
    project.total_hours_by_total_days =
      totalHoursByTotalDaysProjectMap.get(projId) || 0;
  });

  return Array.from(projectMap.values());
}

function transformDepartmentData(
  rawEmployeeTrackedTimes,
  rawEmployeeProjects,
  rawWorkingHoursTotals,
) {
  const employeeProjectTimeMap = new Map();
  rawEmployeeTrackedTimes.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    if (!employeeProjectTimeMap.has(key)) {
      employeeProjectTimeMap.set(key, {
        total_seconds: 0,
        daily_tracked_times: {},
      });
    }
    const existing = employeeProjectTimeMap.get(key);
    existing.total_seconds += item.total_seconds;
    item.daily_tracked_times.forEach((dt) => {
      existing.daily_tracked_times[dt.date] =
        (existing.daily_tracked_times[dt.date] || 0) + dt.seconds;
    });
  });
  const employeeProjectHoursMap = new Map();
  rawWorkingHoursTotals.totals_by_employee_projects.forEach((item) => {
    const key = `${item.employee_id}_${item.project_id}`;
    employeeProjectHoursMap.set(key, item.hours_by_project);
  });
  const departmentGroups = new Map();
  rawEmployeeProjects.forEach((assignment) => {
    const department = assignment.role_department;
    if (!departmentGroups.has(department)) {
      departmentGroups.set(department, new Map());
    }
    const innerMap = departmentGroups.get(department);
    const key = `${assignment.employee}_${assignment.project.id}`;
    if (!innerMap.has(key)) {
      innerMap.set(key, {
        employee: assignment.employee,
        employee_name: assignment.employee_name,
        employee_avatar: assignment.employee_avatar,
        project: {
          id: assignment.project.id,
          name: assignment.project.name,
          offerId: assignment.offer_id,
        },
        date_of_dismissal: assignment.employee_date_of_dismissal,
        roles: [],
        logged: 0,
        working_hours_by_project: 0,
        hours: {},
      });
    }
    innerMap.get(key).roles.push({
      id: assignment.id,
      offerStageDepartmentRole: assignment.offer_stage_department_role,
      name: assignment.role_name,
      load: assignment.effective_payment_type,
    });
  });
  const deptLoggedMap = new Map();
  rawEmployeeTrackedTimes.totals_by_department.forEach((item) => {
    deptLoggedMap.set(item.department, item.total_seconds);
  });
  const deptWorkingHoursMap = new Map();
  rawWorkingHoursTotals.total_hours_by_department.forEach((item) => {
    deptWorkingHoursMap.set(item.department, item.total_hours);
  });
  const result = [];
  departmentGroups.forEach((innerMap, department) => {
    const assignments = [];
    innerMap.forEach((assignment) => {
      const key = `${assignment.employee}_${assignment.project.id}`;
      const timeData = employeeProjectTimeMap.get(key) || {
        total_seconds: 0,
        daily_tracked_times: {},
      };
      const workingHours = employeeProjectHoursMap.get(key) || 0;
      assignment.logged = timeData.total_seconds;
      assignment.hours = { ...timeData.daily_tracked_times };
      assignment.working_hours_by_project = workingHours;
      assignments.push(assignment);
    });
    result.push({
      department,
      total_logged_hours: deptLoggedMap.get(department) || 0,
      total_working_hours: deptWorkingHoursMap.get(department) || 0,
      assignments,
    });
  });

  return result;
}

export const useEmployeeTrackedTimeStore = defineStore('employeeTrackedTime', {
  state: () => ({
    rawEmployeeTrackedTimes: {
      totals_by_employees: [],
      totals_by_projects: [],
      totals_by_employee_projects: [],
      totals_by_department: [],
    },
    rawEmployeeProjects: [],
    rawEmployees: [],
    rawProjects: [],
    rawWorkingHoursTotals: {
      hours_by_contract: [],
      total_hours_by_project: [],
      total_hours_by_employee: [],
      totals_by_employee_projects: [],
      totals_by_projects: [],
      total_hours_by_department: [],
    },
    isLoading: true,
  }),
  getters: {
    structuredData: (state) => {
      return ({ group_by }) => {
        if (group_by === 'user') {
          return transformEmployeeData(
            state.rawEmployeeTrackedTimes,
            state.rawEmployeeProjects,
            state.rawEmployees,
            state.rawProjects,
            state.rawWorkingHoursTotals,
          );
        } else if (group_by === 'project') {
          return transformProjectData(
            state.rawEmployeeTrackedTimes,
            state.rawEmployeeProjects,
            state.rawEmployees,
            state.rawProjects,
            state.rawWorkingHoursTotals,
          );
        } else if (group_by === 'department') {
          return transformDepartmentData(
            state.rawEmployeeTrackedTimes,
            state.rawEmployeeProjects,
            state.rawWorkingHoursTotals,
          );
        } else {
          return [];
        }
      };
    },
  },
  actions: {
    async fetch({ fromDate, toDate, project_ids, employee_ids }) {
      this.isLoading = true;
      const [
        employeeTrackedTime,
        employeeProjects,
        employees,
        projects,
        workingHoursTotals,
      ] = await Promise.all([
        getEmployeeTrackedTime({
          from_date: fromDate,
          to_date: toDate,
          project_ids,
          employee_ids,
        }),
        getEmployeeProjects({
          include_project: true,
          project_ids,
          from_date: fromDate,
          to_date: toDate,
          employee_ids,
        }),
        getEmployees({
          from_date: fromDate,
          to_date: toDate,
          with_vacations: true,
          project_ids: project_ids,
          employee_ids,
          affiliation_type: 'all',
          activity_type: 'all',
        }),
        getProjects({ project_ids, with_details: true }),
        getWorkingHoursTotals({
          from_date: fromDate,
          to_date: toDate,
          project_ids,
          employee_ids,
        }),
      ]);
      this.rawEmployeeTrackedTimes = employeeTrackedTime;
      this.rawEmployeeProjects = employeeProjects;
      this.rawEmployees = employees;
      this.rawProjects = projects;
      this.rawWorkingHoursTotals = workingHoursTotals;
      this.isLoading = false;
    },
  },
});
