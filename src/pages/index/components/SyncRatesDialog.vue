<template>
  <n-modal>
    <n-card
      style="width: 600px"
      :title="$t('rates_sync_params')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      {{ $t('from') }}:
      <date-select v-model="syncFromDate" />
      <br />
      {{ $t('to') }}:
      <date-select v-model="syncToDate" />

      <template #footer>
        <n-button @click="close()">Close</n-button>
        <n-button type="primary" @click="sync">Sync</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import DateSelect from '@/components/DateSelect.vue';
import { syncRates } from '@/api/actions';
import { getFormattedDate } from '@/utils/dateUtils';
import { toast } from 'vue3-toastify';

export default {
  name: 'SyncJiraDialog',
  components: {
    DateSelect,
  },
  emits: ['close'],
  data() {
    const today = new Date();
    today.setDate(today.getDate());

    return {
      syncFromDate: today,
      syncToDate: today,
    };
  },
  methods: {
    async sync() {
      toast
        .promise(
          syncRates(
            getFormattedDate(this.syncFromDate),
            getFormattedDate(this.syncToDate),
          ),
          {
            pending: this.$t('syncing'),
            success: this.$t('synced'),
          },
          {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 300,
            closeButton: false,
            hideProgressBar: true,
          },
        )
        .finally(() => {
          this.close();
        });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
