import { defineStore } from 'pinia';
import { getFinancialSources } from '@/api/financialSource';

export const useFinancialSourcesStore = defineStore('financialSources', {
  state() {
    return {
      data: [],
      isLoading: true,
      isUpdating: false,
      isCreating: false,
    };
  },
  actions: {
    async retrieveFinancialSources(offerId) {
      this.data = await getFinancialSources({
        offer: offerId,
      });
    },
  },
});
