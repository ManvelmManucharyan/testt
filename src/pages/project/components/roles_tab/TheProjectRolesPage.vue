<template>
  <div>
    <the-filter @search="fetchData" />
    <div class="button-container">
      <add-role-button />
      <navigate-to-offer-roles-button />
    </div>
    <project-roles-table />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useEmployeeProjectsStore } from '@/store/employeeProjects';
import TheFilter from './components/TheFilter.vue';
import ProjectRolesTable from './components/ProjectRolesTable.vue';
import AddRoleButton from './components/AddRoleButton.vue';
import NavigateToOfferRolesButton from './components/NavigateToOfferRolesButton.vue';

export default {
  components: {
    TheFilter,
    ProjectRolesTable,
    AddRoleButton,
    NavigateToOfferRolesButton,
  },
  computed: mapStores(useEmployeeProjectsStore),
  watch: {
    '$route.query'() {
      const query = { ...this.$route.query };
      if (!query.employee_activity) {
        query.employee_activity = 'active';
      }
      this.$router.replace({
        query: {
          ...query,
        },
      });
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const currentQuery = { ...this.$route.query };
      if (!currentQuery.employee_activity) {
        currentQuery.employee_activity = 'active';
      }
      currentQuery.tab = 'roles';

      await this.$router.push({ path: this.$route.path, query: currentQuery });
      const projectId = this.$route.params.projectId;
      await this.employeeProjectsStore.fetch({
        project: projectId,
        show: this.$route.query.employee_activity,
      });
    },
  },
};
</script>

<style scoped>
.button-container {
  position: absolute;
  top: 10px;
  right: 70px;
  display: flex;
  gap: 10px;
}
</style>
