<template>
  <div class="header">
    <n-button style="margin-left: auto" class="btn" @click="addCompany">
      {{ $t('addCompany') }}
    </n-button>
    <the-modal
      v-model:show="showCompanyModal"
      :modal-style="{ width: '45%' }"
      @positive-click="submitCompanyForm"
      @negative-click="onClickCloseCompanyModal"
      @close="onClickCloseCompanyModal"
    >
      <n-card
        :bordered="false"
        role="dialog"
        aria-modal="true"
        :title="$t('addCompany')"
      >
        <div class="modal-content">
          <info-tab v-model:form-data="form" />
        </div>
      </n-card>

      <template #action>
        <n-space justify="end">
          <n-button @click="onClickCloseCompanyModal">
            {{ $t('cancel') }}</n-button
          >
          <n-button type="primary" @click="submitCompanyForm">
            {{ $t('save') }}
          </n-button>
        </n-space>
      </template>
    </the-modal>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NButton } from 'naive-ui';
import TheModal from '@/components/TheModal.vue';
import { useClientStore } from '@/store/client';
import InfoTab from '@/pages/companies/components/company_detail/components/tabs/InfoTab.vue';

export default {
  name: 'AddCompanyButton',
  components: {
    NCard,
    NButton,
    TheModal,
    InfoTab,
  },

  data() {
    return {
      form: {},
      showCompanyModal: false,
    };
  },
  computed: {
    ...mapStores(useClientStore),
  },

  watch: {
    showCompanyModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.create': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showCompanyModal = true;
        }
      },
    },
  },
  methods: {
    async submitCompanyForm() {
      const formattedData = {
        ...this.form,
      };

      await this.clientStore.create(formattedData).then(() => {
        this.removeQueryParams();
        this.showCompanyModal = false;
      });
    },

    addCompany() {
      this.$router.push({
        query: {
          ...this.$route.query,
          create: true,
        },
      });
      this.showCompanyModal = true;
    },

    onClickCloseCompanyModal() {
      this.showCompanyModal = false;
      this.removeQueryParams();
    },

    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.create;
      this.showCompanyModal = false;

      this.$router.push({ query });
      this.form = {};
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
.modal-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
