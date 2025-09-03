<template>
  <div>
    <div class="header">
      <filter-input @search="fetchData" />
    </div>
    <n-card>
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th>{{ $t('name') }}</th>
            <th>{{ $t('code') }}</th>
            <th>{{ $t('category') }}</th>
            <th>{{ $t('offer') }}</th>
            <th>{{ $t('lead') }}</th>
            <th>{{ $t('telegramChat') }}</th>
            <th>{{ $t('isActive') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projectsStore.data" :key="project.id">
            <td>
              <router-link :to="projectLink(project)" replace>
                {{ project.name }}
              </router-link>
            </td>
            <td>{{ project.key }}</td>
            <td>{{ project.category }}</td>
            <td>
              <router-link
                v-if="project.offer_id"
                :to="offerUrl(project.offer_id)"
                replace
                target="_blank"
              >
                {{ project.offer_name }}
              </router-link>
            </td>
            <td>
              <template v-if="project.lead_id">
                <router-link
                  :to="employeeLink(project.lead_id)"
                  replace
                  target="_blank"
                >
                  {{ project.lead_name }}
                </router-link>
              </template>
              <template v-else>
                {{ project.lead_name }}
              </template>
            </td>
            <td>
              <a :href="project.telegram_chat" target="_blank">
                {{ project.telegram_chat }}
              </a>
            </td>
            <td>
              <n-icon v-if="project.is_active" color="green" size="20">
                <checkmark-circle-outline />
              </n-icon>
              <n-icon v-else color="red" size="20">
                <close-circle-outline />
              </n-icon>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { NCard, NTable, NIcon } from 'naive-ui';
import { CheckmarkCircleOutline, CloseCircleOutline } from '@vicons/ionicons5';
import FilterInput from './components/FilterInput.vue';
import { useProjectsStore } from '@/store/projects';

export default {
  name: 'Employees',
  components: {
    NCard,
    NTable,
    NIcon,
    FilterInput,
    CheckmarkCircleOutline,
    CloseCircleOutline,
  },
  data() {
    return {
      employees: [],
      form: {},
    };
  },
  computed: mapStores(useProjectsStore),
  created() {
    this.fetchData();
  },
  methods: {
    projectLink(project) {
      return {
        name: 'projects-page-detail',
        params: {
          projectId: project.id,
        },
      };
    },
    employeeLink(employee_id) {
      return {
        name: 'employees-page-detail',
        params: {
          employeeId: employee_id,
        },
      };
    },
    offerUrl(offerId) {
      return {
        name: 'offers-page-detail',
        params: {
          offerId: offerId,
        },
      };
    },
    async fetchData() {
      const currentQuery = { ...this.$route.query };

      if (!currentQuery.activity_type) {
        currentQuery.activity_type = 'active';
      }

      await this.$router.push({ path: this.$route.path, query: currentQuery });
      await this.projectsStore.fetch({
        activity_type: this.$route.query.activity_type,
        search: this.$route.query.search,
        offer: this.$route.query.offer,
        with_details: true,
      });
    },
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

router-link {
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;
}
</style>
