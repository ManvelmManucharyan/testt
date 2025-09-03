<template>
  <div class="row">
    <div class="employees-container col-12">
      <div class="avatars-wrapper">
        <template v-if="role">
          <template
            v-for="employee_project in role.employee_projects"
            :key="employee_project.id"
          >
            <employee-cell-avatar
              :clickable="true"
              :employee-project="employee_project"
              :role="role"
            />
          </template>

          <div
            class="role-load"
            style="cursor: pointer"
            @click="onRoleLoadClick"
          >
            <role-load-icon :role="role" />
          </div>
        </template>
      </div>

      <div class="add-button-wrapper">
        <add-employee-to-stage-button
          v-if="role"
          :stage="stage"
          :role="role"
          :departmentrole="departmentrole"
        />
      </div>
    </div>
  </div>

  <update-department-role-modal
    v-model:show="showDepartmentRoleModal"
    :role="role"
    :stage="stage"
    :departmentrole="departmentrole"
    :role-data="preloadedRoleData"
  />
</template>

<script>
import { mapStores } from 'pinia';
import RoleLoadIcon from '@/components/RoleLoadIcon.vue';
import EmployeeCellAvatar from '@/pages/offers/components/offer_detail/components/buttons/stage_department_role/components/EmployeeCellAvatar.vue';
import AddEmployeeToStageButton from '@/pages/offers/components/offer_detail/components/buttons/stage_department_role/components/AddEmployeeToStageButton.vue';
import UpdateDepartmentRoleModal from './UpdateDepartmentRoleModal.vue';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';

export default {
  components: {
    RoleLoadIcon,
    EmployeeCellAvatar,
    AddEmployeeToStageButton,
    UpdateDepartmentRoleModal,
  },
  props: {
    stage: { type: Object, required: true },
    role: { type: Object, required: true },
    departmentrole: { type: Object, required: true },
  },
  emits: ['update:show'],
  data() {
    return {
      showDepartmentRoleModal: false,
      preloadedRoleData: null,
    };
  },
  computed: {
    showModal: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
      },
    },
    ...mapStores(useOfferStageDepartmentRolesStore),
  },
  watch: {
    '$route.query.edit_role': {
      immediate: true,
      async handler(newRoleId) {
        if (
          newRoleId === String(this.role.id) &&
          !this.showDepartmentRoleModal
        ) {
          await this.preloadRoleData();
          this.showDepartmentRoleModal = true;
        } else if (!newRoleId) {
          this.showDepartmentRoleModal = false;
        }
      },
    },
  },
  methods: {
    async preloadRoleData() {
      const offerId = this.$route.params.offerId;
      if (
        !this.offerStageDepartmentRolesStore.role_data ||
        this.offerStageDepartmentRolesStore.role_data.id !== this.role.id
      ) {
        await this.offerStageDepartmentRolesStore.fetchById(
          this.role.id,
          offerId,
        );
      }
      this.preloadedRoleData = {
        scheduled_load:
          this.offerStageDepartmentRolesStore.role_data?.scheduled_load || '',
        working_hours_for_flex:
          this.offerStageDepartmentRolesStore.role_data
            ?.working_hours_for_flex || null,
      };
    },
    async onRoleLoadClick() {
      await this.preloadRoleData();
      this.$router.push({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          edit_role: this.role.id,
        },
      });
    },
  },
};
</script>

<style scoped>
.employees-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatars-wrapper {
  display: flex;
  align-items: center;
}

.role-load {
  margin-left: 6px;
}

.add-button-wrapper {
  margin-left: auto;
}
</style>
