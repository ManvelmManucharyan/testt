<template>
  <div class="modal-content">
    <n-form>
      <n-form-item v-if="!isEditMode" :label="$t('employee')">
        <employee-select
          v-model="localFormData.employee"
          :placeholder="$t('selectEmployee')"
          size="medium"
        />
      </n-form-item>

      <n-form-item :label="$t('period')">
        <date-select
          v-model:value="localPeriodRange"
          type="daterange"
          format="dd MMM y"
          clearable
          :start-placeholder="$t('startDate')"
          :end-placeholder="$t('endDate')"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { NForm, NFormItem } from 'naive-ui';
import EmployeeSelect from '@/components/EmployeeSelect.vue';
import DateSelect from '@/components/DateSelect.vue';

export default {
  name: 'AddEmployeeToStageForm',
  components: {
    EmployeeSelect,
    NForm,
    NFormItem,
    DateSelect,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
    stage: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    periodRange: {
      type: Array,
      default: null,
    },
  },
  emits: ['update:formData', 'update:period-range'],
  data() {
    return {
      localFormData: { ...this.formData },
      localPeriodRange: this.periodRange,
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.query.employee_project;
    },
  },
  watch: {
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
    localPeriodRange(newValue) {
      this.$emit('update:period-range', newValue);
    },
    periodRange(newValue) {
      this.localPeriodRange = newValue;
    },
    stage: {
      handler() {
        if (!this.isEditMode && !this.periodRange) {
          this.localPeriodRange = this.getPeriodRange();
        }
      },
      deep: true,
    },
  },
  methods: {
    getPeriodRange() {
      return [
        new Date(this.stage.from_date).getTime(),
        new Date(this.stage.to_date).getTime(),
      ];
    },
  },
};
</script>

<style scoped>
.modal-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
