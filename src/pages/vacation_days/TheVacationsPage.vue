<template>
  <div>
    <div class="header">
      <filter-header @search="fetchData" />
      <calendar-legend />
    </div>
    <div v-if="allDataReady" class="calendar">
      <div v-for="(month, index) in months" :key="month.name" class="month">
        <h6>{{ month.name }}</h6>
        <div class="weekdays">
          <div v-for="weekday in weekdays" :key="weekday" class="weekday">
            {{ $t(`weekdays.${weekday}`) }}
          </div>
        </div>
        <div class="days">
          <div
            v-for="placeholder in getStartingPlaceholderDays(month, index)"
            :key="`placeholder-${placeholder}`"
          ></div>
          <div
            v-for="day in month.days"
            :key="day.date"
            class="day"
            :class="getBusinessDayClass(day, index)"
          >
            <vacation-day-employees-detailed-view
              :vacation-items="getVacationItems(day, index)"
              :day="day"
              :month="index + 1"
              :current-selected-date="currentSelectedDate"
              style="height: 20px"
              @update:selection="onUpdateChangeSelection"
              @open-vacation-modal="openVacationModal"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>{{ $t('loading') }}</div>

    <n-modal
      v-model:show="showVacationModal"
      preset="dialog"
      :show-icon="false"
      :title="headerName"
      style="width: 35%"
      transform-origin="center"
      @close="onClickCloseModal"
    >
      <n-card :bordered="false" role="dialog" aria-modal="true">
        <vacation-creation-form v-model="form" />
      </n-card>
      <template #action>
        <n-space justify="end">
          <n-button @click="onClickCloseModal">{{ $t('cancel') }}</n-button>
          <n-popconfirm
            v-if="$route.query.vacation_id"
            @click="onClickDeleteModal"
          >
            <template #trigger>
              <n-button type="error">{{ $t('delete') }}</n-button>
            </template>
            {{ $t('deleteItem') }}
          </n-popconfirm>
          <n-button type="primary" @click="onPositiveClickSubmitForm">
            {{ $t('confirm') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useVacationsYearStore } from '@/store/vacationsYear';
import { useEmployeesStore } from '@/store/employee';
import { useHolidaysStore } from '@/store/holidays';
import { useVacationDeprecatedStore } from '@/store/vacationDeprecated';
import { useVacationStore } from '@/store/vacation';
import { generateMonthsArray } from '@/utils/dateUtils';
import VacationDayEmployeesDetailedView from './components/VacationDayEmployeesDetailedView.vue';
import CalendarLegend from './components/CalendarLegend.vue';
import FilterHeader from './components/FilterHeader.vue';
import VacationCreationForm from './components/VacationCreationForm.vue';
import moment from 'moment';

export default {
  name: 'VacationCalendar',
  components: {
    VacationDayEmployeesDetailedView,
    CalendarLegend,
    FilterHeader,
    VacationCreationForm,
  },

  data() {
    return {
      currentSelectedDate: null,
      vacationType: this.$route.query.vacationType,
      project_id: this.$route.query.project_id,
      showVacationModal: false,
      form: {},
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    };
  },

  computed: {
    ...mapStores(
      useVacationsYearStore,
      useHolidaysStore,
      useEmployeesStore,
      useVacationDeprecatedStore,
      useVacationStore,
    ),
    year() {
      const currentYear = new Date().getFullYear().toString();
      return this.$route.query.year || currentYear;
    },
    months() {
      return generateMonthsArray(this.year);
    },
    vacationsInfo() {
      return this.vacationsYearStore.getDailyFlags;
    },
    holidaysInfo() {
      return this.holidaysStore.getHolidaysList;
    },
    allDataReady() {
      return (
        !this.vacationsYearStore.isLoading &&
        !this.holidaysStore.isLoading &&
        this.vacationsYearStore.year !== null
      );
    },
  },

  watch: {
    '$route.query': {
      async handler(newVal, oldVal) {
        if (newVal.year !== oldVal?.year) {
          await this.holidaysStore.fetch(this.year);
        }
        if (this.$route.query.vacation_id) {
          if (this.$route.query.vacation === 'sick-leave') {
            await this.vacationStore.fetch(this.$route.query.vacation_id);
            this.form = this.vacationStore.data;
          } else {
            await this.vacationDeprecatedStore.fetch(
              this.$route.query.vacation_id,
            );
            this.form = this.vacationDeprecatedStore.data;
          }
        }
        this.showVacationModal = !!newVal.vacation;
        await this.fetchData();
      },
      deep: true,
      immediate: true,
    },
    showVacationModal(newVal) {
      if (!newVal) {
        this.closeRouteParams();
      }
    },
  },

  async created() {
    if (!this.$route.query.year) {
      await this.$router.replace({
        query: { ...this.$route.query, year: this.year },
      });
    }
    await this.employeesStore.fetchEmployees();
  },

  methods: {
    async fetchData() {
      await this.vacationsYearStore.fetch(
        this.year,
        this.$route.query.vacation_type,
        this.$route.query.project_id,
        this.$route.query.employee_id,
      );
    },
    headerName() {
      if (this.$route.query.vacation) {
        return this.$t(`${this.$route.query.vacation}`);
      }
    },
    getStartingPlaceholderDays(month, monthIndex) {
      const firstDay = new Date(this.year, monthIndex, 1);

      let dayOfWeek = firstDay.getDay();
      dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

      const placeholderDays = dayOfWeek - 1;

      return Array(placeholderDays).fill(null);
    },
    getBusinessDayClass(day, index) {
      const date = this.getDate(day, index);
      const classes = [];
      const flags = this.vacationsInfo.get(date) || {};

      if (flags.anyone_on_vacations_flag) classes.push('vacation');
      if (flags.anyone_on_workoff_flag) classes.push('work-off');
      if (flags.anyone_on_dayoff_flag) classes.push('day-off');
      if (flags.anyone_on_sick_leave_flag) classes.push('sick-leave');
      if (this.holidaysInfo[date]) classes.push('holiday');

      return classes.join(' ');
    },
    getDate(day, month) {
      return `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${this.year}`;
    },
    getVacationItems(day, index) {
      const date = this.getDate(day, index);
      return this.vacationsInfo.get(date)?.items || [];
    },
    onUpdateChangeSelection(selectedDate) {
      this.currentSelectedDate = selectedDate;
    },
    async openVacationModal(vacationId, type) {
      if (type === 'sickLeave') {
        await this.vacationStore.fetch(vacationId);
        const currentQuery = { ...this.$route.query };
        currentQuery.vacation_id = vacationId;
        currentQuery.vacation = 'sick-leave';
        this.$router.push({ path: this.$route.path, query: currentQuery });
        this.form = this.vacationStore.data;
      } else {
        await this.vacationDeprecatedStore.fetch(vacationId);

        const currentQuery = { ...this.$route.query };
        if (type === 'workOff') {
          if (
            new Date(
              this.vacationDeprecatedStore.data.from_timestamp,
            ).getUTCHours() != 0
          ) {
            type = 'halfDayOff';
          } else {
            type = 'dayOff';
          }
        }
        currentQuery.vacation_id = vacationId;
        currentQuery.vacation = type
          .replace(/([a-z])([A-Z])/g, '$1-$2')
          .toLowerCase();
        this.$router.push({ path: this.$route.path, query: currentQuery });
        this.form = this.vacationDeprecatedStore.data;
      }

      this.showVacationModal = !this.showVacationModal;
    },
    onClickCloseModal() {
      this.closeRouteParams();
    },
    async onClickDeleteModal() {
      if (this.$route.query.vacation === 'sick-leave') {
        await this.vacationStore.remove(this.$route.query.vacation_id);
      } else {
        await this.vacationDeprecatedStore.remove(
          this.$route.query.vacation_id,
        );
      }
      this.closeRouteParams();
    },
    async onPositiveClickSubmitForm() {
      if (this.$route.query.vacation_id) {
        if (this.$route.query.vacation === 'sick-leave') {
          this.form.resourcetype = 'SickLeave';
          this.form.from_date = moment(this.form.from_date).format(
            'MM/DD/YYYY',
          );
          this.form.to_date = moment(this.form.to_date).format('MM/DD/YYYY');
          await this.vacationStore.update(
            this.$route.query.vacation_id,
            this.form,
          );
        } else {
          await this.vacationDeprecatedStore.update(
            this.$route.query.vacation_id,
            this.form,
          );
        }
      } else {
        if (this.$route.query.vacation === 'sick-leave') {
          this.form.resourcetype = 'SickLeave';
          this.form.from_date = moment(this.form.from_date).format(
            'MM/DD/YYYY',
          );
          this.form.to_date = moment(this.form.to_date).format('MM/DD/YYYY');
          await this.vacationStore.create(this.form);
        } else {
          await this.vacationDeprecatedStore.create(this.form);
        }
      }
      this.closeRouteParams();
    },
    closeRouteParams() {
      const currentQuery = { ...this.$route.query };
      delete currentQuery.vacation;
      delete currentQuery.vacation_id;
      this.$router.push({ path: this.$route.path, query: currentQuery });
      this.showVacationModal = false;
      this.form = {};
    },
  },
};
</script>

<style scoped>
.vacation {
  background-color: blue !important;
  color: white;
}

.sick-leave {
  background-color: CadetBlue !important;
  color: white;
}

.holiday {
  background-color: red !important;
  color: white;
}

.work-off {
  background-color: green !important;
  color: white;
}

.day-off {
  background-color: lightblue !important;
  color: white;
}

.day-off.vacation.sick-leave {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    blue 33.33%,
    blue 66.66%,
    CadetBlue 66.66%
  );
}

.day-off.vacation.holiday {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    blue 33.33%,
    blue 66.66%,
    red 66.66%
  );
}

.day-off.vacation.work-off {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    blue 33.33%,
    blue 66.66%,
    green 66.66%
  );
}

.day-off.sick-leave.holiday {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    CadetBlue 33.33%,
    CadetBlue 66.66%,
    red 66.66%
  );
}

.day-off.sick-leave.work-off {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    CadetBlue 33.33%,
    CadetBlue 66.66%,
    green 66.66%
  );
}

.day-off.holiday.work-off {
  background: linear-gradient(
    to right,
    lightblue 33.33%,
    red 33.33%,
    red 66.66%,
    green 66.66%
  );
}

.vacation.sick-leave.holiday {
  background: linear-gradient(
    to right,
    blue 33.33%,
    CadetBlue 33.33%,
    CadetBlue 66.66%,
    red 66.66%
  );
}

.vacation.sick-leave.work-off {
  background: linear-gradient(
    to right,
    blue 33.33%,
    CadetBlue 33.33%,
    CadetBlue 66.66%,
    green 66.66%
  );
}

.vacation.holiday.work-off {
  background: linear-gradient(
    to right,
    blue 33.33%,
    red 33.33%,
    red 66.66%,
    green 66.66%
  );
}

.sick-leave.holiday.work-off {
  background: linear-gradient(
    to right,
    CadetBlue 33.33%,
    red 33.33%,
    red 66.66%,
    green 66.66%
  );
}

.day-off.vacation.sick-leave.holiday {
  background: linear-gradient(
    to right,
    lightblue 25%,
    blue 25%,
    blue 50%,
    CadetBlue 50%,
    CadetBlue 75%,
    red 75%
  );
}

.day-off.vacation.sick-leave.work-off {
  background: linear-gradient(
    to right,
    lightblue 25%,
    blue 25%,
    blue 50%,
    CadetBlue 50%,
    CadetBlue 75%,
    green 75%
  );
}

.day-off.vacation.holiday.work-off {
  background: linear-gradient(
    to right,
    lightblue 25%,
    blue 25%,
    blue 50%,
    red 50%,
    red 75%,
    green 75%
  );
}

.day-off.sick-leave.holiday.work-off {
  background: linear-gradient(
    to right,
    lightblue 25%,
    CadetBlue 25%,
    CadetBlue 50%,
    red 50%,
    red 75%,
    green 75%
  );
}

.vacation.sick-leave.holiday.work-off {
  background: linear-gradient(
    to right,
    blue 25%,
    CadetBlue 25%,
    CadetBlue 50%,
    red 50%,
    red 75%,
    green 75%
  );
}

.day-off.vacation.sick-leave.holiday.work-off {
  background: linear-gradient(
    to right,
    lightblue 20%,
    blue 20%,
    blue 40%,
    CadetBlue 40%,
    CadetBlue 60%,
    red 60%,
    red 80%,
    green 80%
  );
}

.day-off.vacation {
  background: linear-gradient(to right, lightblue 50%, blue 50%);
}

.day-off.sick-leave {
  background: linear-gradient(to right, lightblue 50%, CadetBlue 50%);
}

.day-off.holiday {
  background: linear-gradient(to right, lightblue 50%, red 50%);
}

.day-off.work-off {
  background: linear-gradient(to right, lightblue 50%, green 50%);
}

.vacation.sick-leave {
  background: linear-gradient(to right, blue 50%, CadetBlue 50%);
}

.vacation.holiday {
  background: linear-gradient(to right, blue 50%, red 50%);
}

.vacation.work-off {
  background: linear-gradient(to right, blue 50%, green 50%);
}

.sick-leave.holiday {
  background: linear-gradient(to right, CadetBlue 50%, red 50%);
}

.sick-leave.work-off {
  background: linear-gradient(to right, CadetBlue 50%, green 50%);
}

.work-off.holiday {
  background: linear-gradient(to right, green 50%, red 50%);
}

.theme--light.v-application {
  background: transparent !important;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(4, 320px);
  gap: 20px;
  padding: 10px;
}

.header {
  padding: 10px;
}

.month {
  border-radius: 4px;
  padding: 10px;
  background: #fff;
}

.month h6 {
  text-align: left;
  font-size: 14px;
  margin: 10px;
  color: #333;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 35px);
  gap: 5px;
}

.day {
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  font-size: 14px;
  color: #333;
}

.legend {
  display: flex;
  justify-content: left;
  margin-top: 20px;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.legend-item .circle {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  border-radius: 50%;
}

.legend-item .circle.vacation {
  background-color: blue;
}

.legend-item .circle.holiday {
  background-color: red;
}

.legend-item .circle.sick-leave {
  background-color: CadetBlue;
}

.legend-item .circle.work-off {
  background-color: green;
}

.legend-item .circle.day-off {
  background-color: lightblue;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 35px);
  gap: 5px;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
  text-align: center;
}

.weekday {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
