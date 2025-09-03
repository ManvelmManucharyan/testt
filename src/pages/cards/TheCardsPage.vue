<template>
  <div>
    <n-card>
      <card-header />
      <n-table :bordered="true" :striped="true">
        <thead>
          <tr>
            <th colspan="2">{{ $t('value') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="card in cardsStore.data" :key="card.id">
            <td>
              <router-link :to="cardLink(card)">
                {{ card.value }}
              </router-link>
            </td>
            <td class="delete-item-col">
              <delete-item @positive-click="deleteCard(card.id)" />
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
import { useCardsStore } from '@/store/cards';
import { useCardStore } from '@/store/card';
import CardHeader from './components/CardHeader.vue';
import DeleteItem from '@/components/DeleteItem.vue';

export default {
  name: 'Cards',
  components: {
    NCard,
    NTable,
    CardHeader,
    DeleteItem,
  },
  data() {
    return {
      cards: [],
      form: {},
    };
  },
  computed: mapStores(useCardsStore, useCardStore),
  created() {
    this.fetchData();
  },
  methods: {
    deleteCard(cardId) {
      this.cardStore.remove(cardId);
    },
    cardLink(card) {
      return {
        query: {
          ...this.$route.query,
          edit: card.id,
        },
      };
    },
    async fetchData() {
      await this.cardsStore.fetch();
    },
  },
};
</script>

<style scoped>
.n-card {
  max-width: 100%;
}

.delete-item-col {
  text-align: right;
}

router-link {
  cursor: pointer;
  text-decoration: underline;
  color: #007bff;
}
</style>
