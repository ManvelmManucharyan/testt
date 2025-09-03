<template>
  <div>
    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('status') }}</th>
            <th>{{ $t('terminationDate') }}</th>
            <th>{{ $t('updatedAt') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="offer in offers" :key="offer.id">
            <td>
              <a :href="offerLink(offer.id)" target="_blank">
                {{ offer.name }}
              </a>
            </td>
            <td>
              {{ offer.status }}
            </td>
            <td>{{ formatAndShortDate(offer.termination_date) }}</td>
            <td>{{ formatDate(offer.updated_at, offer.author_name) }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable } from 'naive-ui';
import { useClientStore } from '@/store/client';
import { formatDate, formatAndShortDate } from '@/utils/time';
import { offerLink } from '@/utils/links';

export default {
  name: 'OffersTab',
  components: {
    NCard,
    NTable,
  },
  data() {
    return {
      offers: [],
      isLoading: false,
    };
  },
  computed: {
    ...mapStores(useClientStore),
  },
  async created() {
    this.offers = this.clientStore.client_data.offers || [];
  },
  methods: {
    formatDate,
    formatAndShortDate,
    offerLink,
  },
};
</script>

<style scoped>
.n-card {
  max-width: 100%;
}
td a {
  cursor: pointer;
}
</style>
