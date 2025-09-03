<template>
  <n-button class="button-container" @click="addRoleToProject">
    {{ $t('addRole') }}
  </n-button>

  <the-modal
    v-model:show="showProjectRoleModal"
    :modal-style="{ width: '50%' }"
    @positive-click="submitProjectRoleForm"
    @negative-click="onClickCloseProjectRoleModal"
    @close="onClickCloseProjectRoleModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="$t('addRole')"
    >
      <project-role-form v-model:form-data="form" />
    </n-card>

    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseProjectRoleModal">
          {{ $t('cancel') }}</n-button
        >
        <n-button type="primary" @click="submitProjectRoleForm">
          {{ $t('save') }}
        </n-button>
      </n-space>
    </template>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NButton } from 'naive-ui';
import TheModal from '@/components/TheModal.vue';
import { useEmployeeProjectsStore } from '@/store/employeeProjects';
import { useEmployeeProjectStore } from '@/store/employeeProject';
import { useProjectStore } from '@/store/project';
import ProjectRoleForm from './ProjectRoleForm.vue';
export default {
  name: 'EmployeeProjectButton',
  components: {
    NCard,
    NButton,
    TheModal,
    ProjectRoleForm,
  },
  data() {
    return {
      form: {},
      showProjectRoleModal: false,
    };
  },
  computed: {
    ...mapStores(
      useEmployeeProjectsStore,
      useEmployeeProjectStore,
      useProjectStore,
    ),
  },
  watch: {
    showProjectRoleModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.add_role': {
      immediate: true,
      handler(newVal) {
        if (newVal === 'true' || newVal === true) {
          this.showProjectRoleModal = true;
        } else {
          this.showProjectRoleModal = false;
        }
      },
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },
    async submitProjectRoleForm() {
      const formattedData = {
        ...this.form,
        project: this.$route.params.projectId,
        activation_date: this.formatDate(this.form.activation_date),
        deactivation_date: this.formatDate(this.form.deactivation_date),
      };
      await this.employeeProjectStore.create(formattedData).then(() => {
        this.removeQueryParams();
        this.showProjectRoleModal = false;
      });
    },
    addRoleToProject() {
      this.$router.push({
        query: {
          ...this.$route.query,
          add_role: 'true',
        },
      });
      this.showProjectRoleModal = true;
    },
    onClickCloseProjectRoleModal() {
      this.showProjectRoleModal = false;
      this.removeQueryParams();
    },

    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.add_role;
      this.$router.push({ query });
      this.form = {};
    },
  },
};
</script>
