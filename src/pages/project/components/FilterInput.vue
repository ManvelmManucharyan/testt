<template>
  <div class="header">
    <offer-select v-model="selectedOffer" />

    <activity-select v-model="selectedActivityType" :allow-empty="false" />

    <input-form v-model="inputText" :placeholder="$t('searchByName')" />

    <n-button class="btn" @click="onSearch">
      {{ $t('opexSearch') }}
    </n-button>
  </div>
</template>

<script>
import moment from 'moment';
import ActivitySelect from '@/components/ActivitySelect.vue';
import OfferSelect from '@/components/OfferSelect.vue';
import InputForm from '@/components/InputForm.vue';

export default {
  name: 'FilterHeader',
  components: {
    ActivitySelect,
    InputForm,
    OfferSelect,
  },
  emits: ['search'],
  data() {
    moment.locale(this.$i18n.locale);
    return {
      selectedActivityType: null,
      selectedOffer: null,
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
      const selectedActivityType = this.$route.query.activity_type;
      const selectedOffer = this.$route.query.offer;

      const search = this.$route.query.search;

      if (search) {
        this.inputText = search;
      } else {
        this.inputText = null;
      }

      if (selectedActivityType) {
        this.selectedActivityType = selectedActivityType;
      } else {
        this.selectedActivityType = null;
      }

      if (selectedOffer) {
        this.selectedOffer = selectedOffer;
      } else {
        this.selectedOffer = null;
      }
    },
    async onSearch() {
      const currentQuery = { ...this.$route.query };

      if (this.selectedActivityType) {
        currentQuery.activity_type = this.selectedActivityType;
      } else {
        delete currentQuery.activity_type;
      }

      if (this.selectedOffer) {
        currentQuery.offer = this.selectedOffer;
      } else {
        delete currentQuery.offer;
      }

      if (this.inputText) {
        currentQuery.search = this.inputText;
      } else {
        delete currentQuery.search;
      }

      await this.$router.push({ path: this.$route.path, query: currentQuery });

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
