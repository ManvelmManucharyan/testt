<template>
  <n-button class="button-container" @click="addOffer">
    {{ $t('addOffer') }}
  </n-button>

  <the-modal
    v-model:show="showOfferModal"
    :modal-style="{ width: '50%' }"
    @positive-click="submitOfferForm"
    @negative-click="onClickCloseOfferModal"
    @close="onClickCloseOfferModal"
  >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      :title="$t('addOffer')"
    >
      <offer-general-tab v-model:form-data="form" />
    </n-card>

    <template #action>
      <n-space justify="end">
        <n-button @click="onClickCloseOfferModal"> {{ $t('cancel') }}</n-button>
        <n-button type="primary" @click="submitOfferForm">
          {{ $t('save') }}
        </n-button>
      </n-space>
    </template>
  </the-modal>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NButton } from 'naive-ui';
import TheModal from '@/components/TheModal.vue';
import { useOfferStore } from '@/store/offer';
import OfferGeneralTab from '@/pages/offers/components/offer_detail/components/tabs/OfferGeneralTab.vue';
import { useMeStore } from '@/store/me';

export default {
  name: 'FinancialSources',
  components: {
    NCard,
    NButton,
    TheModal,
    OfferGeneralTab,
  },
  data() {
    return {
      form: {},
      showOfferModal: false,
    };
  },
  computed: {
    ...mapStores(useMeStore, useOfferStore),
  },

  watch: {
    showOfferModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.create': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showOfferModal = true;
        }
      },
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },
    async submitOfferForm() {
      const formattedData = {
        ...this.form,
        rate_calculation_reference_date: this.formatDate(
          this.form.rate_calculation_reference_date,
        ),
        author: this.meStore.data.id,
      };

      await this.offerStore.create(formattedData).then(() => {
        this.removeQueryParams();
        this.showOfferModal = false;
      });
    },

    addOffer() {
      this.$router.push({
        query: {
          ...this.$route.query,
          create: true,
        },
      });
      this.showOfferModal = true;
    },

    onClickCloseOfferModal() {
      this.showOfferModal = false;
      this.removeQueryParams();
    },

    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.create;
      this.showOfferModal = false;

      this.$router.push({ query });
      this.form = {};
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
  top: 60px;
  right: 70px;
}
</style>
