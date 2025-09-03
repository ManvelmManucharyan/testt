<template>
  <div>
    <div v-if="!$route.params.employeeId" class="header">
      <the-filter @search="fetchData" />
    </div>
    <n-card v-if="!$route.params.employeeId">
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('fullName') }}</th>
            <th>{{ $t('telegram') }}</th>
            <th>{{ $t('phoneNumber') }}</th>
            <th>{{ $t('entranceDate') }}</th>
            <th>{{ $t('timeZone') }}</th>
            <th>{{ $t('isActive') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employeesStore.data" :key="employee.id">
            <td>
              <employee-avatar :employee="employee" :target="'_self'" />
            </td>
            <td>
              <a
                v-if="employee.telegram_account"
                :href="`https://t.me/${employee.telegram_account.replace('@', '')}`"
                target="_blank"
              >
                {{ employee.telegram_account }}
              </a>
              <div v-else>
                {{ '-' }}
              </div>
            </td>
            <td>{{ employee.phone_number || '-' }}</td>
            <td>{{ employee.entrance_date || '-' }}</td>
            <td>{{ employee.timezone || '-' }}</td>
            <td>
              <n-icon v-if="employee.is_active" color="green" size="20">
                <checkmark-circle-outline />
              </n-icon>
              <n-icon v-else color="red" size="20">
                <close-circle-outline />
              </n-icon>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>

    <router-view />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable, NIcon } from 'naive-ui';
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5';
import TheFilter from '@/pages/employees/components/TheFilter.vue';
import { useEmployeesStore } from '@/store/employee';
import EmployeeAvatar from '@/components/EmployeeAvatar.vue';

export default {
  name: 'Employees',
  components: {
    NCard,
    NTable,
    NIcon,
    TheFilter,
    CheckmarkCircleOutline,
    CloseCircleOutline,
    EmployeeAvatar,
  },
  data() {
    return {
      employees: [],
      form: {},
    };
  },
  computed: mapStores(useEmployeesStore),
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      const currentQuery = { ...this.$route.query };

      if (!currentQuery.activity_type) {
        currentQuery.activity_type = 'active';
      }

      await this.$router.push({ path: this.$route.path, query: currentQuery });

      await this.employeesStore.fetchEmployees(
        this.$route.query.affiliation_type,
        this.$route.query.activity_type,
        this.$route.query.search,
      );
    },
  },
};
</script>

<style scoped>
.n-card {
  max-width: 100%;
}

td img {
  border-radius: 50%;
  object-fit: cover;
}

router-link {
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;
}
</style>
