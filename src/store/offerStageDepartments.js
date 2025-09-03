import { defineStore } from 'pinia';
import { getOfferStageDepartments } from '@/api/offerStageDepartments';
import { updateOfferStageDepartment } from '@/api/offerStageDepartments';

export const useOfferStageDepartmentsStore = defineStore(
  'offerStageDepartments',
  {
    state() {
      return {
        data: [],
        isLoading: true,
        isCreating: false,
        isUpdating: false,
      };
    },
    actions: {
      async fetch(offer) {
        this.data = await getOfferStageDepartments(offer);
        this.isLoading = false;
      },
      async update(offerId, id, data) {
        this.isUpdating = true;
        const offerStageDepartmentsStore = new useOfferStageDepartmentsStore();
        await updateOfferStageDepartment(id, data);
        await offerStageDepartmentsStore.fetch(offerId);
        this.isUpdating = false;
      },
    },
  },
);
