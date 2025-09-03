<template>
  <template v-if="role = getRole(stage, departmentrole)">
    <employee-role-cell
      :role="role"
      :stage="stage"
      :departmentrole="departmentrole"
    />
  </template>
  <template v-else>
    <add-department-role-to-stage-button
      :stage="stage"
      :departmentrole="departmentrole"
    />
  </template>
</template>

<script>
import { mapStores } from 'pinia';
import EmployeeRoleCell from '@/pages/offers/components/offer_detail/components/buttons/stage_department_role/components/EmployeeRoleCell.vue';
import AddDepartmentRoleToStageButton from './components/AddDepartmentRoleToStageButton.vue';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';

export default {
  name: 'StageRoleCell',
  components: {
    EmployeeRoleCell,
    AddDepartmentRoleToStageButton,
  },
  props: {
    stage: { type: Object, required: true },
    departmentrole: { type: Object, required: true },
  },
  computed: {
    ...mapStores(useOfferStageDepartmentRolesStore),
  },
  methods: {
    getRole(stage, departmentRole) {
      return this.offerStageDepartmentRolesStore.data.find(
        (role) =>
          role.offer_stage === stage.id &&
          role.offer_department_role === departmentRole.id,
      );
    },
  },
};
</script>
