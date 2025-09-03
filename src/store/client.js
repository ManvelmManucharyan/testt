import { defineStore } from 'pinia';
import {
  getClient,
  updateClient,
  removeClient,
  createClient,
} from '@/api/clients';
import { useClientsStore } from './clients';

export const useClientStore = defineStore('client', {
  state() {
    return {
      data: {},
      client_data: {},
      isLoading: true,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
    };
  },
  actions: {
    async fetch(id) {
      this.isLoading = true;
      this.client_data = await getClient(id);
      this.isLoading = false;
    },
    async create(data) {
      this.isCreating = true;
      this.data = await createClient(data);
      const clientsStore = new useClientsStore();
      clientsStore.data.unshift(this.data);
      this.isCreating = false;
    },
    async update(id, data) {
      this.isUpdating = true;
      this.data = await updateClient(id, data);
      const clientsStore = new useClientsStore();
      const index = clientsStore.data.findIndex((client) => client.id === id);
      clientsStore.data.splice(index, 1, this.data);
      this.isUpdating = false;
    },
    async remove(id) {
      this.isDeleting = true;
      await removeClient(id);
      const clientsStore = new useClientsStore();
      const index = clientsStore.data.findIndex((client) => client.id === id);
      clientsStore.data.splice(index, 1);
      this.isDeleting = false;
    },
  },
});
