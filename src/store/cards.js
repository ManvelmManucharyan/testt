import { defineStore } from 'pinia';
import { getCards } from '@/api/cards';

export const useCardsStore = defineStore('cards', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.data = await getCards();
      this.isLoading = false;
    },
  },
});
