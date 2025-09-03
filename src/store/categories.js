import { defineStore } from 'pinia';
import { getCategories } from '@/api/finance';

export const useCategoriesStore = defineStore('categories', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.data = await getCategories();
      this.isLoading = false;
    },
  },
});
