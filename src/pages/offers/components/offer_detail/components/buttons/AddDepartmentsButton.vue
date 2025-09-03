<template>
  <div v-if="selectedOffer" class="button-container">
    <n-button @click="onAddDepartmentsClick">
      {{ $t('addDepartments') }}
    </n-button>
  </div>

  <the-modal
    v-model:show="showDepartmentModal"
    :modal-style="{ width: '45%' }"
    @positive-click="saveDepartments"
    @negative-click="toggleDepartmentModal"
    @close="toggleDepartmentModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="$t('addDepartments')"
    >
      <department-modal v-model="departmentForm" />
    </n-card>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NButton } from 'naive-ui';
import DepartmentModal from '@/pages/offers/components/offer_detail/components/modals/department_modal/DepartmentModal.vue';
import { useOfferDepartmentRolesStore } from '@/store/offerDepartmentRoles';
import TheModal from '@/components/TheModal.vue';

export default {
  name: 'OfferPage',
  components: {
    NCard,
    NButton,
    DepartmentModal,
    TheModal,
  },
  props: {
    selectedOffer: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      departmentForm: {},
      showDepartmentModal: false,
    };
  },
  computed: {
    ...mapStores(useOfferDepartmentRolesStore),
  },

  watch: {
    '$route.query.add_departments': {
      immediate: true,
      handler(addDepartments) {
        if (addDepartments) {
          this.showDepartmentModal = true;
        }
      },
    },
    showDepartmentModal(newVal) {
      if (!newVal) {
        this.removeDepartmentQueryParams();
      }
    },
  },

  methods: {
    onAddDepartmentsClick() {
      if (!this.showDepartmentModal) {
        this.showDepartmentModal = true;
        this.$router.push({
          query: {
            ...this.$route.query,
            add_departments: true,
          },
        });
      }
    },

    removeDepartmentQueryParams() {
      const query = { ...this.$route.query };
      delete query.add_departments;

      this.$router.push({ query });
      this.form = {};
    },

    toggleDepartmentModal() {
      this.showDepartmentModal = false;
    },

    async saveDepartments() {
      const payload = {
        offer: this.$route.params.offerId,
        departments: this.departmentForm.map((dept) => ({
          department: dept.selectedDepartments,
          roles: dept.roles.map((role) => ({
            role: role.selectedRole,
            quantity: role.quantity,
          })),
        })),
      };

      await this.offerDepartmentRolesStore.bulkCreate(payload);
      this.departmentForm = {};

      this.showDepartmentModal = false;
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
