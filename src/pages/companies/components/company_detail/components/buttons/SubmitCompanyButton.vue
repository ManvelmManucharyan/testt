<template>
  <n-button
    vlass="save-button-container"
    type="success"
    @click="submitCompanyForm"
    >{{ $t('save') }}</n-button
  >
</template>

<script>
import { mapStores } from 'pinia';
import { useClientStore } from '@/store/client';

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
    ...mapStores(useClientStore),
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
    async submitCompanyForm() {
      const companyId = this.$route.params.companyId;
      const formattedData = {
        ...this.localFormData,
      };

      if (companyId) {
        await this.clientStore.update(companyId, formattedData);
        this.$router.push('/companies');
      } else {
        await this.clientStore.create(formattedData);
        this.$router.push('/companies');
      }
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
