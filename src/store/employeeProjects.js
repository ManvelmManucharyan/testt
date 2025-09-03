import { defineStore } from 'pinia';
import { getEmployeeProjects } from '@/api/employeeProject';

export const useEmployeeProjectsStore = defineStore('employeeProjects', {
  state() {
    return {
      data: [],
      isLoading: false,
    };
  },
  actions: {
    async fetch(params) {
      this.isLoading = true;
      this.data = await getEmployeeProjects(params);
      this.isLoading = false;
    },
  },
});
