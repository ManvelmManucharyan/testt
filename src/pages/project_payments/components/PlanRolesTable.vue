<template>
  <table class="popover-table">
    <thead>
      <tr>
        <th>{{ $t('roles') }}</th>
        <th>{{ $t('tariff') }}</th>
        <th>{{ $t('totalHours') }}</th>
        <th>{{ $t('total') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="detail in data" :key="detail.id">
        <td>
          <router-link
            :to="roleLink(offerId, detail.role.id)"
            replace
            target="_blank"
          >
            {{ detail.role.name }}
          </router-link>
        </td>
        <td>{{ formatNumber(detail.rate, 10) }}</td>
        <td>{{ formatNumber(detail.total_hours) }}</td>
        <td>{{ formatNumber(detail.rate * detail.total_hours, 1) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';
import { formatNumber } from '@/utils/numeric';
import { roleLink } from '@/utils/links';

export default {
  name: 'PaymentDetailedTable',
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
  },
  methods: {
    formatDate(date) {
      return moment(date, 'DD/MM/YYYY').format('YYYY-MM');
    },
    formatNumber,
    roleLink,
  },
};
</script>

<style scoped src="@/assets/planDetailedTable.css"></style>
