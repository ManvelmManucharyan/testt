<template>
  <div>
    <div v-if="isLoading" class="loading-indicator">{{ $t('loading') }}</div>
    <div v-else class="table-container">
      <div v-if="!$route.query.from_date && !$route.query.to_date">
        {{ $t('opexDateHelpTextForAllTime') }}
      </div>
      <div v-else-if="$route.query.from_date == $route.query.to_date">
        {{
          $t('opexDateHelpTextForMonth', {
            date: moment($route.query.from_date).format('MMMM, y'),
          })
        }}
      </div>
      <div v-else>
        {{
          $t('opexDateHelpTextForPeriod', {
            from: moment($route.query.from_date).format('MMMM, y'),
            to: moment($route.query.to_date).format('MMMM, y'),
          })
        }}
      </div>
      <br />
      <n-table size="small" class="naive-table">
        <n-thead>
          <n-tr>
            <n-th rowspan="2">{{ $t('name') }}</n-th>
            <n-th v-if="activeTab === 'project'" rowspan="2">{{
              $t('projectName')
            }}</n-th>
            <n-th v-else rowspan="2">{{ $t('offerTitleName') }}</n-th>
            <n-th rowspan="2">{{ $t('category') }}</n-th>
            <n-th colspan="3">{{ $t('amount') }}</n-th>
            <n-th rowspan="2">{{ $t('currency') }}</n-th>
            <n-th rowspan="2">{{ $t('period') }}</n-th>
            <n-th rowspan="2">{{ $t('recurrence_period') }}</n-th>
            <n-th rowspan="2">{{ $t('updatedAt') }}</n-th>
          </n-tr>
          <n-tr>
            <n-th>{{ $t('perMonth') }}</n-th>
            <n-th>{{ $t('forSelectedPeriod') }}</n-th>
            <n-th>{{ $t('forAllTime') }}</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr v-for="expense in expenses" :key="expense.id">
            <n-td data-label="Name">
              <router-link :to="`/opex/edit/${expense.id}?tab=${activeTab}`">
                {{ expense.name }}
              </router-link>
            </n-td>
            <n-td
              v-if="activeTab === 'project'"
              data-label="Project Name"
              :title="expense.project_name"
            >
              <router-link
                :to="projectUrl(expense.project)"
                replace
                target="_blank"
              >
                {{ expense.project_key }}
              </router-link>
            </n-td>
            <n-td v-else data-label="Offer Name">
              <router-link
                :to="offerUrl(expense.offer)"
                replace
                target="_blank"
              >
                {{ expense.offer_name }}
              </router-link>
            </n-td>
            <n-td data-label="Category">{{ expense.category }}</n-td>
            <n-td data-label="Per Month">
              {{ formatAmount(expense.amount_per_month) }}
            </n-td>
            <n-td data-label="For Selected Period">
              {{ formatAmount(expense.selected_period_amount) }}
            </n-td>
            <n-td data-label="For All Time">
              {{
                expense.total_amount
                  ? formatAmount(expense.total_amount)
                  : $t('infinite')
              }}
            </n-td>
            <n-td data-label="Currency">{{ expense.currency }}</n-td>
            <n-td data-label="Period">{{ formatPeriod(expense) }}</n-td>
            <n-td data-label="Recurrence Period">
              {{ expense.recurrence_period || $t('oneTime') }}
            </n-td>
            <n-td data-label="Updated At">
              {{ formattedDateWithSeconds(expense.updated_at) }}
            </n-td>
          </n-tr>
        </n-tbody>
      </n-table>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useProjectOperationalExpensesStore } from '@/store/projectOperationalExpenses';
import { useOfferOperationalExpensesStore } from '@/store/offerOperationalExpenses';
import { formattedDateWithSeconds, formatSingleDate } from '@/utils/time';
import moment from 'moment';

export default {
  name: 'ExpensesTable',
  computed: {
    ...mapStores(
      useProjectOperationalExpensesStore,
      useOfferOperationalExpensesStore,
    ),
    activeTab() {
      return this.$route.query.tab;
    },
    isLoading() {
      return this.activeTab === 'offer'
        ? this.offerOperationalExpensesStore.isLoading
        : this.projectOperationalExpensesStore.isLoading;
    },
    expenses() {
      return this.activeTab === 'offer'
        ? this.offerOperationalExpensesStore.data
        : this.projectOperationalExpensesStore.data;
    },
  },
  methods: {
    formattedDateWithSeconds,
    formatAmount(amount) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount)) return this.$t('invalidAmount');
      return parsedAmount.toLocaleString();
    },
    formatPeriod(expense) {
      let lastDate;
      if (expense.date_until) {
        lastDate = formatSingleDate(expense.date_until);
      } else {
        lastDate = this.$t('notSpecified');
      }
      if (expense.recurrence_period) {
        return `${formatSingleDate(expense.date)} - ${lastDate}`;
      } else {
        return `${formatSingleDate(expense.date)}`;
      }
    },
    projectUrl(projectId) {
      return {
        name: 'projects-page-detail',
        params: {
          projectId: projectId,
        },
      };
    },
    offerUrl(offerId) {
      return {
        name: 'offers-page-detail',
        params: {
          offerId: offerId,
        },
      };
    },
    moment,
  },
};
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  font-size: 1.2em;
  color: #7f8c8d;
  padding: 20px 0;
}
</style>
