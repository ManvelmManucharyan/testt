<template>
  <tr>
    <td class="sub-header-line-height">
      <div class="button-container">
        <span class="department-name">{{ department.name }}</span>
        <delete-item @positive-click="deleteDepartment" />
        <n-button
          ghost
          style="color: black"
          @click="clickAddRoleModal(department.name)"
        >
          {{ $t('addRole') }}
        </n-button>
      </div>
    </td>
  </tr>

  <the-modal
    v-model:show="showRolesModal"
    :modal-style="{ width: '45%' }"
    @positive-click="saveDepartmentRole"
    @negative-click="onClickCloseRoleModal"
    @close="onClickCloseRoleModal"
  >
    <template #header>
      <h3>
        {{ $t('addRole') }} {{ $t('in') }}
        {{ department.name }}
      </h3>
    </template>

    <div>
      <role-select
        v-model="selectedRole"
        :multiple="false"
        :placeholder="$t('selectRole')"
      />
    </div>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import RoleSelect from '@/components/RoleSelect.vue';
import { useOfferDepartmentRolesStore } from '@/store/offerDepartmentRoles';
import { useOfferDepartmentsStore } from '@/store/offerDepartments';
import DeleteItem from '@/components/DeleteItem.vue';
import TheModal from '@/components/TheModal.vue';

export default {
  components: {
    TheModal,
    RoleSelect,
    DeleteItem,
  },
  props: {
    department: {
      type: Object,
      required: true,
    },
    offerId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showRolesModal: false,
      selectedRole: null,
    };
  },
  computed: {
    ...mapStores(useOfferDepartmentRolesStore, useOfferDepartmentsStore),
  },
  watch: {
    showRolesModal(newVal) {
      if (!newVal) {
        this.closeRoleRouteParams();
      }
    },
  },
  methods: {
    async deleteDepartment() {
      const offerId = this.$route.params.offerId;
      await this.offerDepartmentsStore.remove(offerId, this.department.id);
    },
    saveDepartmentRole() {
      const offerId = this.$route.params.offerId;

      const data = {
        offer: offerId,
        department: this.selectedDepartmentName,
        role: this.selectedRole,
      };

      this.offerDepartmentRolesStore.create(data);
      this.showRolesModal = false;
    },
    onClickCloseRoleModal() {
      this.showRolesModal = false;
    },
    clickAddRoleModal(departmentName) {
      this.selectedDepartmentName = departmentName;
      this.showRolesModal = true;
    },
    closeRoleRouteParams() {
      const currentQuery = { ...this.$route.query };
      delete currentQuery.department_id;
      this.$router.push({
        path: this.$route.path,
        query: currentQuery,
      });
    },
  },
};
</script>

<style scoped>
.sub-header-line-height {
  padding-top: 30px;
}

.button-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
.department-name {
  font-weight: bold;
}
</style>
