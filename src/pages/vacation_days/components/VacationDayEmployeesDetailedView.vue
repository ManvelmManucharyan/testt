<template>
  <div class="text-center">
    <dropdown
      :nudge-width="300"
      :day="day"
      :month="month"
      :current-selected-date="currentSelectedDate"
      @update:date="onUpdatePassDate"
    >
      <template #activator>
        <button style="background: transparent; border: none; cursor: pointer">
          {{ day }}
        </button>
      </template>
      <div v-if="vacationItems.length">
        <vacation-table
          :vacation-items="vacationItems"
          @open-vacation-modal="openVacationModal"
        />
      </div>
      <div v-else class="no-vacations">
        {{ $t('noVacations') }}
      </div>
    </dropdown>
  </div>
</template>

<script>
import Dropdown from '@/components/Dropdown.vue';
import VacationTable from './VacationTable.vue';

export default {
  components: {
    Dropdown,
    VacationTable,
  },
  props: {
    vacationItems: {
      type: Array,
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    currentSelectedDate: String,
  },
  emits: ['update:selection', 'open-vacation-modal'],
  methods: {
    onUpdatePassDate(date) {
      this.$emit('update:selection', date);
    },
    openVacationModal(vacationId, type) {
      this.$emit('open-vacation-modal', vacationId, type);
    },
  },
};
</script>

<style scoped>
.no-vacations {
  padding: 10px;
  text-align: center;
  color: #888;
}
</style>
