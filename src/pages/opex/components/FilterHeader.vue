<template>
  <div class="header">
    <n-date-picker
      v-model:value="rangeDate"
      type="monthrange"
      format="y MMM"
      month-format="MMM"
      :shortcuts="shortcuts"
      :first-day-of-week="0"
      :update-value-on-close="true"
      clearable
      :actions="null"
    />

    <project-select
      v-if="activeTab === 'project'"
      v-model="selectedProject"
      multiple
      :max="5"
    />

    <offer-select
      v-if="activeTab === 'offer'"
      v-model="selectedOffer"
      multiple
      :max="5"
    />

    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
    <n-button style="margin-left: auto" class="btn" @click="goToCreationPage">
      {{ $t('addOperationalExpense') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import ProjectSelect from '@/components/ProjectSelect.vue';
import OfferSelect from '@/components/OfferSelect.vue';

export default {
  name: 'FilterHeader',
  components: {
    ProjectSelect,
    OfferSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      rangeDate: null,
      selectedProject: null,
      selectedOffer: null,
    };
  },
  computed: {
    shortcuts() {
      return {
        [this.$t('thisMonth')]: () => {
          const thisMonth = moment().startOf('month').valueOf();
          return [thisMonth, thisMonth];
        },
        [this.$t('lastMonth')]: () => {
          const lastMonth = moment()
            .subtract(1, 'month')
            .startOf('month')
            .valueOf();
          return [lastMonth, lastMonth];
        },
        [this.$t('thisYear')]: () => {
          const start = moment().startOf('year').valueOf();
          const end = moment().endOf('year').valueOf();
          return [start, end];
        },
        [this.$t('lastYear')]: () => {
          const start = moment().subtract(1, 'year').startOf('year').valueOf();
          const end = moment().subtract(1, 'year').endOf('year').valueOf();
          return [start, end];
        },
      };
    },
    activeTab() {
      return this.$route.query.tab;
    },
  },
  watch: {
    '$route.query': {
      handler() {
        this.initializeSelections();
      },
      immediate: true,
      deep: true,
    },
    activeTab(newTab) {
      const newQuery = { ...this.$route.query };
      if (newTab === 'project') {
        delete newQuery.offer_id;
      }
      if (newTab === 'offer') {
        delete newQuery.project_id;
      }
      this.$router.replace({
        path: this.$route.path,
        query: newQuery,
      });
    },
  },
  mounted() {
    this.initializeSelections();
  },
  methods: {
    initializeSelections() {
      const { from_date, to_date, project_id, offer_id } = this.$route.query;

      if (from_date && to_date) {
        this.rangeDate = [
          new Date(from_date).getTime(),
          new Date(to_date).getTime(),
        ];
      } else {
        this.fromDate = null;
      }

      if (this.activeTab === 'project') {
        this.selectedProject = project_id ? project_id : null;
        this.selectedOffer = null;
      } else if (this.activeTab === 'offer') {
        this.selectedOffer = offer_id ? offer_id : null;
        this.selectedProject = null;
      } else {
        this.selectedProject = null;
        this.selectedOffer = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.rangeDate) {
        currentQuery.from_date = moment(this.rangeDate[0]).format('YYYY-MM');
      } else {
        delete currentQuery.from_date;
      }

      if (this.rangeDate) {
        currentQuery.to_date = moment(this.rangeDate[1]).format('YYYY-MM');
      } else {
        delete currentQuery.to_date;
      }

      if (this.activeTab === 'project') {
        if (this.selectedProject) {
          currentQuery.project_id = this.selectedProject;
        } else {
          delete currentQuery.project_id;
        }
        delete currentQuery.offer_id;
      } else {
        if (this.selectedOffer) {
          currentQuery.offer_id = this.selectedOffer;
        } else {
          delete currentQuery.offer_id;
        }
        delete currentQuery.project_id;
      }

      await this.$router.push({
        path: this.$route.path,
        query: currentQuery,
      });

      this.$emit('search');
    },
    goToCreationPage() {
      this.$router.push(
        `${this.$route.path}/create?tab=${this.$route.query.tab}`,
      );
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
