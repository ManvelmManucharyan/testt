<template>
  <n-card>
    <div v-if="isLoading" class="loading-container">
      <n-spin size="large" />
    </div>
    <div v-else class="table-container">
      <n-table bordered :sticky="true" :max-height="650">
        <thead>
          <tr>
            <th></th>
            <th v-for="month in months" :key="month">{{ month }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in transformedData" :key="employee.id">
            <td>
              <router-link
                :to="employeeLink(employee.id)"
                replace
                target="_blank"
              >
                {{ employee.name }}
              </router-link>
            </td>
            <td v-for="month in months" :key="month">
              <div v-if="employee.monthlyData[month]">
                <div
                  v-for="(salary, index) in employee.monthlyData[month]"
                  :key="index"
                >
                  <div>{{ salary.employment_type_name }}</div>
                  <div>
                    {{ formatNumber(salary.calculated_remuneration, 1) }}
                  </div>
                  <div>{{ salary.currency }}</div>
                </div>
              </div>
              <div v-else>-</div>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </n-card>
</template>

<script>
import { mapStores } from 'pinia';
import moment from 'moment';
import { useMonthlyDataStore } from '@/store/monthlyData';
import { formatNumber } from '@/utils/numeric';
import { NTable, NCard, NSpin } from 'naive-ui';

export default {
  name: 'SalarySheet',
  components: {
    NTable,
    NCard,
    NSpin,
  },
  computed: {
    ...mapStores(useMonthlyDataStore),
    isLoading() {
      return this.monthlyDataStore.isLoading;
    },
    months() {
      return Array.from({ length: 12 }, (_, i) =>
        moment().locale(this.$i18n.locale).month(i).format('MMM'),
      );
    },
    transformedData() {
      const rawData = this.monthlyDataStore.data;
      const groupedData = {};

      rawData.forEach((item) => {
        if (!groupedData[item.employee]) {
          groupedData[item.employee] = {
            id: item.employee,
            name: item.employee_name,
            monthlyData: {},
          };
        }

        const month = moment(item.date, 'MM/DD/YYYY', true)
          .locale(this.$i18n.locale)
          .format('MMM');

        if (!groupedData[item.employee].monthlyData[month]) {
          groupedData[item.employee].monthlyData[month] = [];
        }

        groupedData[item.employee].monthlyData[month].push({
          currency: item.currency,
          employment_type_name: item.employment_type_name,
          calculated_remuneration: Math.round(item.calculated_remuneration),
          flex: item.flex,
        });
      });

      return Object.values(groupedData);
    },
  },
  methods: {
    employeeLink(employee_id) {
      return {
        name: 'employees-page-detail',
        params: { employeeId: employee_id },
        query: {
          tab: 'finance',
          year: this.$route.query.year,
          salary_type: this.$route.query.salary_type,
        },
      };
    },
    formatNumber,
  },
};
</script>

<style scoped>
.table-container {
  max-height: 650px;
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
}

.table-container .n-table tbody {
  display: block;
  overflow-y: auto;
  max-height: 610px;
}

.table-container .n-table tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.table-container::-webkit-scrollbar {
  display: none;
}

.table-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}
</style>
