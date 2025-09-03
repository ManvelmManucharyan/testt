<template>
  <div v-if="isLoading">{{ $t('loading') }}</div>
  <div v-else class="table-container">
    <div class="card">
      <table class="table roles-table table-sm">
        <thead>
          <tr>
            <th style="z-index: 10"></th>
            <th class="totals-col">{{ $t('totals') }}</th>
            <th
              v-for="stage in offerStagesStore.data"
              :key="stage.id"
              :title="stage.name"
            >
              <router-link
                :to="stageLink(stage)"
                replace
                class="truncate"
                style="--char-limit: 30ch"
              >
                {{ stage.name }}
              </router-link>
            </th>
          </tr>
          <tr>
            <td>{{ $t('period') }}</td>
            <td></td>
            <td v-for="stage in offerStagesStore.data" :key="stage.id">
              {{ formatSingleDate(stage.from_date) }} -
              {{ formatSingleDate(stage.to_date) }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('workingDays') }}</td>
            <td></td>
            <td v-for="stage in offerStagesStore.data" :key="stage.id">
              <a :href="linkToHolidays(stage)" target="_blank">
                {{ stage.working_days_count }}
              </a>
            </td>
          </tr>
          <tr>
            <td>{{ $t('tariffRateDate') }}</td>
            <td></td>
            <td v-for="stage in offerStagesStore.data" :key="stage.id">
              {{
                moment(stage.tariff_rate_date)
                  .locale($i18n.locale)
                  .format('DD MMM YYYY')
              }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('tariff') }}</td>
            <td></td>
            <td v-for="stage in offerStagesStore.data" :key="stage.id">
              {{ stage.tariff ? tariffName(stage.tariff) : '-' }}
            </td>
          </tr>
          <tr>
            <td>{{ $t('kpi') }}</td>
            <td></td>
            <td
              v-for="stage in offerStagesStore.data"
              :key="stage.id"
              :title="stage.kpi"
              class="kpi-cell"
            >
              <p class="truncate" style="--char-limit: 30ch">{{ stage.kpi }}</p>
            </td>
          </tr>
          <tr>
            <td>{{ $t('bonus') }}</td>
            <td></td>
            <td v-for="stage in offerStagesStore.data" :key="stage.id">
              {{ stage.bonus }} {{ stage.currency }}
            </td>
          </tr>
        </thead>
        <tbody>
          <template v-for="department in offerDepartments" :key="department.id">
            <add-department-role-button
              :department="department"
              :offer-id="offerId"
            />

            <add-department-task-link
              :department="department"
              :stages="offerStagesStore.data"
            />

            <tr
              v-for="departmentrole in department.roles"
              :key="departmentrole.id"
            >
              <td>
                <span class="role-short-id-wrapper">{{
                  departmentrole.rank
                }}</span>
                {{ departmentrole.name }}
                <delete-item
                  @positive-click="deleteDepartmentRole(departmentrole)"
                />
              </td>
              <td>
                <span>
                  {{ departmentrole.total_role_hours }} {{ $t('hours') }} /
                  {{ departmentrole.total_role_working_days }}
                  {{ $t('workingDays') }}
                </span>
              </td>
              <td v-for="stage in offerStagesStore.data" :key="stage.id">
                <stage-role-cell
                  :stage="stage"
                  :departmentrole="departmentrole"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapStores } from 'pinia';
import { useStaticChoicesStore } from '@/store/staticChoices';
import { useOfferStore } from '@/store/offer';
import { useOfferStagesStore } from '@/store/offerStages';
import { useOfferDepartmentsStore } from '@/store/offerDepartments';
import { useOfferStageDepartmentsStore } from '@/store/offerStageDepartments';
import { useOfferStageDepartmentRolesStore } from '@/store/offerStageDepartmentRoles';
import { useOfferDepartmentRolesStore } from '@/store/offerDepartmentRoles';
import { formatSingleDate } from '@/utils/time';
import AddDepartmentRoleButton from '@/pages/offers/components/offer_detail/components/buttons/AddDepartmentRoleButton.vue';
import AddDepartmentTaskLink from '@/pages/offers/components/offer_detail/components/buttons/stage_department_task/AddDepartmentTaskLink.vue';
import StageRoleCell from '@/pages/offers/components/offer_detail/components/buttons/stage_department_role/StageRoleCell.vue';
import DeleteItem from '@/components/DeleteItem.vue';

export default {
  components: {
    AddDepartmentRoleButton,
    AddDepartmentTaskLink,
    DeleteItem,
    StageRoleCell,
  },
  props: {
    offerId: String,
  },
  data() {
    return {
      data: [],
      loading: false,
    };
  },

  computed: {
    ...mapStores(
      useOfferStore,
      useOfferDepartmentsStore,
      useOfferStagesStore,
      useOfferStageDepartmentsStore,
      useOfferStageDepartmentRolesStore,
      useOfferDepartmentRolesStore,
      useStaticChoicesStore,
    ),
    isLoading() {
      return (
        this.offerDepartmentsStore.isLoading ||
        this.offerStagesStore.isLoading ||
        this.offerStageDepartmentsStore.isLoading
      );
    },

    offerDepartments() {
      let departments = [];
      for (let department of this.offerDepartmentsStore.data) {
        if (department.roles.length > 0) {
          departments.push(department);
        }
      }
      return departments;
    },
  },
  created() {
    this.offerDepartmentsStore.fetch(this.offerId);
    this.offerStagesStore.fetch(this.offerId);
    this.offerStageDepartmentsStore.fetch(this.offerId);
    this.offerStageDepartmentRolesStore.fetch(this.offerId);
  },
  methods: {
    linkToHolidays(stage) {
      const url = new URL(
        `/settings/holiday/?` +
          `from_date=${moment(stage.from_date).format('YYYY-MM-DD')}` +
          `&to_date=${moment(stage.to_date).format('YYYY-MM-DD')}` +
          `&is_holiday__exact=0`,
        import.meta.env.VITE_HR_BACKEND_URL,
      ).toString();

      return url;
    },
    tariffName(tariff) {
      return this.staticChoicesStore.data.tariff_choices.find(
        (item) => item.id === tariff,
      ).name;
    },
    async deleteDepartmentRole(departmentrole) {
      await this.offerDepartmentRolesStore.remove(
        departmentrole.id,
        this.offerId,
      );
    },
    stageLink(stage) {
      return {
        path: this.$route.path,
        query: {
          ...this.$route.query,
          edit_stage: stage.id,
        },
      };
    },
    formatSingleDate,
    moment,
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.table-container {
  overflow-x: auto;
  max-height: 60vh;
}

th,
td {
  padding: 10px;
  border: 1px solid #e0e0e0;
}

thead th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(even) {
  background-color: #ffffff;
}

.table-container {
  overflow: auto;
  max-height: 60vh;
}

.kpi-cell {
  text-align: left;
}
.roles-table {
  border-collapse: collapse;
}

.roles-table thead th {
  position: sticky;
  top: 0;
  background: white;
  border: 1px;
  z-index: 2;
}
.role-short-id-wrapper {
  margin: 1px 7px 1px 1px;
  background: #e1e1e1;
  padding: 2px 7px 2px 7px;
  border-radius: 10px;
}

.totals-col {
  width: 8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.roles-table td,
.roles-table th {
  padding: 8px;
  border: 1px solid #ccc;
  min-width: 200px;
  width: auto;
  white-space: nowrap;
}

.roles-table tbody tr:nth-child(odd) td {
  background-color: #f9f9f9;
}
.roles-table tbody tr:nth-child(even) td {
  background-color: #ffffff;
}

.roles-table td:first-child {
  background-color: white;
}

::v-deep(.sub-header-line-height) {
  padding-top: 30px;
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white;
}
::v-deep(.task-description) {
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white;
}

.roles-table th:first-child,
.roles-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 3;
}

.roles-table thead tr:nth-child(2) td,
.roles-table thead tr:nth-child(2) th {
  position: sticky;
  top: 39px;
  background-color: white;
  z-index: 10;
}
</style>
