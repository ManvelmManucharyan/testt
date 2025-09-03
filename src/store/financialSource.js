import { defineStore } from 'pinia';
import {
  createFinancialSource,
  fetch,
  updateFinancialSource,
  removeFinancialSource,
} from '@/api/financialSource';
import { useFinancialSourcesStore } from './financialSources';

export const useFinancialSourceStore = defineStore('financialSource', {
  state() {
    return {
      data: [],
      fin_source_data: [],
      isLoading: true,
      isUpdating: false,
      isCreating: false,
      isDeleting: false,
    };
  },
  actions: {
    async create(data) {
      this.isCreating = true;
      await createFinancialSource(data);
      const financialSourcesStore = new useFinancialSourcesStore();
      await financialSourcesStore.retrieveFinancialSources(data.offer);
      this.isCreating = false;
    },
    async fetchFinSource(id, offerId) {
      this.isLoading = true;
      this.fin_source_data = await fetch(id, { offer: offerId });
      this.isLoading = false;
    },
    async update(id, data, offerId) {
      this.isUpdating = true;
      const financialSourcesStore = new useFinancialSourcesStore();
      await updateFinancialSource(id, data, { offer: offerId });
      await financialSourcesStore.retrieveFinancialSources(data.offer);
      this.isUpdating = false;
    },
    async remove(id, offerId) {
      this.isDeleting = true;
      await removeFinancialSource(id, { offer: offerId });
      const financialSourcesStore = new useFinancialSourcesStore();
      await financialSourcesStore.retrieveFinancialSources(offerId);
      this.isDeleting = false;
    },
  },
});
