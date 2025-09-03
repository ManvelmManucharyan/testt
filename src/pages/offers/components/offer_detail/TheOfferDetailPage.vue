<template>
  <div>
    <div class="title">{{ formData.name }}</div>
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="general" :tab="$t('general')">
        <n-divider />
        <back-button />
        <export-button :offer-id="offerId" />
        <n-grid cols="4" item-responsive responsive="screen">
          <n-grid-item span="0 m:1 l:2">
            <offer-general-tab :form-data="formData" />
          </n-grid-item>
        </n-grid>
        <n-divider />
      </n-tab-pane>

      <template v-if="offerId">
        <n-tab-pane name="rolesAndStages" :tab="$t('rolesAndStages')">
          <roles-and-stages-tab />
        </n-tab-pane>
        <n-tab-pane name="financialSource" :tab="$t('financialSource')">
          <financial-sources-tab />
        </n-tab-pane>
      </template>
    </n-tabs>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStore } from '@/store/offer';
import OfferGeneralTab from './components/tabs/OfferGeneralTab.vue';
import RolesAndStagesTab from '@/pages/offers/components/offer_detail/components/tabs/roles_and_stages/RolesAndStagesTab.vue';
import FinancialSourcesTab from '@/pages/offers/components/offer_detail/components/tabs/financial_sources/FinancialSourcesTab.vue';
import BackButton from '@/pages/offers/components/offer_detail/components/buttons/BackButton.vue';
import ExportButton from '@/pages/offers/components/offer_detail/components/buttons/ExportButton.vue';

export default {
  components: {
    OfferGeneralTab,
    RolesAndStagesTab,
    FinancialSourcesTab,
    BackButton,
    ExportButton,
  },
  data() {
    return {
      activeTab: 'general',
      formData: {},
      offerId: null,
    };
  },
  computed: {
    ...mapStores(useOfferStore),
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.activeTab = newTab || 'general';
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
    this.activeTab = query.tab || 'general';
    this.offerId = this.$route.params.offerId || null;

    if (this.offerId) {
      await this.offerStore.fetchById(this.offerId);
      this.formData = this.offerStore.offerData;
    } else {
      this.formData = {};
    }
  },
};
</script>

<style scoped>
.n-grid {
  gap: 16px;
}

.n-grid-item {
  padding: 16px;
}
</style>
