import { defineStore } from 'pinia';
import {
  getOfferStageDepartmentRoles,
  createOfferStageDepartmentRole,
  updateOfferStageDepartmentRole,
  getOfferStageDepartmentRole,
  removeOfferStageDepartmentRole,
} from '@/api/offerStageDepartmentRoles';
import { toast } from 'vue3-toastify';
import i18n from '@/local';

export const useOfferStageDepartmentRolesStore = defineStore(
  'offerStageDepartmentRoles',
  {
    state() {
      return {
        data: [],
        isLoading: false,
        isCreating: false,
        isUpdating: false,
        role_data: [],
      };
    },
    actions: {
      async fetch(offerId) {
        this.isLoading = true;
        this.data = await getOfferStageDepartmentRoles(offerId);
        this.isLoading = false;
      },
      async create(offerId, data) {
        this.isCreating = true;
        await createOfferStageDepartmentRole({ offer: offerId }, data);
        const offerStageDepartmentRoleStore =
          new useOfferStageDepartmentRolesStore();
        await offerStageDepartmentRoleStore.fetch(offerId);
        this.isCreating = false;
      },
      async update(id, offerId, data) {
        this.isUpdating = true;
        await updateOfferStageDepartmentRole(id, { offer: offerId }, data);
        const offerStageDepartmentRoleStore =
          new useOfferStageDepartmentRolesStore();
        await offerStageDepartmentRoleStore.fetch(offerId);
        this.isUpdating = false;
      },
      async fetchById(id, offerId) {
        this.isLoading = true;
        this.role_data = await getOfferStageDepartmentRole(id, {
          offer: offerId,
        });

        this.isLoading = false;
      },
      async remove(id, offerId) {
        const roleIndex = this.data.findIndex((role) => role.id === id);

        if (roleIndex !== -1) {
          this.data.splice(roleIndex, 1);
        }

        this.isDeleting = true;

        await toast.promise(
          removeOfferStageDepartmentRole(id, { offer: offerId }),
          {
            pending: i18n.global.t('deletingRole'),
            success: i18n.global.t('deletedRole'),
            error: i18n.global.t('oops'),
          },
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 300,
            closeButton: false,
            hideProgressBar: true,
          },
        );
        this.isDeleting = false;
      },
    },
  },
);
