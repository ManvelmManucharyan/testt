<template>
  <employee-roles-header @search="fetchData" />
  <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>
  <n-table v-else :bordered="true" :striped="true">
    <thead>
      <tr>
        <th>{{ $t('project') }}</th>
        <th>{{ $t('scheduledLoad') }}</th>
        <th>{{ $t('role') }}</th>
        <th>{{ $t('activeFromTo') }}</th>
        <th>{{ $t('workingHours') }}</th>
        <th>{{ $t('boundToOffer') }}</th>
        <th>{{ $t('created') }}</th>
        <th>{{ $t('updated') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="employeeProject in employeeProjectsStore.data"
        :key="employeeProject.id"
      >
        <td>
          <router-link
            :to="projectLink(employeeProject.project)"
            replace
            target="_blank"
          >
            {{ employeeProject.project_name }}
          </router-link>
        </td>
        <td>{{ employeeProject.effective_payment_type }}</td>
        <td>{{ employeeProject.role_name }}</td>
        <td>
          {{
            $formatDateRange(
              employeeProject.activation_date,
              employeeProject.deactivation_date,
            )
          }}
        </td>
        <td>
          {{ employeeProject.total_hours }}
        </td>
        <td>
          <div v-if="employeeProject.offer_id">
            <a :href="offerLink(employeeProject.offer_id)" target="_blank">
              {{ employeeProject.offer_name }}
            </a>
          </div>
          <div v-else>-</div>
        </td>
        <td>
          {{ formatSingleDate(employeeProject.created_at) }}
        </td>
        <td>
          {{ formatSingleDate(employeeProject.updated_at) }}
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
<script>
import { mapStores } from 'pinia';
import EmployeeRolesHeader from './EmployeeRolesHeader.vue';
import { useEmployeeProjectsStore } from '@/store/employeeProjects';
import { formatSingleDate } from '@/utils/time';
import { offerLink } from '@/utils/links';
export default {
  components: {
    EmployeeRolesHeader,
  },
  computed: {
    ...mapStores(useEmployeeProjectsStore),
    isLoading() {
      return this.employeeProjectsStore.isLoading;
    },
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    formatSingleDate,
    projectLink(projectId) {
      return this.$router.resolve({
        name: 'projects-page-detail',
        params: { projectId: projectId },
        query: { tab: 'general' },
      }).href;
    },
    async fetchData() {
      const { employeeId } = this.$route.params;
      const query = { ...this.$route.query };
      await this.employeeProjectsStore.fetch({
        employee: employeeId,
        project: query.project,
        from_date: query.from_date,
        to_date: query.to_date,
        include_hours: true,
      });
    },
    offerLink,
  },
};
</script>
