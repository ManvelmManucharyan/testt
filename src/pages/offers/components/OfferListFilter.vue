<template>
  <div class="header">
    <project-select v-model="selectedProject" />
    <offer-status-select v-model="selectedStatus" />
    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import ProjectSelect from '@/components/ProjectSelect.vue';
import OfferStatusSelect from '@/components/OfferStatusSelect.vue';

export default {
  name: 'OfferListHeader',
  components: {
    ProjectSelect,
    OfferStatusSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedProject: null,
      selectedStatus: null,
    };
  },
  watch: {
    '$route.query': {
      handler() {
        this.initializeSelections();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.initializeSelections();
  },
  methods: {
    initializeSelections() {
      const { project, status } = this.$route.query;

      if (status) {
        this.selectedStatus = status;
      } else {
        this.selectedStatus = null;
      }

      if (project) {
        this.selectedProject = project;
      } else {
        this.selectedProject = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.selectedStatus) {
        currentQuery.status = this.selectedStatus;
      } else {
        delete currentQuery.status;
      }

      if (this.selectedProject) {
        currentQuery.project = this.selectedProject;
      } else {
        delete currentQuery.project;
      }

      await this.$router.push({
        path: this.$route.path,
        query: currentQuery,
      });

      this.$emit('search');
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
</style>
