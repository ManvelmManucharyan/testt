<template>
  <div class="header">
    <n-button class="btn" @click="handleAddSource">
      {{ $t('addFinancialSource') }}
    </n-button>
  </div>

  <the-modal
    v-model:show="showFinancialSourceModal"
    :modal-style="{ width: '35%' }"
    @positive-click="submitFinancialSourceForm"
    @negative-click="onClickCloseFinancialSourceModal"
    @close="onClickCloseFinancialSourceModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="$t('addFinancialSource')"
    >
      <financial-source-form v-model="form" />
    </n-card>
    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseFinancialSourceModal">
          {{ $t('cancel') }}</n-button
        >
        <n-button type="primary" @click="submitFinancialSourceForm">
          {{ $t('save') }}
        </n-button>
        <n-button v-if="isEditMode" type="error" @click="onDelete">
          {{ $t('delete') }}
        </n-button>
      </n-space>
    </template>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NButton } from 'naive-ui';
import { useFinancialSourcesStore } from '@/store/financialSources';
import { useFinancialSourceStore } from '@/store/financialSource';
import TheModal from '@/components/TheModal.vue';
import FinancialSourceForm from '@/pages/offers/components/offer_detail/components/tabs/financial_sources/components/FinancialSourceForm.vue';

export default {
  name: 'FinancialSources',
  components: {
    NCard,
    NButton,
    TheModal,
    FinancialSourceForm,
  },
  data() {
    return {
      form: {},
      showFinancialSourceModal: false,
    };
  },
  computed: {
    ...mapStores(useFinancialSourcesStore, useFinancialSourceStore),
    isEditMode() {
      return !!this.$route.query.edit_financial_source;
    },
  },

  watch: {
    showFinancialSourceModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.add_financial_source': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showFinancialSourceModal = true;
        }
      },
    },
    '$route.query.edit_financial_source': {
      immediate: true,
      async handler(newFinSourceId) {
        if (newFinSourceId && !this.showFinancialSourceModal) {
          this.showFinancialSourceModal = true;
          const offerId = this.$route.params.offerId;
          await this.financialSourceStore.fetchFinSource(
            newFinSourceId,
            offerId,
          );
          this.form = { ...this.financialSourceStore.fin_source_data };
        } else {
          this.showFinancialSourceModal = false;
        }
      },
    },
  },
  methods: {
    submitFinancialSourceForm() {
      const offerId = this.$route.params.offerId;
      if (this.$route.query.edit_financial_source) {
        this.financialSourceStore
          .update(this.form.id, this.form, offerId)
          .then(() => {
            this.removeQueryParams();
          });
      } else {
        const submissionData = {
          ...this.form,
          offer: offerId,
        };
        this.financialSourceStore.create(submissionData).then(() => {
          this.removeQueryParams();
          this.showFinancialSourceModal = false;
        });
      }
    },

    handleAddSource() {
      this.$router.push({
        query: {
          ...this.$route.query,
          add_financial_source: true,
        },
      });
      this.showFinancialSourceModal = true;
    },
    onClickCloseFinancialSourceModal() {
      this.showFinancialSourceModal = false;
      this.removeQueryParams();
    },
    onDelete() {
      const financialSourceId = this.$route.query.edit_financial_source;
      const offerId = this.$route.params.offerId;
      this.financialSourceStore.remove(financialSourceId, offerId);
      this.showFinancialSourceModal = false;
    },
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.add_financial_source;
      delete query.edit_financial_source;
      this.showFinancialSourceModal = false;

      this.$router.push({ query });
      this.form = {};
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}
</style>
