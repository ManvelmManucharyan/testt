import { defineStore } from 'pinia';
import { getAldanFixedRates } from '@/api/aldanFixedRates';

export const useAldanFixedRatesStore = defineStore('aldanFixedRates', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(params) {
      this.isLoading = true;
      try {
        this.data = await getAldanFixedRates(params);
      } finally {
        this.isLoading = false;
      }
    },
    update(item) {
      const index = this.data.findIndex((r) => r.id === item.id);
      if (index !== -1) {
        this.data.splice(index, 1, item);
      }
    },
  },
});
