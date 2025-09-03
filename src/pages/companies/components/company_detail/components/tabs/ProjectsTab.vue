<template>
  <div>
    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('code') }}</th>
            <th>{{ $t('category') }}</th>
            <th>{{ $t('lead') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>
              <a :href="projectLink(project)" target="_blank">
                {{ project.name }}
              </a>
            </td>
            <td>
              {{ project.key }}
            </td>
            <td>
              {{ project.category }}
            </td>
            <td>
              <template v-if="project.lead_id">
                <router-link
                  :to="employeeLink(project.lead_id)"
                  replace
                  target="_blank"
                >
                  {{ project.lead_name }}
                </router-link>
              </template>
              <template v-else>
                {{ project.lead_name }}
              </template>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable } from 'naive-ui';
import { useClientStore } from '@/store/client';

export default {
  name: 'ProjectsTab',
  components: {
    NCard,
    NTable,
  },
  data() {
    return {
      projects: [],
    };
  },
  computed: {
    ...mapStores(useClientStore),
  },
  async created() {
    this.projects = this.clientStore.client_data.projects || [];
  },
  methods: {
    projectLink(project) {
      return this.$router.resolve({
        name: 'projects-page-detail',
        params: { projectId: project.id },
        query: { ...this.$route.query, tab: 'general' },
      }).href;
    },
    employeeLink(employee_id) {
      return {
        name: 'employees-page-detail',
        params: {
          employeeId: employee_id,
        },
      };
    },
  },
};
</script>

<style scoped>
.n-card {
  max-width: 100%;
}
td a {
  cursor: pointer;
}
</style>
