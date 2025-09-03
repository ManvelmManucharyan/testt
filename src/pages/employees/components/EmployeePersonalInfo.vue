<template>
  <n-form
    label-placement="left"
    class="employee-form"
    label-width="auto"
    :style="{
      maxWidth: '640px',
    }"
  >
    <n-form-item :label="$t('email')" class="form-group" required>
      <span>{{ localFormData.email }}</span>
    </n-form-item>

    <n-form-item :label="$t('timeZone')" class="form-group">
      <span>{{ localFormData.timezone || '-' }}</span>
    </n-form-item>

    <n-form-item :label="$t('entranceDate')" class="form-group">
      <date-select
        v-model="localFormData.entrance_date"
        :placeholder="$t('selectEntranceDate')"
        style="width: 70%"
        :format="'dd MMMM YYYY'"
      />
    </n-form-item>

    <n-form-item :label="$t('telegramAccount')" class="form-group">
      <n-input
        v-model:value="localFormData.telegram_account"
        :placeholder="$t('enterTelegramAccount')"
      />
    </n-form-item>

    <n-form-item :label="$t('phoneNumber')" class="form-group">
      <n-input
        v-model:value="localFormData.phone_number"
        :placeholder="$t('enterPhoneNumber')"
      />
    </n-form-item>

    <n-form-item :label="$t('cityOfResidence')" class="form-group">
      <city-select
        v-model="localFormData.city_of_residence"
        :placeholder="$t('selectCityOfResidence')"
      />
    </n-form-item>

    <n-form-item :label="$t('affiliation')" class="form-group">
      <n-select
        v-model:value="localFormData.affiliation"
        :options="staticChoicesStore.data.affiliation_types"
        label-field="name"
        value-field="id"
        :placeholder="$t('selectAffliation')"
      />
    </n-form-item>

    <link-input v-model="localFormData.link" />

    <n-form-item :label="$t('forceDeactivation')" class="form-group">
      <div style="display: flex; align-items: center">
        <n-switch
          v-model:value="localFormData.force_deactivation"
          :checked-value="true"
          :unchecked-value="false"
        />
        <help-text
          style="margin-left: 10px"
          :text="forceDeactivationHelpText"
        />
      </div>
    </n-form-item>

    <n-form-item :label="$t('dateOfDismissal')" class="form-group">
      <date-select
        v-model="localFormData.date_of_dismissal"
        :placeholder="$t('selectDateOfDismissal')"
        style="width: 100%"
        :format="'dd MMMM YYYY'"
        clearable
      />
    </n-form-item>

    <n-form-item :label="$t('citizenship_1')" class="form-group">
      <country-select
        v-model="localFormData.citizenship_1"
        :placeholder="$t('selectCitizenship1')"
      />
    </n-form-item>

    <n-form-item :label="$t('citizenship_2')" class="form-group">
      <country-select
        v-model="localFormData.citizenship_2"
        :placeholder="$t('selectCitizenship1')"
      />
    </n-form-item>
  </n-form>

  <submit-employee :form-data="localFormData" />
</template>

<script>
import { mapStores } from 'pinia';
import { useStaticChoicesStore } from '@/store/staticChoices';
import { useEmployeesStore } from '@/store/employee';
import HelpText from '@/components/HelpText.vue';
import DateSelect from '@/components/DateSelect.vue';
import SubmitEmployee from './SubmitEmployee.vue';
import CountrySelect from '@/components/CountrySelect.vue';
import CitySelect from '@/components/CitySelect.vue';
import LinkInput from '@/components/LinkInput.vue';

export default {
  components: {
    HelpText,
    DateSelect,
    SubmitEmployee,
    CountrySelect,
    CitySelect,
    LinkInput,
  },
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
      forceDeactivationHelpText: 'helpTextForceDeactivation',
      cities: [],
      countries: [],
    };
  },
  computed: mapStores(useStaticChoicesStore, useEmployeesStore),
  watch: {
    localFormData: {
      handler(newValue) {
        this.$emit('update:formData', newValue);
      },
      deep: true,
    },
    formData: {
      handler(newValue) {
        this.localFormData = { ...newValue };
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
