import { defineStore } from 'pinia';
import { getCard, updateCard, createCard, removeCard } from '@/api/cards';
import { useCardsStore } from './cards';

export const useCardStore = defineStore('card', {
  state() {
    return {
      data: null,
      isLoading: true,
    };
  },
  actions: {
    async fetch(id) {
      this.data = await getCard(id);
      this.isLoading = false;
    },
    async create(data) {
      this.data = await createCard(data);
      const cardsStore = new useCardsStore();
      cardsStore.data.unshift(this.data);
    },
    async update(id, data) {
      this.data = await updateCard(id, data);
      const cardsStore = new useCardsStore();
      const index = cardsStore.data.findIndex((card) => card.id === id);
      cardsStore.data.splice(index, 1, this.data);
    },
    async remove(id) {
      await removeCard(id);
      const cardsStore = new useCardsStore();
      const index = cardsStore.data.findIndex((card) => card.id === id);
      cardsStore.data.splice(index, 1);
    },
  },
});
