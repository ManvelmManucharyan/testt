import { defineStore } from 'pinia';
import { getProjectOpexTotals } from '@/api/project';

export const useProjectOpexTotalsStore = defineStore('projectOpexTotals', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(project_id, from_date, to_date) {
      this.isLoading = true;
      this.data = await getProjectOpexTotals({
        project_id,
        from_date,
        to_date,
      });
      this.isLoading = false;
    },
  },
});
