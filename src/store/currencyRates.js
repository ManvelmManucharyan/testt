import { defineStore } from 'pinia';
import { getCurrencyRates } from '@/api/currencyRates';

export const useCurrencyRatesStore = defineStore('currencyRates', {
  state: () => ({
    data: [],
    isLoading: false,
  }),

  actions: {
    async fetch(params) {
      this.isLoading = true;
      try {
        this.data = await getCurrencyRates(params);
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
