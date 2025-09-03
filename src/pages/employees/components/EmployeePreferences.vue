<template>
  <n-form label-placement="left" :label-width="200" class="employee-form">
    <n-form-item :label="$t('remindAboutMissingHours')" class="form-group">
      <div style="display: flex; align-items: center">
        <n-switch
          v-model:value="localFormData.remind_about_missing_hours"
          :checked-value="true"
          :unchecked-value="false"
        />
      </div>
    </n-form-item>
  </n-form>

  <submit-employee :form-data="localFormData" />
</template>

<script>
import SubmitEmployee from './SubmitEmployee.vue';

export default {
  components: {
    SubmitEmployee,
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
      localFormData: { ...this.formData },
    };
  },
  watch: {
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
    formData: {
      handler(newValue) {
        this.localFormData = { ...newValue };
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.employee-form {
  padding: 16px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 16px;
}
</style>
