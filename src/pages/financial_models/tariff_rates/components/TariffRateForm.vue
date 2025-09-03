<template>
  <n-form v-model="formData">
    <div class="form-row">
      <n-form-item v-if="isCreateMode" class="form-item full-width">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('role') }}</label>
          <role-select
            v-model="formData.role"
            :placeholder="$t('selectRole')"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('date') }}</label>
          <date-select
            v-model="formData.date"
            :placeholder="$t('selectDate')"
            type="month"
            format="y MMM"
            month-format="MMM"
            class="dates"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('rateRub') }}</label>
          <n-input-number
            v-model:value="formData.rate_rub"
            :placeholder="$t('enterRateRub')"
            required
            :show-button="false"
            :min="0"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('rateUsd') }}</label>
          <n-input-number
            v-model:value="formData.rate_usd"
            :placeholder="$t('enterRateUsd')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('rate_usd') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('rateEur') }}</label>
          <n-input-number
            v-model:value="formData.rate_eur"
            :placeholder="$t('enterRateEur')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('rate_eur') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('minimalRub') }}</label>
          <n-input-number
            v-model:value="formData.minimal_rub"
            :placeholder="$t('enterMinimalRub')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('minimal_rub') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('minimalUsd') }}</label>
          <n-input-number
            v-model:value="formData.minimal_usd"
            :placeholder="$t('enterMinimalUsd')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('minimal_usd') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('minimalEur') }}</label>
          <n-input-number
            v-model:value="formData.minimal_eur"
            :placeholder="$t('enterMinimalEur')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('minimal_eur') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('costRub') }}</label>
          <n-input-number
            v-model:value="formData.cost_rub"
            :placeholder="$t('enterCostRub')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('cost_rub') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('costUsd') }}</label>
          <n-input-number
            v-model:value="formData.cost_usd"
            :placeholder="$t('enterCostUsd')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('cost_usd') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('costEur') }}</label>
          <n-input-number
            v-model:value="formData.cost_eur"
            :placeholder="$t('enterCostEur')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('cost_eur') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('developmentRub') }}</label>
          <n-input-number
            v-model:value="formData.development_rub"
            :placeholder="$t('enterdevelopmentRub')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('development_rub') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('developmentUsd') }}</label>
          <n-input-number
            v-model:value="formData.development_usd"
            :placeholder="$t('enterdevelopmentUsd')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('development_usd') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('developmentEur') }}</label>
          <n-input-number
            v-model:value="formData.development_eur"
            :placeholder="$t('enterdevelopmentEur')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('development_eur') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('profitRub') }}</label>
          <n-input-number
            v-model:value="formData.profit_rub"
            :placeholder="$t('enterprofitRub')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('profit_rub') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('profitUsd') }}</label>
          <n-input-number
            v-model:value="formData.profit_usd"
            :placeholder="$t('enterprofitUsd')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('profit_usd') }"
          />
        </div>
      </n-form-item>

      <n-form-item class="form-item">
        <div class="form-item-inner">
          <label class="form-label">{{ $t('profitEur') }}</label>
          <n-input-number
            v-model:value="formData.profit_eur"
            :placeholder="$t('enterprofitEur')"
            required
            :show-button="false"
            :min="0"
            :class="{ highlighted: isFieldSet('profit_eur') }"
          />
        </div>
      </n-form-item>
    </div>
  </n-form>
</template>

<script>
import moment from 'moment';
import RoleSelect from '@/components/RoleSelect.vue';
import DateSelect from '@/components/DateSelect.vue';

export default {
  components: {
    RoleSelect,
    DateSelect,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    isFieldSet() {
      return (field) => {
        return this.formData[`${field}_is_set`] === true;
      };
    },
    formData: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
    isCreateMode() {
      return this.$route.query.create === 'true';
    },
  },
  watch: {
    'formData.date': {
      handler(newValue) {
        this.formData.date = moment(newValue).format('MM/DD/YYYY');
      },
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  flex-wrap: wrap;
}

.form-item {
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.form-item-inner {
  display: flex;
  align-items: center;
  width: 100%;
}

.form-label {
  flex-shrink: 0;
  width: 150px;
  margin-right: 16px;
}

.form-item .n-input-number {
  flex-grow: 1;
}

.full-width {
  width: 100%;
}

:deep(.highlighted .n-input) {
  background-color: rgb(38, 190, 38);
}

:deep(.highlighted .n-input .n-input__input-el) {
  color: white !important;
}
</style>
