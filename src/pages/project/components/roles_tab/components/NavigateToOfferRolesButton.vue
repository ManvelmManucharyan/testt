<template>
  <n-button v-if="project && project.offer_id" @click="navigateToOfferRoles">
    {{ $t('manageOfferRoles') }}
  </n-button>
</template>

<script>
import { mapStores } from 'pinia';
import { NButton } from 'naive-ui';
import { useProjectStore } from '@/store/project';

export default {
  name: 'NavigateOfferRolesButton',
  components: {
    NButton,
  },
  computed: {
    ...mapStores(useProjectStore),
    project() {
      return this.projectStore.data;
    },
  },
  created() {
    if (!this.project) {
      this.projectStore.fetch(this.$route.params.projectId);
    }
  },
  methods: {
    navigateToOfferRoles() {
      if (!this.project || !this.project.offer_id) return;

      const currentQuery = { ...this.$route.query };
      delete currentQuery.employee_activity;

      const route = this.$router.resolve({
        name: 'offers-page-detail',
        params: { offerId: this.project.offer_id },
        query: { ...currentQuery, tab: 'rolesAndStages' },
      });

      window.open(route.href, '_blank');
    },
  },
};
</script>
