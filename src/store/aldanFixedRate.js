import { defineStore } from 'pinia';
import { updateAldanFixedRate, getAldanFixedRate } from '@/api/aldanFixedRates';
import { useAldanFixedRatesStore } from './aldanFixedRates';

export const useAldanFixedRateStore = defineStore('aldanFixedRate', {
  state() {
    return {
      data: null,
      isLoading: true,
      isUpdating: false,
    };
  },
  actions: {
    async fetch(id) {
      this.isLoading = true;
      try {
        this.data = await getAldanFixedRate(id);
      } finally {
        this.isLoading = false;
      }
    },
    async update(id, data) {
      this.isUpdating = true;
      try {
        this.data = await updateAldanFixedRate(id, data);
        const aldanFixedRatesStore = useAldanFixedRatesStore();
        aldanFixedRatesStore.update(this.data);
      } finally {
        this.isUpdating = false;
      }
    },
  },
});
