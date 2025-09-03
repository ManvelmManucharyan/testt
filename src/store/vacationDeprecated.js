import { defineStore } from 'pinia';
import {
  getVacation,
  createVacation,
  updateVacation,
  removeVacation,
} from '@/api/vacationsDeprecated';

export const useVacationDeprecatedStore = defineStore('vacationDeprecated', {
  state() {
    return {
      data: null,
      isLoading: true,
    };
  },
  actions: {
    async fetch(id) {
      this.data = await getVacation(id);
      this.isLoading = false;
    },
    async create(data) {
      await createVacation(data);
    },
    async update(id, data) {
      await updateVacation(id, data);
    },
    async remove(id) {
      await removeVacation(id);
    },
  },
});
