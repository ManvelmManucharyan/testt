<template>
  <n-popover
    placement="left-start"
    trigger="manual"
    :show="showDepartmentRoleModal"
    style="max-width: 500px; width: 24vw"
  >
    <template #trigger>
      <div style="cursor: pointer" data-modal-trigger>
        <span
          class="add-role-span"
          :title="$t('addRole')"
          @click.stop="openAddDepartmentRoleModal"
        >
          {{ $t('addRole') }}
        </span>
      </div>
    </template>
    <template #default>
      <div class="modal-overlay" @click="onClickDepartmentRoleModal">
        <div class="modal-content" data-modal-content @click.stop>
          <n-card
            :bordered="false"
            role="dialog"
            aria-modal="true"
            :title="
              $t('addRoleDescription', {
                role: departmentrole.name,
                stageName: stage.name,
              })
            "
          >
            <stage-department-role-form v-model="stageDepartmentForm" />
            <template #footer>
              <n-space justify="end">
                <n-button @click="onClickDepartmentRoleModal">
                  {{ $t('cancel') }}
                </n-button>
                <n-button
                  type="primary"
                  @click="createOfferStageDepartmentRole"
                >
                  {{ $t('save') }}
                </n-button>
              </n-space>
            </template>
          </n-card>
        </div>
      </div>
    </template>
  </n-popover>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';
import StageDepartmentRoleForm from '@/pages/offers/components/offer_detail/components/modals/StageDepartmentRoleForm.vue';

export default {
  name: 'AddDepartmentRoleToStageButton',
  components: {
    StageDepartmentRoleForm,
  },
  props: {
    stage: { type: Object, required: true },
    departmentrole: { type: Object, required: true },
  },
  data() {
    return {
      showDepartmentRoleModal: false,
      stageDepartmentForm: {},
      selectedStage: null,
      selectedDepartmentRole: null,
      isModalOpening: false,
    };
  },
  computed: {
    ...mapStores(useOfferStageDepartmentRolesStore),
    popoverKey() {
      return `${this.stage.id}_${this.departmentrole.id}`;
    },
    queryParamKey() {
      return `create_department_role_${this.popoverKey}`;
    },
  },
  watch: {
    showDepartmentRoleModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query': {
      handler(newQuery) {
        this.showDepartmentRoleModal = !!newQuery[this.queryParamKey];
      },
      immediate: true,
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('close-popovers', this.closePopover);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('close-popovers', this.closePopover);
  },
  methods: {
    handleClickOutside(e) {
      if (e.target.closest('.n-popover')) return;
      this.onClickDepartmentRoleModal();
    },
    closePopover() {
      this.showDepartmentRoleModal = false;
    },
    openAddDepartmentRoleModal() {
      window.dispatchEvent(new Event('close-popovers'));
      this.isModalOpening = true;
      this.$router.push({
        query: {
          ...this.$route.query,
          [this.queryParamKey]: true,
        },
      });
    },
    async createOfferStageDepartmentRole() {
      this.selectedStage = this.stage;
      this.selectedDepartmentRole = this.departmentrole;
      const offerId = this.$route.params.offerId;
      const data = {
        offer_stage: this.selectedStage.id,
        offer_department_role: this.selectedDepartmentRole.id,
        ...this.stageDepartmentForm,
      };
      await this.offerStageDepartmentRolesStore.create(offerId, data);
      this.showDepartmentRoleModal = false;
      this.removeQueryParams();
    },
    onClickDepartmentRoleModal() {
      this.showDepartmentRoleModal = false;
    },
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query[this.queryParamKey];
      this.$router.replace({ query });
      this.stageDepartmentForm = {};
    },
  },
};
</script>

<style scoped>
.add-role-span {
  cursor: pointer;
  color: grey;
}
.add-role-span:hover {
  text-decoration: underline;
  color: grey;
}
</style>
