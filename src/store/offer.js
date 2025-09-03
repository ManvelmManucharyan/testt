import { defineStore } from 'pinia';
import { getOffer, updateOffer, createOffer, removeOffer } from '@/api/offer';
import { useOffersStore } from './offers';

export const useOfferStore = defineStore('offer', {
  state() {
    return {
      data: [],
      offerData: [],
      isLoading: true,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  },
  actions: {
    async fetchById(id) {
      this.isLoading = true;
      this.offerData = await getOffer(id);
      this.isLoading = false;
    },
    async create(data) {
      this.isCreating = true;
      await createOffer(data);
      const offersStore = new useOffersStore();
      await offersStore.fetch();

      this.isCreating = false;
    },
    async update(id, data) {
      this.isUpdating = true;
      const updatedOffer = await updateOffer(id, data);
      const index = this.data.findIndex((offer) => offer.id === id);
      this.data.splice(index, 1, updatedOffer);
      this.isUpdating = false;
    },
    async remove(id) {
      this.isDeleting = true;
      await removeOffer(id);
      const offersStore = new useOffersStore();
      await offersStore.fetch();
      this.isDeleting = false;
    },
  },
});
