<template>
  <table class="popover-table">
    <thead>
      <tr>
        <th>{{ $t('employee') }}</th>
        <th>{{ $t('roles') }}</th>
        <th>{{ $t('scheduledLoad') }}</th>
        <th>{{ $t('hourlyRate') }}</th>
        <th>{{ $t('workingHours') }}</th>
        <th>{{ $t('total') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="detail in data" :key="detail.id">
        <td>
          <router-link
            :to="
              employeeRolesLink(
                detail.employee.id,
                moment(date).startOf('month').format('YYYY-MM-DD'),
                moment(date).endOf('month').format('YYYY-MM-DD'),
                projectId,
              )
            "
            replace
            target="_blank"
          >
            {{ detail.employee.name }}
          </router-link>
        </td>
        <td>
          <router-link
            :to="roleLink(offerId, detail.role.id)"
            replace
            target="_blank"
          >
            {{ detail.role.name }}
          </router-link>
        </td>
        <td>{{ detail.scheduled_load }}</td>
        <td>{{ formatNumber(detail.hourly_rate, 1) }}</td>
        <td>{{ formatNumber(detail.working_hours, 1) }}</td>
        <td>
          {{ formatNumber(detail.total, 1) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';
import { formatNumber } from '@/utils/numeric';
import { roleLink, employeeRolesLink } from '@/utils/links';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    offerId: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  methods: {
    formatNumber,
    roleLink,
    employeeRolesLink,
    moment,
  },
};
</script>

<style scoped src="@/assets/planDetailedTable.css"></style>
