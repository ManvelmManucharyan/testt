<template>
  <n-dropdown trigger="click" :options="options">
    <n-button>{{ $t('actions') }}</n-button>
  </n-dropdown>
  <sync-jira-dialog
    v-model:show="showJiraDialog"
    @close="showJiraDialog = false"
  />
  <sync-rates-dialog
    v-model:show="showRatesDialog"
    @close="showRatesDialog = false"
  />
</template>

<script>
import SyncJiraDialog from './SyncJiraDialog.vue';
import SyncRatesDialog from './SyncRatesDialog.vue';

export default {
  name: 'ActionsDropdown',
  components: {
    SyncJiraDialog,
    SyncRatesDialog,
  },
  data() {
    return {
      showJiraDialog: false,
      showRatesDialog: false,
    };
  },
  computed: {
    options() {
      return [
        {
          label: this.$t('sync_jira'),
          key: 'sync jira',
          props: {
            onClick: () => {
              this.showJiraDialog = true;
            },
          },
        },
        {
          label: this.$t('sync_rates'),
          key: 'sync rates',
          props: {
            onClick: () => {
              this.showRatesDialog = true;
            },
          },
        },
      ];
    },
  },
};
</script>

<style scoped>
button {
  padding: 5px 10px;
  border-radius: 4px;
  border: none;
  background-color: #495057;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6c757d;
}

button:focus {
  outline: none;
  background-color: #6c757d;
}
</style>
