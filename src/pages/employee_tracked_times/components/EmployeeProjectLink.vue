<template>
  <span class="role-name">{{ roleData.name }}</span>
  <template v-for="item in roleData.entries" :key="item.id">
    <span
      style="display: inline-block; cursor: pointer"
      @click="navigateToEmployeeProject(item.id)"
    >
      <employment-type-icon :employment-type="item.load" />
    </span>
  </template>
</template>

<script>
import EmploymentTypeIcon from '@/components/EmploymentTypeIcon.vue';

export default {
  name: 'EmployeeProjectLink',
  components: {
    EmploymentTypeIcon,
  },
  props: {
    roleData: {
      type: Object,
      required: true,
    },
    offerId: {
      type: [String, Number],
      required: false,
    },
  },
  methods: {
    navigateToEmployeeProject(employeeProjectId) {
      if (!this.offerId) {
        alert(this.$t('roleIsFromProjectMessage'));
      } else {
        const path = this.$router.resolve({
          path: `/offers/${this.offerId}`,
          query: {
            tab: 'rolesAndStages',
            employee_project: employeeProjectId,
          },
        }).href;
        window.open(path, '_blank');
      }
    },
  },
};
</script>

<style scoped>
.role-name {
  margin-left: 5px;
}
</style>
