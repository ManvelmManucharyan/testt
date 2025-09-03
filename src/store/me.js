import { defineStore } from 'pinia';
import { getMe } from '@/api/auth';

export const useMeStore = defineStore('me', {
  state() {
    return {
      data: null,
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.data = await getMe();
      this.isLoading = false;
    },
  },
});
