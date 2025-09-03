<template>
  <n-popover
    placement="left-start"
    trigger="manual"
    :show="showModal"
    style="max-width: 500px; width: 24vw"
    @clickoutside="onCloseModal"
  >
    <template #trigger>
      <div class="popover-trigger" style="cursor: pointer">
        <slot name="trigger" />
      </div>
    </template>
    <template #default>
      <div class="modal-content">
        <n-card
          :bordered="false"
          role="dialog"
          aria-modal="true"
          :title="
            $t('editRole', { role: departmentrole.name, stageName: stage.name })
          "
        >
          <stage-department-role-form v-model="stageDepartmentForm" />
          <template #footer>
            <n-space justify="end">
              <n-button @click="onCloseModal">
                {{ $t('cancel') }}
              </n-button>
              <n-button type="primary" @click="updateOfferStageDepartmentRole">
                {{ $t('save') }}
              </n-button>
              <n-button type="error" @click="onDelete">
                {{ $t('delete') }}
              </n-button>
            </n-space>
          </template>
        </n-card>
      </div>
    </template>
  </n-popover>
</template>

<script>
import { mapStores } from 'pinia';
import StageDepartmentRoleForm from '@/pages/offers/components/offer_detail/components/modals/StageDepartmentRoleForm.vue';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';

export default {
  name: 'EditDepartmentRolePopover',
  components: {
    StageDepartmentRoleForm,
  },
  props: {
    role: { type: Object, required: true },
    stage: { type: Object, required: true },
    departmentrole: { type: Object, required: true },
    show: Boolean,
    roleData: { type: Object, default: null },
  },
  emits: ['update:show'],
  data() {
    return {
      stageDepartmentForm: {},
      isModalOpening: false,
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
    roleData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.stageDepartmentForm = { ...newVal };
        }
      },
    },
    showModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      } else {
        this.isModalOpening = false;
      }
    },
  },
  methods: {
    async updateOfferStageDepartmentRole() {
      const offerId = this.$route.params.offerId;
      const updateData = {
        offer_stage: this.stage.id,
        offer_department_role: this.departmentrole.id,
        ...this.stageDepartmentForm,
      };
      await this.offerStageDepartmentRolesStore.update(
        this.role.id,
        offerId,
        updateData,
      );
      this.showModal = false;
      this.removeQueryParams();
    },
    onCloseModal() {
      this.showModal = false;
    },
    async onDelete() {
      const offerId = this.$route.params.offerId;
      await this.offerStageDepartmentRolesStore.remove(this.role.id, offerId);
      this.showModal = false;
      this.removeQueryParams();
    },
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.edit_role;
      this.$router.replace({ query });
      this.stageDepartmentForm = {};
    },
  },
};
</script>
