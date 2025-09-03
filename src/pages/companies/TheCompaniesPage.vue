<template>
  <div>
    <add-company-button />
    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('Name') }}</th>
            <th>{{ $t('Projects') }}</th>
            <th>{{ $t('Offers') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clientsStore.data" :key="client.id">
            <td>
              <router-link :to="clientLink(client)">
                {{ client.name }}
              </router-link>
            </td>
            <td>
              <span v-if="Array.isArray(client.projects)">
                <span
                  v-for="(project, index) in client.projects"
                  :key="project.id"
                >
                  <a :href="projectLink(project)" target="_blank">
                    {{ project.name }}
                  </a>
                  <span v-if="index < client.projects.length - 1">, </span>
                </span>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="Array.isArray(client.offers)">
                <span v-for="(offer, index) in client.offers" :key="offer.id">
                  <a :href="offerLink(offer.id)" target="_blank">
                    {{ offer.name }}
                  </a>
                  <span v-if="index < client.offers.length - 1">, </span>
                </span>
              </span>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable } from 'naive-ui';
import { useClientsStore } from '@/store/clients';
import AddCompanyButton from '@/pages/companies/components/AddCompanyButton.vue';
import { offerLink } from '@/utils/links';

export default {
  name: 'Companies',
  components: {
    NCard,
    NTable,
    AddCompanyButton,
  },
  computed: mapStores(useClientsStore),
  async created() {
    await this.clientsStore.fetch();
  },
  methods: {
    clientLink(client) {
      return {
        name: 'companies-page-detail',
        params: { companyId: client.id },
        query: { ...this.$route.query },
      };
    },
    projectLink(project) {
      return this.$router.resolve({
        name: 'projects-page-detail',
        params: { projectId: project.id },
        query: { ...this.$route.query },
      }).href;
    },
    offerLink,
  },
};
</script>

<style scoped>
.n-card {
  max-width: 100%;
}

td img {
  border-radius: 50%;
  object-fit: cover;
}

a {
  cursor: pointer;
  margin-right: 8px;
}
</style>
