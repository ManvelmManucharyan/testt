import { defineStore } from 'pinia';
import { getCurrencies } from '@/api/finance';

export const useCurrenciesStore = defineStore('currencies', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.data = await getCurrencies();
      this.isLoading = false;
    },
  },
});
