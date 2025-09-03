<template>
  <div class="container">
    <financial-source-modal />
    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('client') }}</th>
            <th>{{ $t('tariff') }}</th>
            <th>{{ $t('fundingShare') }}</th>
            <th>{{ $t('equity') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="source in financialSourcesStore.data" :key="source.id">
            <td>
              <router-link :to="editFinancialSourceLink(source)" replace>
                {{ source.client_name }}
              </router-link>
            </td>
            <td>{{ source.tariff }}</td>
            <td>{{ source.funding_share }}</td>
            <td>{{ source.equity }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable } from 'naive-ui';
import { useFinancialSourcesStore } from '@/store/financialSources';
import FinancialSourceModal from './components/FinancialSourceModal.vue';

export default {
  name: 'FinancialSources',
  components: {
    NCard,
    NTable,
    FinancialSourceModal,
  },
  data() {
    return {
      form: {},
      showFinancialSourceModal: false,
    };
  },
  computed: mapStores(useFinancialSourcesStore),
  watch: {
    showFinancialSourceModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.add_financial_source': {
      immediate: true,
      handler(add_financial_source) {
        if (add_financial_source) {
          this.showFinancialSourceModal = true;
        }
      },
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const offerId = this.$route.params.offerId;
      await this.financialSourcesStore.retrieveFinancialSources(offerId);
    },
    handleAddSource() {
      if (!this.showFinancialSourceModal) {
        this.showFinancialSourceModal = true;

        this.$router.push({
          query: {
            ...this.$route.query,
            add_financial_source: true,
          },
        });
      }
    },
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.add_financial_source;
      this.showFinancialSourceModal = false;

      this.$router.push({ query });
      this.form = {};
    },
    editFinancialSourceLink(source) {
      return {
        path: this.$route.path,
        query: {
          ...this.$route.query,
          edit_financial_source: source.id,
        },
      };
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
}

.header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
}

.add-button {
  margin-right: 10px;
}
</style>
