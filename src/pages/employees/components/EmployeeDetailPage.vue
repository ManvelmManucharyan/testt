<template>
  <div>
    <div class="form-group">
      <employee-avatar :employee="formData" :link="false" :size="50" />
    </div>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="personalInfo" :tab="$t('personalInfo')">
        <employee-personal-info :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="requisites" :tab="$t('requisites')">
        <employee-requisites :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="metrics" :tab="$t('metrics')">
        <employee-metrics :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="preferences" :tab="$t('preferences')">
        <employee-preferences :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="finance" :tab="$t('finance')">
        <employee-finance />
      </n-tab-pane>
      <n-tab-pane name="roles" :tab="$t('roles')">
        <employee-roles />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCurrencyRatesStore } from '@/store/currencyRates';
import EmployeePersonalInfo from './EmployeePersonalInfo.vue';
import EmployeeRequisites from './EmployeeRequisites.vue';
import EmployeePreferences from './EmployeePreferences.vue';
import { useEmployeesStore } from '@/store/employee';
import EmployeeMetrics from './EmployeeMetrics.vue';
import EmployeeFinance from './EmployeeFinance.vue';
import EmployeeRoles from './EmployeeRoles.vue';
import EmployeeAvatar from '@/components/EmployeeAvatar.vue';

export default {
  components: {
    EmployeePersonalInfo,
    EmployeeRequisites,
    EmployeePreferences,
    EmployeeMetrics,
    EmployeeFinance,
    EmployeeRoles,
    EmployeeAvatar,
  },
  data() {
    return {
      activeTab: 'personalInfo',
      formData: [],
    };
  },
  computed: {
    ...mapStores(useCurrencyRatesStore, useEmployeesStore),
  },
  watch: {
    '$route.query.tab'(newTab, oldTab) {
      this.activeTab = newTab || 'personalInfo';

      if (this.activeTab === 'finance') {
        const query = { ...this.$route.query };
        if (!query.year) {
          query.year = new Date().getFullYear();
        }
        if (!query.salary_type) {
          query.salary_type = 'gross';
        }

        if (newTab !== oldTab) {
          this.fetchData();
        }

        this.$router.replace({
          query: {
            ...query,
            tab: 'finance',
          },
        });
      }
    },

    activeTab(newVal) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          tab: newVal,
        },
      });
    },
  },

  async created() {
    const query = { ...this.$route.query };

    if (query.tab) {
      this.activeTab = query.tab;
    } else {
      query.tab = 'personalInfo';
      this.activeTab = 'personalInfo';
    }

    if (this.activeTab === 'finance' && !query.year) {
      query.year = new Date().getFullYear();
      query.salary_type = 'gross';
    }

    const orderedQuery = {
      tab: query.tab,
      year: query.year,
      salary_type: query.salary_type,
      ...query,
    };

    this.$router.replace({ query: orderedQuery });

    const employeeId = this.$route.params.employeeId;
    await this.employeesStore.fetch(employeeId);
    this.formData = this.employeesStore.employeeData;
  },
  methods: {
    async fetchData() {
      const { tab, year } = this.$route.query;

      if (tab === 'finance') {
        await this.currencyRatesStore.fetch({ year });
      }
    },
  },
};
</script>
