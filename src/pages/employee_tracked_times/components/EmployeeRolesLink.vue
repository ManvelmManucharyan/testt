<template>
  <template v-if="hours !== null">
    <router-link :to="navigateToEmployeeRoles" target="_blank">
      {{ formatHours(hours) }}
    </router-link>
  </template>
  <template v-else> - </template>
</template>

<script>
import { formatHours } from '@/utils/dateUtils';

export default {
  props: {
    employeeId: {
      type: [String, Number],
      required: true,
    },
    hours: {
      type: [String, Number],
      default: null,
    },
    dateRange: {
      type: Array,
      required: true,
    },
    projectId: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    navigateToEmployeeRoles() {
      const fromDate = this.dateRange[0].format('YYYY-MM-DD');
      const toDate =
        this.dateRange[this.dateRange.length - 1].format('YYYY-MM-DD');
      return `/employees/${this.employeeId}?tab=roles&project=${this.projectId}&from_date=${fromDate}&to_date=${toDate}`;
    },
  },
  methods: {
    formatHours,
  },
};
</script>
