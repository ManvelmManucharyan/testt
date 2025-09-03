<template>
  <div class="header">
    <affiliation-type-select v-model="selectedAffiliationType" />

    <activity-select v-model="selectedActivityType" :allow-empty="false" />

    <input-form
      v-model="inputText"
      :placeholder="$t('searchByNameOrTelegram')"
    />

    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import AffiliationTypeSelect from '@/components/AffiliationTypeSelect.vue';
import ActivitySelect from '@/components/ActivitySelect.vue';
import InputForm from '@/components/InputForm.vue';

export default {
  name: 'FilterHeader',
  components: {
    AffiliationTypeSelect,
    ActivitySelect,
    InputForm,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedYear: null,
      selectedAffiliationType: null,
      selectedActivityType: null,
      inputText: null,
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
      const affiliation_type = this.$route.query.affiliation_type;
      const activity_type = this.$route.query.activity_type;

      const search = this.$route.query.search;

      if (search) {
        this.inputText = search;
      } else {
        this.inputText = null;
      }

      if (affiliation_type) {
        this.selectedAffiliationType = affiliation_type;
      } else {
        this.selectedAffiliationType = null;
      }

      if (activity_type) {
        this.selectedActivityType = activity_type;
      } else {
        this.selectedActivityType = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.selectedAffiliationType) {
        currentQuery.affiliation_type = this.selectedAffiliationType;
      } else {
        delete currentQuery.affiliation_type;
      }

      if (this.selectedActivityType) {
        currentQuery.activity_type = this.selectedActivityType;
      } else {
        delete currentQuery.activity_type;
      }

      if (this.inputText) {
        currentQuery.search = this.inputText;
      } else {
        delete currentQuery.search;
      }

      await this.$router.push({ path: this.$route.path, query: currentQuery });

      await this.$emit('search');
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
