<template>
  <div v-if="isLoading">{{ $t('loading') }}</div>
  <div v-else class="expense-form">
    <back-button />
    <div>
      <div v-if="!getEditOpexFromUrl">{{ $t('newOperationalExpense') }}</div>
      <hr />
      <br />
      <form @submit.prevent="submitForm">
        <div v-if="activeTab === 'project'" class="form-group-select">
          <label>{{ $t('selectProject') }}*</label>
          <project-select
            v-model="selectedProject"
            class="custom-multiselect"
            placeholder="------------"
          />
        </div>
        <div v-else class="form-group-select">
          <label>{{ $t('selectOffer') }}*</label>
          <offer-select
            v-model="selectedOffer"
            class="custom-multiselect"
            placeholder="------------"
          />
        </div>

        <div class="form-group">
          <label for="name">{{ $t('name') }}*</label>
          <input id="name" v-model="formData.name" type="text" required />
        </div>

        <form-group-select
          v-model="formData.category"
          :options="categoriesStore.data"
          :label-name="$t('category')"
          :required="true"
        />

        <div class="form-group">
          <label for="link"
            >{{ $t('link') }}<help-text text="linkHelpText"
          /></label>
          <input id="link" v-model="formData.link" type="url" />
        </div>

        <div class="form-group">
          <label for="oneTimePayment">{{ $t('oneTimePayment') }}</label>
          <input
            id="oneTimePayment"
            v-model="formData.oneTimePayment"
            type="checkbox"
          />
        </div>

        <div
          :class="['form-group', { 'inactive-field': formData.oneTimePayment }]"
        >
          <label for="recurrence_period">
            {{ $t('recurrence_period') }}
            <help-text text="recurrenceHelpText" />
          </label>
          <input
            id="recurrence_period"
            v-model="formData.recurrence_period"
            type="number"
            :disabled="formData.oneTimePayment"
          />
        </div>

        <form-group-select
          v-model="formData.currency"
          :options="currenciesStore.data"
          :label-name="$t('currency')"
          :required="true"
        />

        <div class="form-group">
          <label for="amortizeAcrossMonths">
            {{ $t('amortizeAcrossMonths') }}
            <help-text text="amortizeAcrossMonthsHelpText" />
          </label>
          <input
            id="amortizeAcrossMonths"
            v-model="formData.amortize_across_months"
            type="checkbox"
          />
        </div>

        <form-group-select
          v-model="formData.card"
          :options="cardsStore.data"
          :label-name="$t('card')"
        ></form-group-select>

        <div class="form-group">
          <label for="comment">{{ $t('comment') }}</label>
          <textarea id="comment" v-model="formData.comment"></textarea>
        </div>

        <div class="form-group">
          <label for="amount">{{ $t('amountPerPeriod') }} *</label>
          <input id="amount" v-model="formData.amount" type="number" required />
        </div>
        <div class="form-group">
          <label for="start_date">{{ $t('start_date') }} *</label>
          <date-select
            v-model="formData.date"
            style="width: 480px"
            format="dd MMM y"
            :label-name="$t('start_date')"
          />
        </div>
        <div class="form-group">
          <label for="last_date">{{ $t('last_date') }}</label>
          <date-select
            v-model="formData.date_until"
            style="width: 480px"
            format="dd MMM y"
            :label-name="$t('last_date')"
            clearable
          />
        </div>
        <div v-if="validationErrors.length" class="form-errors">
          <ul>
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <div class="form-group save-button-container">
          <button
            v-if="getEditOpexFromUrl"
            type="button"
            class="delete-button"
            @click="deleteExpense"
          >
            {{ $t('delete') }}
          </button>
          <button type="submit" class="save-button">{{ $t('save') }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCurrenciesStore } from '@/store/currencies';
import { useCategoriesStore } from '@/store/categories';
import { useCardsStore } from '@/store/cards';
import { useOperationalExpenseStore } from '@/store/operationalExpense';
import { useOfferOperationalExpenseStore } from '@/store/offerOperationalExpense';
import moment from 'moment';
import FormGroupSelect from '@/components/FormGroupSelect.vue';
import BackButton from '@/components/BackButton.vue';
import HelpText from '@/components/HelpText.vue';
import ProjectSelect from '@/components/ProjectSelect.vue';
import OfferSelect from '@/components/OfferSelect.vue';
import DateSelect from '@/components/DateSelect.vue';

export default {
  components: {
    FormGroupSelect,
    BackButton,
    HelpText,
    ProjectSelect,
    OfferSelect,
    DateSelect,
  },
  data() {
    return {
      selectedProject: null,
      selectedOffer: null,
      formData: {
        name: null,
        category: null,
        link: null,
        oneTimePayment: false,
        recurrence_period: null,
        currency: null,
        amortize_across_months: false,
        card: null,
        comment: null,
        amount: null,
        date: null,
        date_until: null,
      },
      validationErrors: [],
      isEditing: false,
    };
  },
  computed: {
    ...mapStores(
      useCurrenciesStore,
      useCategoriesStore,
      useCardsStore,
      useOperationalExpenseStore,
      useOfferOperationalExpenseStore,
    ),
    isLoading() {
      return (
        this.categoriesStore.isLoading ||
        this.currenciesStore.isLoading ||
        this.cardsStore.isLoading ||
        this.activeStore.isLoading
      );
    },
    activeTab() {
      return this.$route.query.tab;
    },
    activeStore() {
      return this.activeTab === 'project'
        ? this.operationalExpenseStore
        : this.offerOperationalExpenseStore;
    },
    months() {
      moment.locale(this.$i18n.locale);
      return moment.months().map((month, index) => ({
        value: month,
        id: String(index + 1),
      }));
    },
    disabled() {
      return (
        this.formData.oneTimePayment && !this.formData.amortize_across_months
      );
    },
    getEditOpexFromUrl() {
      const opexId = this.$route.params.opexId;
      return opexId;
    },
  },
  watch: {
    'formData.oneTimePayment': {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          if (!this.formData.recurrence_period) {
            this.formData.recurrence_period = 1;
          }
        }
      },
    },
  },
  async created() {
    await this.currenciesStore.fetch();
    await this.categoriesStore.fetch();
    await this.cardsStore.fetch();

    const editOpexId = this.getEditOpexFromUrl;
    if (editOpexId) {
      await this.activeStore.fetch(editOpexId);
      this.loadEditData();
    }
  },
  methods: {
    async submitForm() {
      if (this.validateForm()) {
        const payload = {
          name: this.formData.name,
          category: this.formData.category,
          link: this.formData.link,
          currency: this.formData.currency,
          amount: this.formData.amount,
          card: this.formData.card,
          amortize_across_months: this.formData.amortize_across_months,
          comment: this.formData.comment,
          date: moment(this.formData.date).format('MM/DD/YYYY'),
          date_until: this.formData.date_until
            ? moment(this.formData.date_until).format('MM/DD/YYYY')
            : null,
          recurrence_period: null,
          project: this.selectedProject,
          offer: this.selectedOffer,
        };
        if (
          !this.formData.oneTimePayment &&
          (!this.formData.amortize_across_months ||
            (this.formData.oneTimePayment &&
              this.formData.amortize_across_months))
        ) {
          if (!this.formData.amortize_across_months) {
            payload.recurrence_period = this.formData.recurrence_period;
          }
        }
        if (
          !this.formData.oneTimePayment ||
          (!this.formData.oneTimePayment &&
            this.formData.amortize_across_months) ||
          (this.formData.oneTimePayment && this.formData.amortize_across_months)
        ) {
          payload.date_until = this.formData.date_until
            ? moment(this.formData.date_until).format('MM/DD/YYYY')
            : null;
        }

        const editOpexId = this.getEditOpexFromUrl;
        if (editOpexId) {
          await this.activeStore.update(editOpexId, payload);
        } else {
          await this.activeStore.create(payload);
        }
      }
    },
    validateForm() {
      this.validationErrors = [];

      if (this.formData.amortize_across_months) {
        if (!this.formData.date_until) {
          this.validationErrors.push(
            `${this.$t('last_date')} is required when amortize across months is checked.`,
          );
        }
      }

      return this.validationErrors.length === 0;
    },
    checkOneTimePayment() {
      if (!this.activeStore.data.recurrence_period) {
        return true;
      } else {
        return false;
      }
    },
    loadEditData() {
      const data = this.activeStore.data;
      this.formData.name = data.name;
      this.formData.category = data.category;
      this.formData.link = data.link;
      this.formData.oneTimePayment = this.checkOneTimePayment();
      this.formData.recurrence_period = data.recurrence_period;
      this.formData.currency = data.currency;
      this.formData.amortize_across_months = data.amortize_across_months;
      this.formData.card = data.card;
      this.formData.date = data.date;
      this.formData.date_until = data.date_until;
      this.formData.comment = data.comment;
      this.formData.amount = data.amount;
      this.selectedProject = data.project;

      if (this.activeTab !== 'project') {
        this.selectedOffer = data.offer;
      }
    },
    async deleteExpense() {
      const expenseId = this.getEditOpexFromUrl;
      await this.activeStore.remove(expenseId, this.formData.id);
    },
  },
};
</script>

<style scoped>
.expense-form {
  margin: auto;
  margin-left: 20px;
  margin-top: 60px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 90%;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-group label {
  flex: 1;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.form-group input,
.form-group select,
.form-group textarea {
  flex: 2;
  padding: 8px;
  border: 1px solid black;
  border-radius: 4px;
}

.form-group.inactive-field input {
  border: 1px solid rgb(233, 233, 233);
  background-color: #b9b9b9;
  pointer-events: none;
}

.form-group button {
  margin-left: 10px;
}

.save-button-container {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background-color: green;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button {
  background-color: red;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
}

.form-errors {
  color: red;
  margin-bottom: 15px;
}
</style>
