import { defineStore } from 'pinia';
import { getProjects } from '@/api/project';

export const useProjectsStore = defineStore('projects', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(params) {
      this.data = await getProjects(params);
      this.isLoading = false;
    },
  },
});
