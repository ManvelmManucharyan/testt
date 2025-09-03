<template>
  <n-card>
    <n-table :bordered="true" :striped="true">
      <thead>
        <tr>
          <th></th>
          <th>{{ $t('employee') }}</th>
          <th>{{ $t('scheduledLoad') }}</th>
          <th>{{ $t('role') }}</th>
          <th>{{ $t('activeFromTo') }}</th>
          <th>{{ $t('boundToOffer') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="employeeProject in employeeProjectsStore.data"
          :key="employeeProject.id"
        >
          <td>
            <avatar
              :avatar="employeeProject.employee_avatar || '-'"
              :size="40"
            />
          </td>
          <td>
            <router-link
              :to="employeeLink(employeeProject.employee)"
              replace
              target="_blank"
            >
              {{ employeeProject.employee_name }}
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
            <div v-if="employeeProject.offer_id">
              <a :href="offerLink(employeeProject.offer_id)" target="_blank">
                {{ employeeProject.offer_name }}
              </a>
            </div>
            <div v-else>-</div>
          </td>
          <td class="delete-item-col">
            <delete-item
              @positive-click="deleteEmployeeRole(employeeProject.id)"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<script>
import { mapStores } from 'pinia';
import { useEmployeeProjectsStore } from '@/store/employeeProjects';
import { useEmployeeProjectStore } from '@/store/employeeProject';
import { NTable, NCard } from 'naive-ui';
import Avatar from '@/components/Avatar.vue';
import DeleteItem from '@/components/DeleteItem.vue';
import { offerLink } from '@/utils/links';

export default {
  name: 'ProjectRolesTable',
  components: {
    NTable,
    NCard,
    Avatar,
    DeleteItem,
  },

  computed: {
    ...mapStores(useEmployeeProjectsStore, useEmployeeProjectStore),
    employee_projects() {
      return this.employeeProjectsStore.data.map((employee_project) => ({
        id: employee_project.id,
        active: this,
      }));
    },
  },
  methods: {
    employeeLink(employee_id) {
      return {
        name: 'employees-page-detail',
        params: {
          employeeId: employee_id,
        },
      };
    },
    deleteEmployeeRole(roleId) {
      this.employeeProjectStore.remove(roleId);
    },
    offerLink,
  },
};
</script>
