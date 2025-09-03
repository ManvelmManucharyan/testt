import { defineStore } from 'pinia';
import {
  updateTariffRate,
  getTariffRate,
  createTariffRate,
  removeTariffRate,
} from '@/api/tariffRates';
import { useTariffRatesStore } from './tariffRates';

export const useTariffRateStore = defineStore('tariffRate', {
  state() {
    return {
      data: null,
      isLoading: true,
      isUpdating: false,
      isDeleting: false,
    };
  },
  actions: {
    async fetch(id, params) {
      this.isLoading = true;
      try {
        this.data = await getTariffRate(id, params);
      } finally {
        this.isLoading = false;
      }
    },
    async update(id, data, year, month) {
      this.isUpdating = true;
      try {
        this.data = await updateTariffRate(id, data, {
          year: year,
          month: month,
        });
        const tariffRatesStore = useTariffRatesStore();
        tariffRatesStore.fetch({
          year: year,
          month: month,
        });
      } finally {
        this.isUpdating = false;
      }
    },
    async create(data, year, month) {
      this.isCreating = true;
      this.data = await createTariffRate(data, { year: year, month: month });
      const tariffRatesStore = new useTariffRatesStore();
      await tariffRatesStore.fetch({
        year: year,
        month: month,
      });
      this.isCreating = false;
    },

    async remove(id, year, month) {
      this.isDeleting = true;
      await removeTariffRate(id, { year: year, month: month });
      const tariffRatesStore = new useTariffRatesStore();
      const index = tariffRatesStore.data.findIndex(
        (tariffRate) => tariffRate.id === id,
      );
      tariffRatesStore.data.splice(index, 1);
      this.isDeleting = false;
    },
  },
});
