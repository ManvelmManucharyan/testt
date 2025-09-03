import { defineStore } from 'pinia';
import {
  getOfferOperationalExpense,
  createOfferOperationalExpense,
  updateOfferOperationalExpense,
  deleteOfferOperationalExpense,
} from '@/api/offerOpex';

export const useOfferOperationalExpenseStore = defineStore(
  'offerOperationalExpense',
  {
    state() {
      return {
        data: null,
        isLoading: false,
      };
    },
    actions: {
      async fetch(id) {
        this.isLoading = true;
        this.data = await getOfferOperationalExpense(id);
        this.isLoading = false;
      },
      async create(data) {
        await createOfferOperationalExpense(data);
        this.isLoading = false;
        window.history.back();
      },
      async update(id, data) {
        await updateOfferOperationalExpense(id, data);
        this.isLoading = false;
        window.history.back();
      },
      async remove(id) {
        await deleteOfferOperationalExpense(id);
        this.isLoading = false;
        window.history.back();
      },
    },
  },
);
