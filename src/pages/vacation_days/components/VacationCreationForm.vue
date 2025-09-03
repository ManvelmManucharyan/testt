<template>
  <n-form v-model="formData" label-placement="left" class="vacation-form">
    <n-form-item :label="$t('employee')" class="form-group" :required="true">
      <employee-select v-model="formData.employee" />
    </n-form-item>

    <n-form-item :label="$t('status')" class="form-group">
      <vacation-status-select
        v-model="formData.status"
        :allow-empty="false"
        :required="true"
      />
    </n-form-item>

    <n-form-item
      v-if="
        $route.query.vacation != 'half-day-off' &&
        $route.query.vacation != 'sick-leave'
      "
      :label="$t('from')"
      class="form-group"
    >
      <date-select
        v-model="formData.from_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'sick-leave'"
      :label="$t('fromSickLeave')"
      class="form-group"
    >
      <date-select
        v-model="formData.from_date"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'sick-leave'"
      :label="$t('to')"
      class="form-group"
    >
      <date-select
        v-model="formData.to_date"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="
        $route.query.vacation != 'half-day-off' &&
        $route.query.vacation != 'sick-leave'
      "
      :label="$t('to')"
      class="form-group"
    >
      <date-select
        v-model="formData.to_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'day-off'"
      :label="$t('workOffForm')"
      class="form-group"
    >
      <date-select
        v-model="formData.work_off_from_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'day-off'"
      :label="$t('workOffTo')"
      class="form-group"
    >
      <date-select
        v-model="formData.work_off_to_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="
        $route.query.vacation == 'day-off' ||
        $route.query.vacation == 'half-day-off'
      "
      :label="$t('workedOut')"
      class="form-group"
    >
      <worked-out-select
        v-model="formData.is_worked_out"
        :allow-empty="false"
      />
    </n-form-item>

    <n-form-item
      v-if="
        $route.query.vacation == 'day-off' ||
        $route.query.vacation == 'half-day-off'
      "
      :label="$t('reason')"
      class="form-group"
    >
      <input-form v-model="formData.reason" type="textarea" />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'half-day-off'"
      :label="$t('dateOffDate')"
      class="form-group"
    >
      <date-select
        v-model="formData.from_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'half-day-off'"
      :label="$t('dayOffType')"
      class="form-group"
    >
      <day-off-type-select
        v-model="formData.day_off_type"
        :date="formData.from_timestamp"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'half-day-off'"
      :label="$t('workOffDate')"
      class="form-group"
    >
      <date-select
        v-model="formData.work_off_from_timestamp"
        :format="'dd/MM/YYYY'"
        :placeholder="'dd/mm/yyyy'"
      />
    </n-form-item>

    <n-form-item
      v-if="$route.query.vacation == 'half-day-off'"
      :label="$t('workOffType')"
      class="form-group"
    >
      <day-off-type-select
        v-model="formData.work_off_type"
        :date="formData.work_off_from_timestamp"
      />
    </n-form-item>

    <n-form-item :label="$t('created')" class="form-group">
      <span v-if="formData.created_at">{{
        formatSingleDate(formData.created_at)
      }}</span>
      <span v-else>-</span>
    </n-form-item>

    <n-form-item :label="$t('updated')" class="form-group">
      <span v-if="formData.updated_at">{{
        formatSingleDate(formData.updated_at)
      }}</span>
      <span v-else>-</span>
    </n-form-item>

    <n-form-item :label="$t('deleted')" class="form-group">
      <span v-if="formData.deleted_at">{{
        formatSingleDate(formData.deleted_at)
      }}</span>
      <span v-else>-</span>
    </n-form-item>
  </n-form>
</template>

<script>
import EmployeeSelect from '@/components/EmployeeSelect.vue';
import VacationStatusSelect from '@/components/VacationStatusSelect.vue';
import DateSelect from '@/components/DateSelect.vue';
import InputForm from '@/components/InputForm.vue';
import WorkedOutSelect from '@/components/WorkedOutSelect.vue';
import DayOffTypeSelect from '@/components/DayOffTypeSelect.vue';
import { formatSingleDate } from '@/utils/time';

export default {
  components: {
    EmployeeSelect,
    VacationStatusSelect,
    DateSelect,
    InputForm,
    WorkedOutSelect,
    DayOffTypeSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
  watch: {
    'formData.day_off_type'(newValue) {
      this.updateDayOffTimestamps(newValue);
    },
    'formData.work_off_type'(newValue) {
      this.updateWorkOffTimestamps(newValue);
    },
  },
  methods: {
    formatSingleDate,
    updateDayOffTimestamps(dayOffType) {
      if (!dayOffType) return;

      const selectedDate = this.formData.from_timestamp
        ? new Date(this.formData.from_timestamp)
        : new Date();
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();

      if (dayOffType === 'first_half') {
        this.formData.from_timestamp = new Date(
          Date.UTC(year, month, day, 9, 0, 0, 0),
        );
        this.formData.to_timestamp = new Date(
          Date.UTC(year, month, day, 13, 30, 0, 0),
        );
      } else if (dayOffType === 'second_half') {
        this.formData.from_timestamp = new Date(
          Date.UTC(year, month, day, 13, 30, 0, 0),
        );
        this.formData.to_timestamp = new Date(
          Date.UTC(year, month, day, 18, 0, 0, 0),
        );
      }
    },

    updateWorkOffTimestamps(workOffType) {
      if (!workOffType) return;

      const selectedDate = this.formData.work_off_from_timestamp
        ? new Date(this.formData.work_off_from_timestamp)
        : new Date();
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      if (workOffType === 'first_half') {
        this.formData.work_off_from_timestamp = new Date(
          Date.UTC(year, month, day, 9, 0, 0, 0),
        );
        this.formData.work_off_to_timestamp = new Date(
          Date.UTC(year, month, day, 13, 30, 0, 0),
        );
      } else if (workOffType === 'second_half') {
        this.formData.work_off_from_timestamp = new Date(
          Date.UTC(year, month, day, 13, 30, 0, 0),
        );
        this.formData.work_off_to_timestamp = new Date(
          Date.UTC(year, month, day, 18, 0, 0, 0),
        );
      }
    },
  },
};
</script>

<style scoped>
.vacation-form {
  padding: 16px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 12px;
  justify-content: space-between;
}
</style>
