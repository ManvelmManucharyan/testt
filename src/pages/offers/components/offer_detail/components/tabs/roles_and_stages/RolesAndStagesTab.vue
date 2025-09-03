<template>
  <div>
    <add-stage-button :selected-offer="selectedOffer" />

    <add-departments-button :selected-offer="selectedOffer" />

    <div class="content-area">
      <div v-if="selectedOffer" class="table-container">
        <offer-role-table :offer-id="selectedOffer" />
      </div>
    </div>
  </div>
</template>

<script>
import OfferRoleTable from './components/OfferRoleTable.vue';
import AddStageButton from '@/pages/offers/components/offer_detail/components/buttons/AddStageButton.vue';
import AddDepartmentsButton from '@/pages/offers/components/offer_detail/components/buttons/AddDepartmentsButton.vue';

export default {
  name: 'RolesAndStages',
  components: {
    OfferRoleTable,
    AddStageButton,
    AddDepartmentsButton,
  },
  data() {
    return {
      selectedOffer: this.$route.params.offerId || null,
    };
  },
  watch: {
    selectedOffer(offer_id) {
      if (offer_id) {
        this.$router.push({
          path: `/offers/${offer_id}`,
        });
      } else {
        this.$router.push({ path: '/offers' });
      }
    },
    '$route.params.offerId': {
      immediate: true,
      handler(newOfferId) {
        this.selectedOffer = newOfferId || null;
      },
    },
  },
};
</script>

<style scoped>
.table-container {
  overflow: auto;
  overflow-x: auto;
  max-height: 70vh;
}

.content-area {
  margin-top: 80px;
}
</style>
