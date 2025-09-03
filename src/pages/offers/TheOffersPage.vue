<template>
  <div>
    <offer-list-filter @search="fetchData" />
    <add-offer-button />

    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('offerName') }}</th>
            <th>{{ $t('client') }}</th>
            <th>{{ $t('status') }}</th>
            <th>{{ $t('project') }}</th>
            <th>{{ $t('updatedAt') }}</th>
            <th>{{ $t('terminationDate') }}</th>
            <th>{{ $t('monthsDuration') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="offer in offersStore.data" :key="offer.id">
            <td>
              <router-link :to="offerLink(offer.id)">
                {{ offer.name }}
              </router-link>
            </td>
            <td>
              <router-link
                :to="clientUrl(offer.client)"
                replace
                target="_blank"
              >
                {{ offer.client_name }}
              </router-link>
            </td>
            <td>{{ offer.status }}</td>
            <td>
              <span
                v-if="offer.project && offer.project_name"
                style="cursor: pointer; text-decoration: underline"
                @click="openProjectPage(offer)"
              >
                {{ offer.project_name }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatDate(offer.updated_at, offer.author_name) }}</td>
            <td>{{ formatAndShortDate(offer.termination_date) }}</td>
            <td>{{ offer.months_duration }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable } from 'naive-ui';
import { useOffersStore } from '@/store/offers.js';
import OfferListFilter from './components/OfferListFilter.vue';
import AddOfferButton from '@/pages/offers/components/buttons/AddOfferButton.vue';
import { formatDate, formatAndShortDate } from '@/utils/time';
import { getLocalStorageKey, setLocalStorageKey } from '@/utils/localStorage';
import { offerLink } from '@/utils/links';

export default {
  name: 'OffersPage',
  components: {
    NCard,
    NTable,
    OfferListFilter,
    AddOfferButton,
  },
  computed: mapStores(useOffersStore),
  async created() {
    let initialStatus = 'in_progress';

    if (this.$route.query.status) {
      initialStatus = this.$route.query.status.replace('-', '_');
    } else {
      const savedStatus = getLocalStorageKey('offer_status');
      if (savedStatus) {
        initialStatus = savedStatus;
      }
    }

    setLocalStorageKey('offer_status', initialStatus);

    if (!this.$route.query.status) {
      await this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          status: initialStatus,
        },
      });
    }

    await this.fetchData();
  },
  methods: {
    formatDate,
    formatAndShortDate,
    openProjectPage(offer) {
      const url = `${window.location.origin}/projects/${offer.project}?tab=general`;
      window.open(url, '_blank');
    },
    clientUrl(clientId) {
      return {
        name: 'companies-page-detail',
        params: {
          companyId: clientId,
        },
      };
    },
    async fetchData() {
      const status = this.$route.query.status;
      setLocalStorageKey('offer_status', status);

      await this.offersStore.fetch({
        project: this.$route.query.project,
        status,
      });
    },
    offerLink,
  },
};
</script>
