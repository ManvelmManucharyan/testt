<template>
  <n-form label-placement="left" :label-width="100" class="form-group">
    <n-form-item :label="$t('employee')">
      <employee-select
        v-model="localFormData.employee"
        :placeholder="$t('selectEmployee')"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('role')">
      <role-select
        v-model="localFormData.role"
        :placeholder="$t('selectRole')"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('employmentType')">
      <employment-type-select
        v-model="localFormData.payment_type"
        :placeholder="$t('selectEmploymentType')"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('activationDate')">
      <date-select
        v-model="localFormData.activation_date"
        :placeholder="$t('selectActivationDate')"
        style="width: 100%"
        :format="'dd MMMM YYYY'"
        size="medium"
      />
    </n-form-item>

    <n-form-item :label="$t('deactivationDate')">
      <date-select
        v-model="localFormData.deactivation_date"
        :placeholder="$t('selectDeactivationDate')"
        style="width: 100%"
        :format="'dd MMMM YYYY'"
        size="medium"
      />
    </n-form-item>
  </n-form>
</template>

<script>
import EmployeeSelect from '@/components/EmployeeSelect.vue';
import DateSelect from '@/components/DateSelect.vue';
import RoleSelect from '@/components/RoleSelect.vue';
import EmploymentTypeSelect from '@/components/EmploymentTypeSelect.vue';

export default {
  components: {
    RoleSelect,
    EmployeeSelect,
    DateSelect,
    EmploymentTypeSelect,
  },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:formData'],
  data() {
    return {
      localFormData: {
        ...this.formData,
      },
    };
  },

  watch: {
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.form-group {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
}
</style>
