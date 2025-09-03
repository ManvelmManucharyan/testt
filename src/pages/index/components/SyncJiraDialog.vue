<template>
  <n-modal>
    <n-card
      style="width: 600px"
      :title="$t('jira_sync_params')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      {{ $t('sync_worklogs_since') }}:
      <date-select v-model="syncFromDate" />
      <br />
      {{ $t('sync_deleted_worklogs_since') }}:
      <date-select v-model="syncDeletedFromDate" />

      <template #footer>
        <n-button @click="close()">Close</n-button>
        <n-button type="primary" @click="sync">Sync</n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import DateSelect from '@/components/DateSelect.vue';
import { syncJira } from '@/api/actions';
import { toast } from 'vue3-toastify';

export default {
  name: 'SyncJiraDialog',
  components: {
    DateSelect,
  },
  emits: ['close'],
  data() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return {
      syncFromDate: yesterday,
      syncDeletedFromDate: threeMonthsAgo,
    };
  },
  methods: {
    async sync() {
      toast
        .promise(
          syncJira(this.syncFromDate, this.syncDeletedFromDate),
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
