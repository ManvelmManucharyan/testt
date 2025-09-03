<template>
  <div class="controls">
    <div class="date-range">
      <div class="date-inputs">
        <div class="date-field">
          <label class="date-label">
            {{ $t('controls.ariaLabels.fromDate') }}:
          </label>
          <date-select
            v-model="localFromDate"
            format="dd MMM y"
            class="dates"
            :is-date-disabled="fromDateDisabled"
          />
        </div>
        <div class="date-field">
          <label class="date-label">
            {{ $t('controls.ariaLabels.toDate') }}:
          </label>
          <date-select
            v-model="localToDate"
            format="dd MMM y"
            class="dates"
            :is-date-disabled="toDateDisabled"
          />
        </div>
        <n-button @click="applyDateRange">
          {{ $t('controls.buttons.apply') }}
        </n-button>
      </div>
      <project-select
        :model-value="selectedProjects"
        multiple
        :max="3"
        @update:model-value="handleProjectSelect"
      />
      <employee-select
        :model-value="selectedEmployees"
        multiple
        :max="3"
        @update:model-value="handleEmployeeSelect"
      />
    </div>
    <div></div>
    <div class="filters">
      <export-button
        :from-date="fromDate"
        :to-date="toDate"
        :group-by="groupBy"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import ExportButton from './Export.vue';
import ProjectSelect from '@/components/ProjectSelect.vue';
import { getLocalStorageKey, setLocalStorageKey } from '@/utils/localStorage';
import DateSelect from '@/components/DateSelect.vue';
import EmployeeSelect from '@/components/EmployeeSelect.vue';

export default {
  name: 'Controls',
  components: {
    ExportButton,
    ProjectSelect,
    DateSelect,
    EmployeeSelect,
  },
  props: {
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    groupBy: {
      type: String,
      required: true,
      validator: (value) => ['project', 'user', 'department'].includes(value),
    },
    selectedProjectIds: {
      type: Array,
      default: () => [],
    },
    selectedEmployeeIds: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    'updateGroupBy',
    'updateProjectIds',
    'updateDateRange',
    'updateEmployeeIds',
  ],
  data() {
    return {
      previousFromDate: this.fromDate,
      localFromDate: this.fromDate,
      localToDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      localGroupBy: this.groupBy,
      maxDate: moment().subtract(1, 'day').format('YYYY-MM-DD'),
      selectedProjects:
        this.selectedProjectIds?.length > 0
          ? [...this.selectedProjectIds]
          : getLocalStorageKey('tracked_time_project_ids', []),
      selectedEmployees:
        this.selectedEmployeeIds?.length > 0
          ? [...this.selectedEmployeeIds]
          : getLocalStorageKey('tracked_time_employee_ids', []),
    };
  },
  watch: {
    fromDate: {
      handler(newValue) {
        this.localFromDate = newValue;
      },
      immediate: true,
    },
    toDate: {
      handler(newValue) {
        if (!moment(newValue).isAfter(moment().subtract(1, 'day'), 'day')) {
          this.localToDate = newValue;
        } else {
          this.localToDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
        }
      },
      immediate: true,
    },
    selectedProjectIds: {
      handler(newValue) {
        if (newValue && Array.isArray(newValue)) {
          this.selectedProjects = [...newValue];
        }
      },
      immediate: true,
      deep: true,
    },
    selectedEmployeeIds: {
      handler(newValue) {
        if (newValue && Array.isArray(newValue)) {
          this.selectedEmployees = [...newValue];
        }
      },
      immediate: true,
      deep: true,
    },
    localGroupBy(newValue) {
      this.$emit('updateGroupBy', newValue);
    },
    localToDate: {
      handler(newValue) {
        if (moment(newValue).isBefore(this.localFromDate)) {
          const firstDayPrevMonth = moment(newValue)
            .startOf('month')
            .format('YYYY-MM-DD');
          this.localFromDate = firstDayPrevMonth;
        }
      },
    },
  },
  methods: {
    fromDateDisabled(ts) {
      const date = new Date(ts);
      return (
        date > moment(this.localToDate).toDate() ||
        date < moment('2024-12-01').toDate() ||
        moment(date).isSame(moment(), 'day')
      );
    },
    toDateDisabled(ts) {
      const date = new Date(ts);
      return (
        date >= moment(this.maxDate).add(1, 'day').toDate() ||
        date < moment('2024-12-01').toDate() ||
        moment(date).isSame(moment(), 'day')
      );
    },
    handleEmployeeSelect(newEmployees) {
      const arr = Array.isArray(newEmployees) ? newEmployees : [];
      if (
        JSON.stringify(arr) === JSON.stringify(this.selectedEmployees || [])
      ) {
        return;
      }
      this.selectedEmployees = [...arr];
      setLocalStorageKey('tracked_time_employee_ids', this.selectedEmployees);
      this.$emit('updateEmployeeIds', this.selectedEmployees);
    },

    handleProjectSelect(newProjects) {
      const arr = Array.isArray(newProjects) ? newProjects : [];
      if (JSON.stringify(arr) === JSON.stringify(this.selectedProjects || [])) {
        return;
      }
      this.selectedProjects = [...arr];
      setLocalStorageKey('tracked_time_project_ids', this.selectedProjects);
      this.$emit('updateProjectIds', this.selectedProjects);
    },
    applyDateRange() {
      if (
        moment(this.localFromDate).isValid() &&
        moment(this.localToDate).isValid()
      ) {
        this.$emit('updateDateRange', {
          fromDate: moment(this.localFromDate).format('DD/MM/YYYY'),
          toDate: moment(this.localToDate).format('DD/MM/YYYY'),
        });
      }
    },
  },
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}
.controls:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
.date-range {
  display: flex;
  align-items: center;
  gap: 20px;
}
.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-field {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 180px;
}
.date-label {
  font-weight: bold;
  font-size: 14px;
  color: #333;
}
.group-by-select,
.efficiency-select {
  padding: 8px 12px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.group-by-select:focus,
.efficiency-select:focus {
  border-color: #295c7e;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}
.date-input {
  width: 150px !important;
}
.date-input :deep(input) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}
</style>
