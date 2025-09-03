<template>
  <table class="popover-table">
    <thead>
      <tr>
        <th>{{ $t('employees') }}</th>
        <th>{{ $t('employmentType') }}</th>
        <th>{{ $t('hourlyRate') }}</th>
        <th>{{ $t('trakcedHours') }}</th>
        <th>{{ $t('total') }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="detail in data" :key="detail.id">
        <td>
          <router-link
            :to="monthlyDataLink(detail.employee_id)"
            replace
            target="_blank"
          >
            {{ detail.employee_name }}
          </router-link>
        </td>
        <td>{{ detail.payment_type }}</td>
        <td>{{ formatNumber(detail.hourly_rate, 1) }}</td>
        <td>
          <router-link
            :to="
              trackedTimeLink(
                detail.employee_id,
                projectId,
                monthStartDate,
                monthEndDate,
              )
            "
            replace
            target="_blank"
          >
            {{ formatNumber(detail.tracked_hours) }}
          </router-link>
        </td>
        <td>
          {{ formatNumber(detail.hourly_rate * detail.tracked_hours, 1) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { formatNumber } from '@/utils/numeric';
import { monthlyDataLink, trackedTimeLink } from '@/utils/links';
import moment from 'moment';

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    date: {
      type: String,
    },
    projectId: {
      type: String,
      required: true,
    },
  },
  computed: {
    monthStartDate() {
      return moment(this.date, 'DD/MM/YYYY')
        .startOf('month')
        .format('YYYY-MM-DD');
    },
    monthEndDate() {
      return moment(this.date, 'DD/MM/YYYY')
        .endOf('month')
        .format('YYYY-MM-DD');
    },
  },
  methods: {
    formatNumber,
    monthlyDataLink,
    trackedTimeLink,
  },
};
</script>

<style scoped src="@/assets/planDetailedTable.css"></style>
