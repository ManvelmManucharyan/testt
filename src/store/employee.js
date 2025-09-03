import { defineStore } from 'pinia';
import { getEmployee, getEmployees, updateEmployee } from '@/api/employees';

export const useEmployeesStore = defineStore('employees', {
  state() {
    return {
      data: [],
      employeeData: null,
      isLoading: true,
      isUpdating: false,
    };
  },
  actions: {
    async fetchEmployees(affiliation_type, activity_type, search) {
      this.data = await getEmployees({
        affiliation_type: affiliation_type,
        activity_type: activity_type,
        search: search,
      });
    },
    async fetch(id) {
      this.employeeData = await getEmployee(id);
      this.isLoading = false;
    },
    async update(id, data) {
      this.isUpdating = true;
      const updatedEmployee = await updateEmployee(id, data);
      const index = this.data.findIndex((employee) => employee.id === id);
      this.data.splice(index, 1, updatedEmployee);
      this.isUpdating = false;
    },
  },
});
