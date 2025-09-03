<template>
  <n-button
    vlass="save-button-container"
    type="success"
    @click="submitEmployeeForm"
    >{{ $t('save') }}</n-button
  >
</template>

<script>
import { mapStores } from 'pinia';
import { useStaticChoicesStore } from '@/store/staticChoices';
import { useEmployeesStore } from '@/store/employee';

export default {
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
  computed: {
    ...mapStores(useStaticChoicesStore, useEmployeesStore),
  },
  watch: {
    formData: {
      handler(newValue) {
        this.localFormData = { ...newValue };
      },
      deep: true,
    },
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },

    submitEmployeeForm() {
      const employeeId = this.$route.params.employeeId;

      const formattedData = {
        ...this.localFormData,
        entrance_date: this.formatDate(this.localFormData.entrance_date),
        date_of_dismissal: this.formatDate(
          this.localFormData.date_of_dismissal,
        ),
      };

      this.employeesStore.update(employeeId, formattedData).then(() => {
        this.$router.push('/employees');
      });
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

.save-button-container {
  position: fixed;
  bottom: 16px;
  right: 300px;
  width: 80px;
  z-index: 20;
}

.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
