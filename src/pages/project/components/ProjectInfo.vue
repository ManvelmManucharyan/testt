<template>
  <n-form
    class="employee-form"
    :v-model="formData"
    label-placement="left"
    label-width="auto"
    :style="{
      maxWidth: '640px',
    }"
  >
    <n-form-item :label="$t('code')" class="form-group">
      <span>{{ formData.key }}</span>
    </n-form-item>

    <n-form-item :label="$t('category')" class="form-group">
      <span>{{ formData.category }}</span>
    </n-form-item>

    <n-form-item :label="$t('lead')" class="form-group">
      <router-link :to="employeeLink(formData.lead_id)" replace target="_blank">
        <span>{{ formData.lead_name }}</span>
      </router-link>
    </n-form-item>

    <n-form-item :label="$t('clientName')" class="form-group">
      <client-select v-model="formData.client_id" />
    </n-form-item>

    <n-form-item :label="$t('startDate')" class="form-group">
      <span>{{ formData.start_date || '-' }}</span>
    </n-form-item>

    <n-form-item :label="$t('telegramChat')" class="form-group">
      <n-input
        v-model:value="formData.telegram_chat"
        :placeholder="$t('telegramChat')"
      />
    </n-form-item>

    <link-input v-model="formData.link" />

    <n-form-item :label="$t('trackedHours')" class="form-group">
      <span>{{ formData.tracked_hours || '-' }}</span>
    </n-form-item>

    <n-form-item :label="$t('forceDeactivation')" class="form-group">
      <div style="display: flex; align-items: center">
        <n-switch
          v-model:value="formData.force_deactivation"
          :checked-value="true"
          :unchecked-value="false"
        />
        <help-text
          style="margin-left: 10px"
          :text="$t('helpTextForceDeactivationProject')"
        />
      </div>
    </n-form-item>

    <n-form-item
      v-if="formData.deleted_at"
      :label="$t('deletedAt')"
      class="form-group"
    >
      <span>{{
        moment(formData.deleted_at).locale($i18n.locale).format('DD MMMM YYYY')
      }}</span>
    </n-form-item>
  </n-form>

  <submit-project :form-data="formData" />
</template>

<script>
import { mapStores } from 'pinia';
import { useProjectStore } from '@/store/project';
import HelpText from '@/components/HelpText.vue';
import SubmitProject from './SubmitProject.vue';
import moment from 'moment';
import ClientSelect from '@/components/ClientSelect.vue';
import LinkInput from '@/components/LinkInput.vue';

export default {
  components: {
    HelpText,
    SubmitProject,
    ClientSelect,
    LinkInput,
  },
  computed: {
    ...mapStores(useProjectStore),
    formData() {
      return this.projectStore.data || {};
    },
  },
  methods: {
    employeeLink(employee_id) {
      return {
        name: 'employees-page-detail',
        params: {
          employeeId: employee_id,
        },
      };
    },
    moment,
  },
};
</script>
