import { defineStore } from 'pinia';
import { getOfferOperationalExpenses } from '@/api/offerOpex';

export const useOfferOperationalExpensesStore = defineStore(
  'offerOperationalExpenses',
  {
    state() {
      return {
        data: [],
        isLoading: true,
      };
    },
    actions: {
      async fetch(offer, from_date, to_date, detailed) {
        this.data = await getOfferOperationalExpenses({
          offer,
          from_date,
          to_date,
          detailed,
        });
        this.isLoading = false;
      },
    },
  },
);
