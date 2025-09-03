import { defineStore } from 'pinia';
import { getProjectOperationalExpenses } from '@/api/projectOpex';

export const useProjectOperationalExpensesStore = defineStore(
  'projectOperationalExpenses',
  {
    state() {
      return {
        data: [],
        isLoading: true,
      };
    },
    actions: {
      async fetch(project, from_date, to_date, detailed) {
        this.data = await getProjectOperationalExpenses({
          project,
          from_date,
          to_date,
          detailed,
        });
        this.isLoading = false;
      },
    },
  },
);
