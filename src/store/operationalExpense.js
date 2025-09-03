import { defineStore } from 'pinia';
import {
  getProjectOperationalExpense,
  createProjectOperationalExpense,
  updateProjectOperationalExpense,
  deleteProjectOperationalExpense,
} from '@/api/projectOpex';

export const useOperationalExpenseStore = defineStore('operationalExpense', {
  state() {
    return {
      data: null,
      isLoading: false,
    };
  },
  actions: {
    async fetch(id) {
      this.isLoading = true;
      this.data = await getProjectOperationalExpense(id);
      this.isLoading = false;
    },
    async create(data) {
      await createProjectOperationalExpense(data);
      this.isLoading = false;
      window.history.back();
    },
    async update(id, data) {
      await updateProjectOperationalExpense(id, data);
      this.isLoading = false;
      window.history.back();
    },
    async remove(id) {
      await deleteProjectOperationalExpense(id);
      this.isLoading = false;
      window.history.back();
    },
  },
});
