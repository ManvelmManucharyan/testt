import { defineStore } from 'pinia';
import { getClients } from '@/api/clients';

export const useClientsStore = defineStore('clients', {
  state() {
    return {
      data: [],
      isLoading: true,
    };
  },
  actions: {
    async fetch() {
      this.isLoading = true;
      this.data = await getClients();
      this.isLoading = false;
    },
  },
});
