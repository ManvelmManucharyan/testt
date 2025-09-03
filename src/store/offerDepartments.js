import { defineStore } from 'pinia';
import {
  getOfferDepartments,
  deleteOfferDepartment,
} from '@/api/offerDepartments';

export const useOfferDepartmentsStore = defineStore('offerDepartments', {
  state() {
    return {
      data: [],
      isLoading: false,
      isDeleting: false,
    };
  },
  actions: {
    async fetch(offer) {
      this.isLoading = true;
      this.data = await getOfferDepartments(offer);
      this.isLoading = false;
    },
    async remove(offerId, departmentId) {
      this.isDeleting = true;
      await deleteOfferDepartment({
        offer_id: offerId,
        department_id: departmentId,
      });
      await this.fetch(offerId);
      this.isDeleting = false;
    },
  },
});
