<template>
  <div v-if="isLoading" class="loading">{{ $t('loading') }}</div>
  <div v-else>
    <div class="title">{{ projectStore.data.name }}</div>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="general" :tab="$t('general')">
        <project-info />
      </n-tab-pane>
      <n-tab-pane name="roles" :tab="$t('roles')">
        <the-project-roles-page />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useProjectStore } from '@/store/project';
import ProjectInfo from './ProjectInfo.vue';
import TheProjectRolesPage from './roles_tab/TheProjectRolesPage.vue';

export default {
  components: {
    ProjectInfo,
    TheProjectRolesPage,
  },
  data() {
    return {
      activeTab: 'general',
    };
  },
  computed: {
    isLoading() {
      return this.projectStore.isLoading;
    },
    ...mapStores(useProjectStore),
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.activeTab = newTab || 'general';
    },
    activeTab(newVal) {
      const currentQuery = { ...this.$route.query };

      if (newVal !== 'roles') {
        delete currentQuery.employee_activity;
      }

      this.$router.replace({
        query: {
          ...currentQuery,
          tab: newVal,
        },
      });
    },
  },
  async created() {
    await this.projectStore.fetch(this.$route.params.projectId);
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    } else {
      this.$router.replace({
        query: {
          ...this.$route.query,
          tab: 'general',
        },
      });
      this.activeTab = 'general';
    }
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
