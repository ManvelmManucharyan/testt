import { defineStore } from 'pinia';
import { getTariffRates } from '@/api/tariffRates';

export const useTariffRatesStore = defineStore('tariffRates', {
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
        this.data = await getTariffRates(params);
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
