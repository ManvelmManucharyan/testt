<template>
  <n-button class="button-container" @click="addTariffRate">
    {{ $t('addTariffRate') }}
  </n-button>

  <the-modal
    v-model:show="showTariffRateModal"
    :modal-style="{ width: '40%' }"
    @positive-click="submitTariffRateForm"
    @negative-click="onClickCloseTariffRateModal"
    @close="onClickCloseTariffRateModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      class="scrollable-card"
      :title="
        isEditMode
          ? `${$t('editTariffRateForRole')} ${form.role_name}`
          : $t('addTariffRate')
      "
    >
      <tariff-rate-form v-model="form" />
    </n-card>

    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseTariffRateModal">
          {{ $t('cancel') }}
        </n-button>
        <n-button type="primary" @click="submitTariffRateForm">
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
import TheModal from '@/components/TheModal.vue';
import { useTariffRateStore } from '@/store/tariffRate';
import TariffRateForm from '@/pages/financial_models/tariff_rates/components/TariffRateForm.vue';

export default {
  name: 'TariffRateButton',
  components: {
    NCard,
    NButton,
    TheModal,
    TariffRateForm,
  },
  data() {
    return {
      form: {},
      showTariffRateModal: false,
    };
  },
  computed: {
    ...mapStores(useTariffRateStore),
    isEditMode() {
      return !!this.$route.query.edit_rate;
    },
  },
  watch: {
    showTariffRateModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.create': {
      immediate: true,
      handler(newVal) {
        if (newVal === 'true' || newVal === true) {
          this.showTariffRateModal = true;
        } else {
          this.showTariffRateModal = false;
        }
      },
    },
    '$route.query.edit_rate': {
      immediate: true,
      async handler(newRateId) {
        if (newRateId && !this.showTariffRateModal) {
          this.showTariffRateModal = true;
          await this.tariffRateStore.fetch(newRateId, {
            year: this.$route.query.year,
            month: this.$route.query.month,
          });
          let fetchedData = { ...this.tariffRateStore.data };

          this.form = {
            ...fetchedData,
            rate_rub: Math.round(fetchedData.rate_rub),
            rate_rub_is_set: fetchedData.rate_rub_is_set,

            rate_usd: Math.round(fetchedData.rate_usd),
            rate_usd_is_set: fetchedData.rate_usd_is_set,

            rate_eur: Math.round(fetchedData.rate_eur),
            rate_eur_is_set: fetchedData.rate_eur_is_set,

            cost_rub: Math.round(fetchedData.cost_rub),
            cost_rub_is_set: fetchedData.cost_rub_is_set,

            cost_usd: Math.round(fetchedData.cost_usd),
            cost_usd_is_set: fetchedData.cost_usd_is_set,

            cost_eur: Math.round(fetchedData.cost_eur),
            cost_eur_is_set: fetchedData.cost_eur_is_set,

            development_rub: Math.round(fetchedData.development_rub),
            development_rub_is_set: fetchedData.development_rub_is_set,

            development_usd: Math.round(fetchedData.development_usd),
            development_usd_is_set: fetchedData.development_usd_is_set,

            development_eur: Math.round(fetchedData.development_eur),
            development_eur_is_set: fetchedData.development_eur_is_set,

            profit_rub: Math.round(fetchedData.profit_rub),
            profit_rub_is_set: fetchedData.profit_rub_is_set,

            profit_usd: Math.round(fetchedData.profit_usd),
            profit_usd_is_set: fetchedData.profit_usd_is_set,

            profit_eur: Math.round(fetchedData.profit_eur),
            profit_eur_is_set: fetchedData.profit_eur_is_set,
          };
        } else if (!this.$route.query.create) {
          this.showTariffRateModal = false;
        }
      },
    },
  },
  methods: {
    async submitTariffRateForm() {
      const modifiedData = { ...this.form };

      if (this.$route.query.edit_rate) {
        const payload = {
          role: modifiedData.role,
          date: modifiedData.date,
        };
        Object.keys(modifiedData).forEach((key) => {
          if (
            modifiedData[key] !== this.tariffRateStore.data[key] &&
            key !== 'role'
          ) {
            payload[key] = modifiedData[key];
          }
        });
        await this.tariffRateStore.update(
          this.form.id,
          payload,
          this.$route.query.year,
          this.$route.query.month,
        );
        this.removeQueryParams();
      } else {
        await this.tariffRateStore.create(
          modifiedData,
          this.$route.query.year,
          this.$route.query.month,
        );
        this.removeQueryParams();
        this.showTariffRateModal = false;
      }
    },
    addTariffRate() {
      this.$router.push({
        query: {
          ...this.$route.query,
          create: 'true',
        },
      });
      this.showTariffRateModal = true;
    },
    onClickCloseTariffRateModal() {
      this.showTariffRateModal = false;
      this.removeQueryParams();
    },
    onDelete() {
      const tariffRateId = this.$route.query.edit_rate;
      this.tariffRateStore.remove(
        tariffRateId,
        this.$route.query.year,
        this.$route.query.month,
      );
      this.showTariffRateModal = false;
    },
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.create;
      delete query.edit_rate;
      this.$router.push({ query });
      this.form = {};
    },
  },
};
</script>

<style scoped>
.scrollable-card {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
