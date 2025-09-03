<template>
  <div class="payments-table">
    <the-project-payments-filter @search="fetchData" />
    <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>
    <div v-else class="table-container">
      <table ref="paymentsTable" class="payments-table__table">
        <thead>
          <tr>
            <th class="sticky-header sticky-col sticky-col-1" rowspan="2">
              {{ $t('project') }}
            </th>
            <th class="sticky-header sticky-col sticky-col-2" rowspan="2">
              {{ $t('financingSource') }}
            </th>
            <th class="sticky-header sticky-col sticky-col-3" rowspan="2">
              {{ $t('stage') }}
            </th>
            <th class="sticky-header sticky-col sticky-col-4" rowspan="2">
              {{ $t('total') }}
            </th>
            <th class="sticky-header sticky-col sticky-col-5" rowspan="2">
              {{ $t('rub') }}
            </th>
            <th
              v-for="yearGroup in yearGroups"
              :key="yearGroup.year"
              :colspan="yearGroup.months.length"
              class="sticky-header year-cell"
            >
              {{ yearGroup.year }}
            </th>
          </tr>
          <tr>
            <template
              v-for="yearGroup in yearGroups"
              :key="`months-${yearGroup.year}`"
            >
              <th
                v-for="month in yearGroup.months"
                :key="`${yearGroup.year}-${month.index}`"
                class="sticky-header month-cell"
              >
                {{ month.name }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="project in projectsWithData"
            :key="project.project.id"
          >
            <template
              v-for="(source, sIdx) in project.processedData"
              :key="source.id"
            >
              <template
                v-for="(stage, stIdx) in source.stages"
                :key="`${project.project.id}-${sIdx}-${stIdx}`"
              >
                <tr>
                  <td
                    v-if="sIdx === 0 && stIdx === 0"
                    class="sticky-col sticky-col-1 project-cell"
                    :rowspan="project.totalRows * 3"
                  >
                    <router-link
                      :to="projectLink(project.project.id)"
                      replace
                      target="_blank"
                      :title="project.project.name"
                      class="truncate"
                    >
                      {{ project.project.name }}
                    </router-link>
                  </td>
                  <td
                    v-if="stIdx === 0"
                    class="sticky-col sticky-col-2"
                    :rowspan="source.stages.length * 3"
                    :title="source.name"
                  >
                    <router-link
                      :to="companyLink(source.id)"
                      replace
                      target="_blank"
                      :title="source.name"
                      class="truncate"
                    >
                      {{ source.name }}
                    </router-link>
                    <div>
                      {{ tariffName(source.tariff) }}
                    </div>
                  </td>
                  <td class="sticky-col sticky-col-3" rowspan="3">
                    <router-link
                      :to="stageLink(stage.offer_id, stage.id)"
                      replace
                      target="_blank"
                      :title="stage.name"
                      class="truncate"
                    >
                      {{ stage.name }}
                    </router-link>
                    <div>
                      {{ formatSingleDate(stage.from_date) }}
                      -
                      {{ formatSingleDate(stage.to_date) }}
                    </div>
                  </td>
                  <td class="sticky-col sticky-col-4">{{ $t('plan') }}</td>
                  <td class="sticky-col sticky-col-5 numeric">
                    {{ formatNumber(stage.totals?.plan, 1) }}
                  </td>
                  <template
                    v-for="yearGroup in yearGroups"
                    :key="`plan-${yearGroup.year}`"
                  >
                    <td
                      v-for="month in yearGroup.months"
                      :key="`plan-${yearGroup.year}-${month.index}`"
                      class="numeric"
                    >
                      <payment-detailed-view
                        :monthly-data="
                          getMonthlyValueByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'plan',
                          )
                        "
                        :data="
                          getTableDetailsByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'plan',
                          )
                        "
                        :tariff-rate-date="stage.tariff_rate_date"
                        :offer-id="stage.offer_id"
                        :project-id="project.project.id"
                        :date="month.fullDate"
                        :type="'plan'"
                      />
                    </td>
                  </template>
                </tr>
                <tr>
                  <td class="sticky-col sticky-col-4">{{ $t('invoice') }}</td>
                  <td class="sticky-col sticky-col-5 numeric">
                    {{ formatNumber(stage.totals.invoice_amount, 1) }}
                  </td>
                  <template
                    v-for="yearGroup in yearGroups"
                    :key="`invoice-${yearGroup.year}`"
                  >
                    <td
                      v-for="month in yearGroup.months"
                      :key="`invoice-${yearGroup.year}-${month.index}`"
                      class="numeric"
                    >
                      <payment-detailed-view
                        :monthly-data="
                          getMonthlyValueByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'invoice',
                          )
                        "
                        :data="
                          getTableDetailsByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'invoice',
                          )
                        "
                        :tariff-rate-date="stage.tariff_rate_date"
                        :offer-id="stage.offer_id"
                        :date="month.fullDate"
                        :type="'invoice'"
                        :project-id="project.project.id"
                      />
                    </td>
                  </template>
                </tr>
                <tr>
                  <td class="sticky-col sticky-col-4">{{ $t('real') }}</td>
                  <td class="sticky-col sticky-col-5 numeric">
                    {{ formatNumber(stage.totals?.real, 1) }}
                  </td>
                  <template
                    v-for="yearGroup in yearGroups"
                    :key="`real-${yearGroup.year}`"
                  >
                    <td
                      v-for="month in yearGroup.months"
                      :key="`real-${yearGroup.year}-${month.index}`"
                      class="numeric"
                    >
                      <payment-detailed-view
                        :monthly-data="
                          getMonthlyValueByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'real',
                          )
                        "
                        :data="
                          getTableDetailsByDate(
                            stage.monthly_data,
                            yearGroup.year,
                            month.index,
                            'real',
                          )
                        "
                        :tariff-rate-date="stage.tariff_rate_date"
                        :offer-id="stage.offer_id"
                        :project-id="project.project.id"
                        :date="month.fullDate"
                        :type="'real'"
                      />
                    </td>
                  </template>
                </tr>
              </template>
            </template>
          </template>
          <tr v-if="projectsWithData.length === 0">
            <td :colspan="5 + totalMonthsCount" class="no-data">
              {{ $t('noData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useStaticChoicesStore } from '@/store/staticChoices';
import { getProjectPayments } from '@/api/project-payments';
import TheProjectPaymentsFilter from './TheProjectPaymentsFilter.vue';
import PaymentDetailedView from './PaymentDetailedView.vue';
import { formatNumber } from '@/utils/numeric';
import { formatSingleDate } from '@/utils/time';
import { projectLink, companyLink, stageLink } from '@/utils/links';
import { getLocalStorageKey, setLocalStorageKey } from '@/utils/localStorage';

export default {
  name: 'PaymentsTable',
  components: { TheProjectPaymentsFilter, PaymentDetailedView },
  data() {
    return {
      projects: [],
      isLoading: true,
      showModal: false,
      columnWidths: [],
    };
  },
  computed: {
    ...mapStores(useStaticChoicesStore),
    dateRange() {
      const fromDate =
        this.$route.query.from_date ||
        getLocalStorageKey('project_payment_from_date');
      const toDate =
        this.$route.query.to_date ||
        getLocalStorageKey('project_payment_to_date');
      if (fromDate && toDate) {
        return {
          from: moment(fromDate),
          to: moment(toDate),
        };
      }
      if (!this.projects || this.projects.length === 0) {
        return { from: null, to: null };
      }
      const allDates = this.projects
        .flatMap((p) => p.financial_source ?? [])
        .flatMap((src) => src.stages ?? [])
        .flatMap((st) => st.monthly_data ?? [])
        .map((md) => moment(md.date, 'YYYY-MM'))
        .filter((d) => d.isValid());

      let minDate = null,
        maxDate = null;
      if (allDates.length) {
        minDate = moment.min(allDates);
        maxDate = moment.max(allDates);
      }

      return {
        from: minDate,
        to: maxDate,
      };
    },
    yearGroups() {
      const { from, to } = this.dateRange;
      if (!from || !to) {
        return [];
      }
      const groups = [];
      const startYear = from.year();
      const endYear = to.year();
      for (let year = startYear; year <= endYear; year++) {
        const yearStart = year === startYear ? from.month() : 0;
        const yearEnd = year === endYear ? to.month() : 11;
        const months = [];
        for (let month = yearStart; month <= yearEnd; month++) {
          const monthMoment = moment().year(year).month(month);
          months.push({
            index: month + 1,
            name: monthMoment.locale(this.$i18n.locale).format('MMM'),
            fullDate: monthMoment.date(1).format('DD/MM/YYYY'),
          });
        }
        if (months.length > 0) {
          groups.push({
            year,
            months,
          });
        }
      }
      return groups;
    },
    totalMonthsCount() {
      return this.yearGroups.reduce(
        (total, group) => total + group.months.length,
        0,
      );
    },
    projectsWithData() {
      return this.projects
        .map((p) => {
          const pd = this.processProjectData(p);
          return {
            project: p.project,
            processedData: pd,
            totalRows: pd.reduce((sum, s) => sum + s.stages.length, 0),
          };
        })
        .filter((p) => p.totalRows > 0);
    },
  },
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.saveFiltersToLocalStorage(newQuery);
      },
      deep: true,
    },
    projectsWithData: {
      handler() {
        this.$nextTick(() => {
          this.calculateStickyPositions();
        });
      },
      deep: true,
    },
  },
  created() {
    this.initializeFromLocalStorage();
    this.loadProjects();
  },
  mounted() {
    this.$nextTick(() => {
      this.calculateStickyPositions();
    });
  },
  updated() {
    this.$nextTick(() => {
      this.calculateStickyPositions();
    });
  },
  methods: {
    calculateStickyPositions() {
      if (!this.$refs.paymentsTable) return;

      const table = this.$refs.paymentsTable;
      const headerRow = table.querySelector('thead tr');
      if (!headerRow) return;

      const cells = headerRow.querySelectorAll('th');
      let cumulativeWidth = 0;
      for (let i = 0; i < Math.min(5, cells.length); i++) {
        if (i > 0) {
          cumulativeWidth += cells[i - 1].offsetWidth;
        }
        document.documentElement.style.setProperty(
          `--sticky-col-${i + 1}-left`,
          `${cumulativeWidth}px`,
        );
      }
    },
    tariffName(tariff) {
      return this.staticChoicesStore.data.tariff_choices.find(
        (item) => item.id === tariff,
      ).name;
    },
    initializeFromLocalStorage() {
      const savedFilters = this.getFiltersFromLocalStorage();
      if (
        Object.keys(this.$route.query).length === 0 &&
        Object.keys(savedFilters).length > 0
      ) {
        this.$router.replace({
          path: this.$route.path,
          query: savedFilters,
        });
      } else {
        this.saveFiltersToLocalStorage(this.$route.query);
      }
    },
    getFiltersFromLocalStorage() {
      const filters = {};
      const fromDate = getLocalStorageKey('project_payment_from_date');
      const toDate = getLocalStorageKey('project_payment_to_date');
      const projectIds = getLocalStorageKey('project_payment_project_ids');
      if (fromDate) filters.from_date = fromDate;
      if (toDate) filters.to_date = toDate;
      if (projectIds) filters.project_ids = projectIds;
      return filters;
    },
    clearSavedFilters() {
      setLocalStorageKey('project_payment_from_date', null);
      setLocalStorageKey('project_payment_to_date', null);
      setLocalStorageKey('project_payment_project_ids', null);
      setLocalStorageKey('project_payment_filters', null);
    },
    saveFiltersToLocalStorage(queryParams) {
      const keys = ['from_date', 'to_date', 'project_ids'];
      keys.forEach((key) => {
        const storageKey = `project_payment_${key}`;
        if (queryParams[key]) {
          setLocalStorageKey(storageKey, queryParams[key]);
        } else {
          localStorage.removeItem(storageKey);
        }
      });
      setLocalStorageKey(
        'project_payment_filters',
        JSON.stringify(queryParams),
      );
    },
    async fetchData() {
      const q = { ...this.$route.query };
      if (!q.from_date && !q.to_date) {
        this.clearSavedFilters();
      } else {
        this.saveFiltersToLocalStorage(q);
      }
      await this.$router.push({
        path: this.$route.path,
        query: q,
      });
      await this.loadProjects();
    },
    async loadProjects() {
      this.isLoading = true;
      const params = {
        from_date:
          this.$route.query.from_date ||
          getLocalStorageKey('project_payment_from_date'),
        to_date:
          this.$route.query.to_date ||
          getLocalStorageKey('project_payment_to_date'),
        project_ids:
          this.$route.query.project_ids ||
          getLocalStorageKey('project_payment_project_ids'),
      };
      Object.keys(params).forEach((key) => {
        if (
          params[key] === null ||
          params[key] === undefined ||
          params[key] === ''
        ) {
          delete params[key];
        }
      });
      this.projects = await getProjectPayments(params);
      this.saveFiltersToLocalStorage(params);

      this.isLoading = false;
    },
    restoreFiltersFromLocalStorage() {
      const savedFilters = this.getCompleteFiltersFromLocalStorage();
      if (Object.keys(savedFilters).length > 0) {
        this.$router.push({
          path: this.$route.path,
          query: savedFilters,
        });
      }
    },
    getCompleteFiltersFromLocalStorage() {
      const savedFilters = getLocalStorageKey('project_payment_filters');
      return savedFilters ? JSON.parse(savedFilters) : {};
    },
    processProjectData(project) {
      return project.financial_source;
    },
    getMonthlyValueByDate(monthlyData, year, month, type) {
      const entry = monthlyData.find((d) => {
        const [y, m] = d.date.split('-').map(Number);
        return y === year && m === month;
      });
      if (entry) {
        switch (type) {
          case 'plan':
            return this.formatNumber(entry.plan, 1);
          case 'invoice':
            return this.formatNumber(entry.invoice_amount, 1);
          case 'real':
            return this.formatNumber(entry.real, 1);
          default:
            return this.formatNumber(entry.plan, 1);
        }
      }
      return '';
    },
    getTableDetailsByDate(monthlyData, year, month, type) {
      const entry = monthlyData.find((d) => {
        const [y, m] = d.date.split('-').map(Number);
        return y === year && m === month;
      });
      if (!entry) return type === 'plan' ? {} : [];
      switch (type) {
        case 'plan':
          return entry.plan_details || {};
        case 'invoice':
          return entry.invoice_amount_details || {};
        case 'real':
          return entry.real_details || {};
        default:
          return type === 'plan' ? {} : [];
      }
    },
    getMonthlyValue(monthlyData, idx, type) {
      const month = idx + 1;
      const currentYear = moment().year();
      return this.getMonthlyValueByDate(monthlyData, currentYear, month, type);
    },
    getTableDetails(monthlyData, idx, type) {
      const month = idx + 1;
      const currentYear = moment().year();
      return this.getTableDetailsByDate(monthlyData, currentYear, month, type);
    },
    formatNumber,
    formatSingleDate,
    projectLink,
    companyLink,
    stageLink,
  },
};
</script>

<style scoped>
.payments-table {
  font-family: Arial;
  color: #333;
  height: 200px;
}
.table-container {
  max-height: 1200px;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.payments-table__table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
}
.payments-table__table th,
.payments-table__table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  white-space: nowrap;
}
.sticky-header {
  position: sticky;
  top: 0;
  background: #f8f8f8;
  z-index: 5;
  font-weight: 600;
  text-align: left;
}
.sticky-col {
  position: sticky;
  background: #fff;
  z-index: 4;
}

.sticky-col-1 {
  left: var(--sticky-col-1-left, 0px);
  min-width: 200px;
}
.sticky-col-2 {
  left: var(--sticky-col-2-left, 225px);
  min-width: 180px;
}
.sticky-col-3 {
  left: var(--sticky-col-3-left, 440px);
  min-width: 150px;
}
.sticky-col-4 {
  left: var(--sticky-col-4-left, 656px);
  min-width: 80px;
}
.sticky-col-5 {
  left: var(--sticky-col-5-left, 761px);
  min-width: 100px;
}

.sticky-header.sticky-col {
  z-index: 6;
  background: #f8f8f8;
}

.numeric {
  text-align: right;
}
.no-data {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}
.year-cell {
  border-bottom: none;
  text-align: center;
}
.month-cell {
  border-top: none;
}
.month-cell.sticky-header {
  top: 34px;
}
.project-cell {
  font-weight: bold;
  background-color: #f9f9f9;
}

.truncate {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
