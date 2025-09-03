<template>
  <n-modal
    :show="show"
    preset="dialog"
    :show-icon="false"
    style="width: 55%; max-height: 80vh"
    @close="onClose"
    @update:show="handleShowUpdate"
  >
    <div style="max-height: 60vh; overflow-y: auto">
      <n-card
        :bordered="false"
        role="dialog"
        aria-modal="true"
        :title="modalTitle"
      >
        <employee-monthly-data-form v-model="form" />
      </n-card>
    </div>
    <template #action>
      <n-space justify="end">
        <n-button ghost @click="onClose">{{ $t('cancel') }}</n-button>
        <n-button type="primary" @click="submitForm">{{
          $t('confirm')
        }}</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script>
import moment from 'moment';
import EmployeeMonthlyDataForm from './EmployeeMonthlyDataForm.vue';
import { mapStores } from 'pinia';
import { useMonthlyDataStore } from '@/store/monthlyData';
import { useEmployeesStore } from '@/store/employee';

export default {
  components: { EmployeeMonthlyDataForm },
  props: {
    show: Boolean,
    selectedMonth: String,
  },
  emits: ['update:show'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapStores(useMonthlyDataStore, useEmployeesStore),

    modalTitle() {
      const employeeName = this.employeesStore.employeeData.full_name;
      return `${this.$t('salaryFor')} ${employeeName}`;
    },
  },
  watch: {
    '$route.query.monthly_data_id': {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          const dataId = this.$route.query.monthly_data_id;
          await this.monthlyDataStore.fetch(dataId);
          this.form = this.monthlyDataStore.monthlyData;
        }
      },
    },
  },
  methods: {
    cleanupRoute() {
      const currentQuery = { ...this.$route.query };
      delete currentQuery.monthly_data_id;
      if (this.$route.query.monthly_data_id) {
        this.$router.push({
          path: this.$route.path,
          query: currentQuery,
        });
      }
    },
    onClose() {
      this.cleanupRoute();
      this.form = {};
      this.$emit('update:show', false);
    },
    async submitForm() {
      const year = this.$route.query.year;

      const paddedMonth = String(this.selectedMonth).padStart(2, '0');

      const formattedDate = moment(
        `${year}-${paddedMonth}-01`,
        'YYYY-MM-DD',
      ).format('MM/DD/YYYY');

      const payload = {
        ...this.form,
        employment_type:
          this.form.employment_type?.id || this.form.employment_type,
        date: formattedDate,
      };

      if (this.$route.query.monthly_data_id) {
        const dataId = this.$route.query.monthly_data_id;
        this.form.month = this.selectedMonth;
        await this.monthlyDataStore.update(dataId, payload, {
          year: this.$route.query.year,
          salary_type: this.$route.query.salary_type,
          employee: this.$route.params.employeeId,
        });
      } else {
        const createPayload = {
          ...payload,
          employee: this.$route.params.employeeId,
        };

        await this.monthlyDataStore.create(createPayload, {
          year: this.$route.query.year,
          salary_type: this.$route.query.salary_type,
          employee: this.$route.params.employeeId,
        });
      }

      this.onClose();
    },

    handleShowUpdate(value) {
      this.$emit('update:show', value);
      if (!value) {
        this.cleanupRoute();
        this.form = {};
      }
    },
  },
};
</script>
