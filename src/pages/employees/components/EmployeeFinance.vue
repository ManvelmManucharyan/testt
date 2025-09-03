<template>
  <employee-salary-filter @search="fetchData" />
  <n-table bordered>
    <thead>
      <tr>
        <th></th>
        <th v-for="monthIndex in 12" :key="monthIndex">
          <month-name
            :year="year"
            :month-index="monthIndex"
            @month-clicked="handleMonthClicked"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <td>{{ $t(item.label) }}</td>
        <td v-for="monthIndex in 12" :key="monthIndex">
          {{ monthlyData[monthIndex]?.[item.key] || '-' }}
        </td>
      </tr>
    </tbody>
  </n-table>

  <employee-monthly-data-modal
    :show="isModalVisible"
    :selected-month="selectedMonth"
    :monthly-data="monthlyData[selectedMonth]"
    @update:show="handleModalClose"
  />
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useMonthlyDataStore } from '@/store/monthlyData';
import EmployeeSalaryFilter from './EmployeeSalaryFilter.vue';
import MonthName from './MonthName.vue';
import EmployeeMonthlyDataModal from './EmployeeMonthlyDataModal.vue';

export default {
  components: { EmployeeSalaryFilter, MonthName, EmployeeMonthlyDataModal },
  data() {
    return {
      data: [
        { label: 'calculated_remuneration', key: 'remuneration' },
        { label: 'currency', key: 'currency' },
        { label: 'payment_type', key: 'employment_type' },
        { label: 'employment_type', key: 'payment_type' },
        { label: 'company', key: 'company' },
      ],
      isModalVisible: false,
      selectedMonth: null,
    };
  },
  computed: {
    ...mapStores(useMonthlyDataStore),
    monthlyData() {
      return this.monthlyDataStore.getMonthlyDataInfo;
    },
    year() {
      return this.$route.query.year || moment().year();
    },
  },
  async created() {
    if (!this.$route.query.year) {
      this.$route.query.year = new Date().getFullYear();
    }
    if (!this.$route.query.salary_type) {
      this.$route.query.salary_type = 'gross';
    }
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      await this.monthlyDataStore.fetchMonthlyData({
        year: this.$route.query.year,
        salary_type: this.$route.query.salary_type,
        employee: this.$route.params.employeeId,
      });
    },
    handleMonthClicked(monthIndex) {
      this.selectedMonth = monthIndex.toString();
      const monthlyDataId = this.monthlyData[this.selectedMonth]?.id;

      if (monthlyDataId) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, monthly_data_id: monthlyDataId },
        });
      } else {
        const query = { ...this.$route.query };
        delete query.monthly_data_id;
        this.$router.push({
          path: this.$route.path,
          query,
        });
      }
      this.isModalVisible = true;
    },
    handleModalClose(value) {
      this.isModalVisible = value;
    },
  },
};
</script>
