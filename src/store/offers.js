import { defineStore } from 'pinia';
import { getOffers, getOffer, updateOffer, createOffer } from '@/api/offer';

export const useOffersStore = defineStore('offers', {
  state() {
    return {
      data: [],
      offerData: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch(params) {
      this.isLoading = true;
      this.data = await getOffers(params);

      this.isLoading = false;
    },
    async fetchById(id) {
      this.isLoading = true;
      this.offerData = await getOffer(id);
      this.isLoading = false;
    },
    async create(data) {
      this.isCreating = true;
      await createOffer(data);

      this.isCreating = false;
    },
    async update(id, data) {
      this.isUpdating = true;
      const updatedOffer = await updateOffer(id, data);
      const index = this.data.findIndex((offer) => offer.id === id);
      this.data.splice(index, 1, updatedOffer);
      this.isUpdating = false;
    },
  },
});
