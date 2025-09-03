<template>
  <n-popover
    placement="left"
    trigger="manual"
    :show="showEmployeeRoleModal"
    :style="[
      { maxWidth: '460px', width: '24vw' },
      isEditMode ? { left: '-220px' } : {},
    ]"
  >
    <template #trigger>
      <div style="cursor: pointer">
        <add-button
          :tooltip="
            hasProject
              ? $t('addEmployeeToStage', {
                  role: departmentrole.name,
                  stageName: stage.name,
                })
              : $t('offerHasNoProject')
          "
          :disabled="!hasProject"
          @click="openEmployeeRoleModal(stage, departmentrole)"
        />
      </div>
    </template>
    <template #default>
      <div class="modal-overlay" @click="onClickCloseEmployeeProjectModal">
        <div class="modal-content" @click.stop>
          <n-card
            :bordered="false"
            role="dialog"
            aria-modal="true"
            :title="
              isEditMode
                ? $t('editEmployeeStageRole', {
                    name: stageEmployeeRoleForm.employee_name,
                    role: stageEmployeeRoleForm.role_name,
                    stageName: stageEmployeeRoleForm.stage_name,
                  })
                : $t('addEmployeeToStage', {
                    role: departmentrole.name,
                    stageName: stage.name,
                  })
            "
          >
            <add-employee-to-stage-form
              v-model:form-data="stageEmployeeRoleForm"
              v-model:period-range="periodRange"
              :stage="stage"
            />
            <template #footer>
              <n-space justify="end">
                <n-button @click="onClickCloseEmployeeProjectModal">
                  {{ $t('cancel') }}
                </n-button>
                <n-button type="primary" @click="submitEmployeeProjectForm">
                  {{ $t('save') }}
                </n-button>
                <n-button v-if="isEditMode" type="error" @click="onDelete">
                  {{ $t('delete') }}
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
import AddEmployeeToStageForm from './AddEmployeeToStageForm.vue';
import { useEmployeeProjectsStore } from '@/store/employeeProjects';
import { useEmployeeProjectStore } from '@/store/employeeProject';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';
import AddButton from '@/components/AddButton.vue';
import { useOfferStore } from '@/store/offer';

export default {
  name: 'AddEmployeeToStageButton',
  components: { AddEmployeeToStageForm, AddButton },
  props: {
    stage: { type: Object, required: true },
    departmentrole: { type: Object, required: true },
    role: { type: Object, required: false },
  },
  data() {
    return {
      selectedStage: null,
      selectedDepartmentRole: null,
      stageEmployeeRoleForm: {},
      showEmployeeRoleModal: false,
      periodRange: null,
      isModalOpening: false,
    };
  },
  computed: {
    ...mapStores(
      useEmployeeProjectsStore,
      useEmployeeProjectStore,
      useOfferStageDepartmentRolesStore,
      useOfferStore,
    ),
    hasProject() {
      return this.offerStore.offerData?.project !== null;
    },
    isEditMode() {
      return !!this.$route.query.employee_project;
    },
  },
  watch: {
    '$route.query.add_employee': {
      immediate: true,
      handler(val) {
        const { stage_id, departmentrole_id } = this.$route.query;
        if (
          val &&
          stage_id === String(this.stage.id) &&
          departmentrole_id === String(this.departmentrole.id)
        ) {
          this.showEmployeeRoleModal = true;
          this.periodRange = [
            new Date(this.selectedStage.from_date).getTime(),
            new Date(this.selectedStage.to_date).getTime(),
          ];
        } else {
          this.showEmployeeRoleModal = false;
          this.periodRange = null;
          this.stageEmployeeRoleForm = {};
        }
      },
    },
    '$route.query.employee_project': {
      immediate: true,
      async handler(newEmployeeProjectId, oldEmployeeProjectId) {
        if (newEmployeeProjectId === oldEmployeeProjectId) return;

        const isRelevant = this.role?.employee_projects?.some(
          (ep) => String(ep.id) === newEmployeeProjectId,
        );

        if (newEmployeeProjectId && isRelevant) {
          this.showEmployeeRoleModal = true;
          await this.employeeProjectStore.retrieve(newEmployeeProjectId);
          const data = this.employeeProjectStore.employeeProjectData;
          this.stageEmployeeRoleForm = { ...data };
          if (data.activation_date && data.deactivation_date) {
            this.periodRange = [
              new Date(data.activation_date).getTime(),
              new Date(data.deactivation_date).getTime(),
            ];
          } else {
            this.periodRange = null;
          }
        } else if (!newEmployeeProjectId) {
          if (!this.$route.query.add_employee) {
            this.showEmployeeRoleModal = false;
            this.periodRange = null;
            this.stageEmployeeRoleForm = {};
          }
        }
      },
    },
    showEmployeeRoleModal(newVal) {
      if (newVal) {
        this.isModalOpening = true;
        this.$nextTick(() => {
          setTimeout(() => {
            this.isModalOpening = false;
          }, 100);
        });
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(e) {
      if (!this.showEmployeeRoleModal || this.isModalOpening) return;
      if (e.target.closest('.n-popover')) return;

      this.onClickCloseEmployeeProjectModal();
    },
    openEmployeeRoleModal(stage, departmentRole) {
      if (this.showEmployeeRoleModal) return;

      this.selectedStage = stage;
      this.selectedDepartmentRole = departmentRole;

      const newQuery = {
        ...this.$route.query,
        add_employee: true,
        stage_id: stage.id,
        departmentrole_id: departmentRole.id,
      };

      delete newQuery.employee_project;

      this.$router.push({ query: newQuery });

      this.showEmployeeRoleModal = true;

      this.stageEmployeeRoleForm = {};

      if (!this.$route.query.employee_project) {
        this.periodRange = [
          new Date(stage.from_date).getTime(),
          new Date(stage.to_date).getTime(),
        ];
      }
    },
    submitEmployeeProjectForm() {
      if (!this.periodRange) return;

      const fmt = (t) => {
        const d = new Date(t);
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      };

      const r = this.offerStageDepartmentRolesStore.data.find(
        (x) =>
          x.offer_stage === this.stage.id &&
          x.offer_department_role === this.departmentrole.id,
      );

      const body = {
        employee: this.stageEmployeeRoleForm.employee,
        activation_date: fmt(this.periodRange[0]),
        deactivation_date: fmt(this.periodRange[1]),
        offer_stage_department_role: r.id,
        project: this.offerStore.offerData.project,
      };

      if (this.isEditMode) {
        this.employeeProjectStore
          .update(this.$route.query.employee_project, body, {
            offer_department_role: this.departmentrole.id,
            offerId: this.$route.params.offerId,
          })
          .then(() => this.onClickCloseEmployeeProjectModal());
      } else {
        this.employeeProjectStore
          .create(body, {
            offer_department_role: this.departmentrole.id,
            offerId: this.$route.params.offerId,
          })
          .then(() => {
            this.onClickCloseEmployeeProjectModal();
          });
      }
    },
    async onClickCloseEmployeeProjectModal() {
      this.showEmployeeRoleModal = false;
      const q = { ...this.$route.query };
      delete q.employee_project;
      delete q.add_employee;
      delete q.stage_id;
      delete q.departmentrole_id;
      await new Promise((resolve) => setTimeout(resolve, 300));
      await this.$router.replace({ query: q });
      this.periodRange = null;
      this.stageEmployeeRoleForm = {};
    },
    onDelete() {
      const id = this.$route.query.employee_project;
      this.employeeProjectStore.remove(id, {
        offerId: this.$route.params.offerId,
      });
      this.onClickCloseEmployeeProjectModal();
    },
  },
};
</script>
