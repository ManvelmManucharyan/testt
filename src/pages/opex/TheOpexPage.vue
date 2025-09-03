<template>
  <n-tabs v-model:value="activeTab" type="line" animated>
    <n-tab-pane name="project" tab="Project"> <information-page /> </n-tab-pane>
    <n-tab-pane name="offer" tab="Offer"> <information-page /> </n-tab-pane>
  </n-tabs>
</template>

<script>
import InformationPage from './InformationPage.vue';
import moment from 'moment';

export default {
  components: { InformationPage },
  data() {
    return {
      activeTab: 'project',
    };
  },
  watch: {
    '$route.query.tab'(newTab) {
      this.activeTab = newTab || 'project';
    },
    activeTab(newVal) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          tab: newVal,
        },
      });
    },
  },
  async created() {
    if (!this.$route.query.from_date) {
      await this.$router.replace({
        query: {
          ...this.$route.query,
          from_date: moment().format('YYYY-MM'),
        },
      });
    }

    if (!this.$route.query.to_date) {
      await this.$router.replace({
        query: {
          ...this.$route.query,
          to_date: moment().format('YYYY-MM'),
        },
      });
    }
    if (this.$route.query.tab) {
      this.activeTab = this.$route.query.tab;
    } else {
      await this.$router.replace({
        query: {
          ...this.$route.query,
          tab: 'project',
        },
      });
      this.activeTab = 'project';
    }
  },
};
</script>
