import { defineStore } from 'pinia';
import {
  getOfferDepartmentRoles,
  createOfferDepartmentRole,
  updateOfferDepartmentRole,
  deleteOfferDepartmentRole,
  bulkCreateOfferDepartmentRoles,
} from '@/api/offerDepartmentRole';
import { useOfferDepartmentsStore } from './offerDepartments';

export const useOfferDepartmentRolesStore = defineStore(
  'offerDepartmentRoles',
  {
    state() {
      return {
        data: [],
        isLoading: false,
        isCreating: false,
        isUpdating: false,
      };
    },
    actions: {
      async fetch(params) {
        this.data = await getOfferDepartmentRoles(params);
        this.isLoading = false;
      },
      async create(data) {
        this.isCreating = true;
        await createOfferDepartmentRole(data);
        const offerDepartmentsStore = new useOfferDepartmentsStore();
        await offerDepartmentsStore.fetch(data.offer);
        this.isCreating = false;
      },
      async bulkCreate(data) {
        await bulkCreateOfferDepartmentRoles(data);
        const offerDepartmentsStore = new useOfferDepartmentsStore();
        await offerDepartmentsStore.fetch(data.offer);
        this.isLoading = false;
      },
      async update(id, data) {
        await updateOfferDepartmentRole(id, data);
        window.location.href = `/hr/offer/${data.offer}/change/#roles-tab`;
        this.isLoading = false;
      },
      async remove(id, offerId) {
        await deleteOfferDepartmentRole(id);
        const offerDepartmentsStore = new useOfferDepartmentsStore();
        await offerDepartmentsStore.fetch(offerId);
        this.isLoading = false;
      },
    },
  },
);
