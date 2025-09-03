<template>
  <div>
    <div class="title">{{ formData.name }}</div>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="info" :tab="$t('info')">
        <back-button />
        <info-tab :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="requisites" :tab="$t('requisites')">
        <company-requisites-tab :form-data="formData" />
      </n-tab-pane>
      <n-tab-pane name="offers" :tab="$t('offers')">
        <offers-tab />
      </n-tab-pane>
      <n-tab-pane name="projects" :tab="$t('projects')">
        <projects-tab />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
<script>
import { mapStores } from 'pinia';
import { useClientStore } from '@/store/client';
import InfoTab from '@/pages/companies/components/company_detail/components/tabs/InfoTab.vue';
import CompanyRequisitesTab from '@/pages/companies/components/company_detail/components/tabs/CompanyRequisitesTab.vue';
import ProjectsTab from '@/pages/companies/components/company_detail/components/tabs/ProjectsTab.vue';
import OffersTab from '@/pages/companies/components/company_detail/components/tabs/OffersTab.vue';
import BackButton from '@/pages/companies/components/company_detail/components/buttons/BackButton.vue';

export default {
  components: {
    InfoTab,
    CompanyRequisitesTab,
    ProjectsTab,
    OffersTab,
    BackButton,
  },
  data() {
    return {
      activeTab: 'info',
      formData: {},
      companyId: null,
    };
  },
  computed: {
    ...mapStores(useClientStore),
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.activeTab = newTab || 'info';
    },
    activeTab(newVal) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          tab: newVal,
        },
      });
    },
  },
  async created() {
    const query = { ...this.$route.query };
    this.activeTab = query.tab || 'info';
    this.companyId = this.$route.params.companyId || null;

    if (this.companyId) {
      await this.clientStore.fetch(this.companyId);
      this.formData = this.clientStore.client_data;
    } else {
      this.formData = {};
    }
  },
};
</script>
