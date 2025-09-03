<template>
  <n-button class="save-button" type="success" @click="submitOfferForm">
    {{ $t('save') }}
  </n-button>
</template>

<script>
import { mapStores } from 'pinia';
import { useOfferStore } from '@/store/offer';
import { useMeStore } from '@/store/me';

export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:formData'],
  data() {
    return {
      localFormData: { ...this.formData },
    };
  },
  computed: {
    ...mapStores(useOfferStore, useMeStore),
  },
  watch: {
    formData: {
      handler(newValue) {
        this.localFormData = { ...newValue };
      },
      deep: true,
    },
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
  },

  methods: {
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const year = d.getFullYear();
      return `${month}/${day}/${year}`;
    },
    async submitOfferForm() {
      const offerId = this.$route.params.offerId;

      const formattedData = {
        ...this.localFormData,
        rate_calculation_reference_date: this.formatDate(
          this.localFormData.rate_calculation_reference_date,
        ),
        author: this.meStore.data.id,
      };

      if (offerId) {
        await this.offerStore.update(offerId, formattedData);
        this.$router.push('/offers');
      } else {
        await this.offerStore.create(formattedData);
        this.$router.push('/offers');
      }
    },
  },
};
</script>

<style scoped>
.save-button {
  background-color: green;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 8px;
}
</style>
