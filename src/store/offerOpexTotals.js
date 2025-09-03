import { defineStore } from 'pinia';
import { getOfferOpexTotals } from '@/api/offer';

export const useOfferOpexTotalsStore = defineStore('offerOpexTotals', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(offer_id, from_date, to_date) {
      this.isLoading = true;
      this.data = await getOfferOpexTotals({
        offer_id,
        from_date,
        to_date,
      });
      this.isLoading = false;
    },
  },
});
