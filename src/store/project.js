import { defineStore } from 'pinia';
import { getProject } from '@/api/project';

export const useProjectStore = defineStore('project', {
  state() {
    return {
      data: null,
      isLoading: true,
    };
  },
  actions: {
    async fetch(id) {
      this.data = await getProject(id);
      this.isLoading = false;
    },
  },
});
