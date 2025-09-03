import { defineStore } from 'pinia';
import { getStaticChoices } from '@/api/staticChoices';

export const useStaticChoicesStore = defineStore('staticChoices', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.isLoading = true;
      this.data = await getStaticChoices();
      this.isLoading = false;
    },
  },
});
