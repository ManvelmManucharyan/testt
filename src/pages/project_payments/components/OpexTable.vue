<template>
  <table class="popover-table">
    <thead>
      <tr>
        <th>{{ $t('opex') }}</th>
        <th>{{ $t('amount') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="detail in data" :key="detail.id">
        <td>
          <router-link
            :to="opexLink(offerId, formatDate(date), formatDate(date))"
            replace
            target="_blank"
          >
            {{ detail.name }}
          </router-link>
        </td>
        <td>{{ formatNumber(detail.amount, 10) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import moment from 'moment';
import { formatNumber } from '@/utils/numeric';
import { opexLink } from '@/utils/links';

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
    opexLink,
  },
};
</script>

<style scoped src="@/assets/planDetailedTable.css"></style>
