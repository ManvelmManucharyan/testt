<template>
  <div class="header">
    <n-button style="margin-left: auto" class="btn" @click="addCard">
      {{ $t('addCard') }}
    </n-button>
    <the-modal
      v-model:show="showCardModal"
      :modal-style="{ width: '45%' }"
      @positive-click="submitCardForm"
      @negative-click="onClickCloseCardModal"
      @close="onClickCloseCardModal"
    >
      <n-card :bordered="false" role="dialog" aria-modal="true">
        <card-form v-model="form" />
      </n-card>

      <template #action>
        <n-space justify="end">
          <n-button @click="onClickCloseCardModal">
            {{ $t('cancel') }}</n-button
          >
          <n-button type="primary" @click="submitCardForm">
            {{ $t('save') }}
          </n-button>
        </n-space>
      </template>
    </the-modal>
  </div>
</template>

<script>
import TheModal from '@/components/TheModal.vue';
import CardForm from './CardForm.vue';
import { mapStores } from 'pinia';
import { useCardStore } from '@/store/card';

export default {
  name: 'CardHeader',
  components: { TheModal, CardForm },
  data() {
    return {
      showCardModal: false,
      form: {},
    };
  },
  computed: {
    ...mapStores(useCardStore),
  },
  watch: {
    showCardModal(newVal) {
      if (!newVal) {
        this.removeQueryParams();
      }
    },
    '$route.query.edit': {
      immediate: true,
      async handler(newCardId) {
        if (newCardId && !this.showCardModal) {
          this.showCardModal = true;
          try {
            await this.cardStore.fetch(newCardId);
            this.form = {
              ...this.cardStore.data,
            };
          } catch {
            this.showCardModal = false;
          }
        }
      },
    },
    '$route.query.create': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showCardModal = true;
        }
      },
    },
  },
  methods: {
    removeQueryParams() {
      const query = { ...this.$route.query };
      delete query.create;
      delete query.edit;
      this.$router.replace({ query });
      this.form = {};
    },
    onClickCloseCardModal() {
      this.showCardModal = false;
      this.removeQueryParams();
    },
    async submitCardForm() {
      if (this.$route.query.create) {
        await this.cardStore.create(this.form).then(() => {
          this.onClickCloseCardModal();
        });
      } else if (this.$route.query.edit) {
        await this.cardStore
          .update(this.$route.query.edit, this.form)
          .then(() => {
            this.onClickCloseCardModal();
          });
      }
    },
    addCard() {
      this.$router.push({
        query: {
          ...this.$route.query,
          create: true,
        },
      });
      this.showCardModal = true;
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
