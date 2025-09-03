<template>
  <div v-if="selectedOffer" class="button-container">
    <n-button @click="onAddStageClick">
      {{ $t('addStage') }}
    </n-button>
  </div>

  <the-modal
    v-model:show="showStageModal"
    :modal-style="{ width: '45%' }"
    @positive-click="submitStageForm"
    @negative-click="onClickCloseStageModal"
    @close="onClickCloseStageModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="$t('addStage')"
    >
      <stage-modal v-model="form" />
    </n-card>
    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseStageModal"> {{ $t('cancel') }}</n-button>
        <n-button type="primary" @click="submitStageForm">
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
import StageModal from '@/pages/offers/components/offer_detail/components/modals/StageModal.vue';
import TheModal from '@/components/TheModal.vue';

import { useOfferStageStore } from '@/store/offerStage';

export default {
  name: 'AddStage',
  components: {
    NCard,
    NButton,
    StageModal,
    TheModal,
  },
  props: {
    selectedOffer: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      form: {},
      showStageModal: false,
    };
  },
  computed: {
    ...mapStores(useOfferStageStore),
    isEditMode() {
      return !!this.$route.query.edit_stage;
    },
  },
  watch: {
    '$route.query.edit_stage': {
      immediate: true,
      async handler(newStageId) {
        if (newStageId && !this.showStageModal) {
          this.showStageModal = true;
          const offerId = this.$route.params.offerId;
          await this.offerStageStore.fetch(newStageId, offerId);
          this.form = {
            ...this.offerStageStore.data,
            from_date: this.offerStageStore.data.from_date
              ? new Date(this.offerStageStore.data.from_date).getTime()
              : null,
            to_date: this.offerStageStore.data.to_date
              ? new Date(this.offerStageStore.data.to_date).getTime()
              : null,
          };
        } else {
          this.showStageModal = false;
        }
      },
    },
    '$route.query.add_stage': {
      immediate: true,
      handler(addStage) {
        if (addStage) {
          this.showStageModal = true;
        }
      },
    },
    showStageModal(newVal) {
      if (!newVal) {
        this.removeStageQueryParams();
      }
    },
  },
  methods: {
    onAddStageClick() {
      if (!this.showStageModal) {
        this.showStageModal = true;

        this.$router.push({
          query: {
            ...this.$route.query,
            add_stage: true,
          },
        });
      }
    },
    onClickCloseStageModal() {
      this.showStageModal = false;
      this.removeStageQueryParams();
    },
    removeStageQueryParams() {
      const query = { ...this.$route.query };
      delete query.add_stage;
      delete query.edit_stage;
      this.showStageModal = false;

      this.$router.push({ query });
      this.form = {};
    },
    submitStageForm() {
      const offerId = this.$route.params.offerId;
      if (this.$route.query.edit_stage) {
        this.form.from_date = this.formatDate(this.form.from_date);
        this.form.to_date = this.formatDate(this.form.to_date);
        this.form.tariff_rate_date = this.formatDate(
          this.form.tariff_rate_date,
        );
        this.offerStageStore
          .update(this.form.id, this.form, offerId)
          .then(() => {
            this.removeStageQueryParams();
          });
      } else {
        const formattedFromDate = this.formatDate(this.form.from_date);
        const formattedToDate = this.formatDate(this.form.to_date);
        const formattedTariffRateDate = this.formatDate(
          this.form.tariff_rate_date,
        );
        const submissionData = {
          ...this.form,
          offer: offerId,
          from_date: formattedFromDate,
          to_date: formattedToDate,
          tariff_rate_date: formattedTariffRateDate,
        };

        this.offerStageStore.create(submissionData).then(() => {
          this.removeStageQueryParams();
        });
      }
    },
    onDelete() {
      const stageId = this.$route.query.edit_stage;
      const offerId = this.$route.params.offerId;
      this.offerStageStore.remove(stageId, offerId);
      this.showStageModal = false;
    },
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },
  },
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  position: absolute;
  top: 20px;
  right: 170px;
}
</style>
