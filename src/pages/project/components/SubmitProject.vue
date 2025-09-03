<template>
  <n-button
    vlass="save-button-container"
    type="success"
    @click="submitEmployeeForm"
    >{{ $t('save') }}</n-button
  >
</template>

<script>
import { updateProject } from '@/api/project';

export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async submitEmployeeForm() {
      const formDataCopy = { ...this.formData };
      formDataCopy.client = formDataCopy.client_id;
      await updateProject(this.$route.params.projectId, formDataCopy);
      this.$router.push('/projects');
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
