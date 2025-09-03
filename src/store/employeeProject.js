import { defineStore } from 'pinia';
import {
  createEmployeeProject,
  deleteEmployeeProject,
  getEmployeeProject,
  updateEmployeeProject,
} from '@/api/employeeProject';
import { useEmployeeProjectsStore } from './employeeProjects';
import { useOfferStageDepartmentRolesStore } from './offerStageDepartmentRoles';
import { toast } from 'vue3-toastify';
import i18n from '@/local';

export const useEmployeeProjectStore = defineStore('employeeProject', {
  state() {
    return {
      data: [],
      employeeProjectData: [],
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      isLoading: true,
    };
  },
  actions: {
    async create(payload, params = {}) {
      this.isCreating = true;
      const project = payload.project;

      const response = await createEmployeeProject(payload);
      const employeeProjectsStore = new useEmployeeProjectsStore();
      await employeeProjectsStore.fetch({
        project,
        show: 'active',
        offer_department_role: params.offer_department_role || '',
      });

      const offerStageDepartmentRolesStore =
        new useOfferStageDepartmentRolesStore();
      const targetRole = offerStageDepartmentRolesStore.data.find(
        (role) => role.id === response.offer_stage_department_role,
      );
      if (targetRole) {
        targetRole.employee_projects.push(response);
      }

      this.isCreating = false;
    },

    async retrieve(id) {
      this.isLoading = true;
      this.employeeProjectData = await getEmployeeProject(id);
      this.isLoading = false;
    },

    async remove(id, params = {}) {
      this.isDeleting = true;
      const offerStageDepartmentRoleStore =
        new useOfferStageDepartmentRolesStore();
      const employeeProjectStore = new useEmployeeProjectsStore();

      await toast.promise(
        deleteEmployeeProject(id),
        {
          pending: i18n.global.t('deletingEmployeeRole'),
          success: i18n.global.t('deletedEmployeeRole'),
          error: i18n.global.t('oops'),
        },
        {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 500,
          closeButton: false,
          hideProgressBar: true,
        },
      );

      const index = employeeProjectStore.data.findIndex(
        (employee_project) => employee_project.id === id,
      );

      employeeProjectStore.data.splice(index, 1);

      if (params.offerId) {
        offerStageDepartmentRoleStore.data.forEach((role) => {
          if (role.employee_projects) {
            const indexToRemove = role.employee_projects.findIndex(
              (empProject) => empProject.id === id,
            );
            if (indexToRemove !== -1) {
              role.employee_projects.splice(indexToRemove, 1);
            }
          }
        });
      }
      this.isDeleting = false;
    },

    async update(id, payload) {
      this.isUpdating = true;
      const response = await updateEmployeeProject(id, payload);
      const index = this.data.findIndex(
        (employeeProject) => employeeProject.id === id,
      );
      if (index !== -1) {
        this.data[index] = response;
      }
      this.isUpdating = false;
    },
  },
});
