import { defineStore } from 'pinia';
import {
  createOfferStage,
  getOfferStage,
  updateOfferStage,
  removeOfferStage,
} from '@/api/offerStages';
import { useOfferStagesStore } from './offerStages';

export const useOfferStageStore = defineStore('offerStage', {
  state() {
    return {
      data: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  },
  actions: {
    async fetch(id, offerId) {
      this.isLoading = true;
      this.data = await getOfferStage(id, { offer: offerId });
      this.isLoading = false;
    },
    async create(data) {
      this.isCreating = true;
      await createOfferStage(data);
      const offerStagesStore = new useOfferStagesStore();
      await offerStagesStore.fetch(data.offer);
      this.isCreating = false;
    },
    async update(id, data, offerId) {
      this.isUpdating = true;
      const offerStagesStore = new useOfferStagesStore();
      await updateOfferStage(id, data, { offer: offerId });
      await offerStagesStore.fetch(data.offer);
      this.isUpdating = false;
    },
    async remove(id, offerId) {
      this.isDeleting = true;
      await removeOfferStage(id, { offer: offerId });
      const offerStagesStore = new useOfferStagesStore();
      await offerStagesStore.fetch(offerId);
      this.isDeleting = false;
    },
  },
});
