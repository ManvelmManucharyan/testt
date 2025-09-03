import { defineStore } from 'pinia';
import { getCurrencyRate, updateCurrencyRate } from '@/api/currencyRates';
import { useCurrencyRatesStore } from './currencyRates';

export const useCurrencyRateStore = defineStore('currencyRate', {
  state() {
    return {
      data: [],
      isLoading: true,
      isUpdating: false,
    };
  },
  actions: {
    async fetch(id) {
      this.isLoading = true;
      try {
        this.data = await getCurrencyRate(id);
      } finally {
        this.isLoading = false;
      }
    },
    async update(id, data) {
      this.isUpdating = true;
      try {
        this.data = await updateCurrencyRate(id, data);
        const currencyRatesStore = useCurrencyRatesStore();
        currencyRatesStore.update(this.data);
      } finally {
        this.isUpdating = false;
      }
    },
  },
});
