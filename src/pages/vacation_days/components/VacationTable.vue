<template>
  <table class="vacation-table">
    <tbody>
      <tr v-for="item in vacationItems" :key="item.id">
        <td>
          <a
            href="#"
            class="employee"
            @click.prevent="openVacationModal(item.id, getVacationType(item))"
          >
            <employee-avatar
              :employee="{
                id: item.employee,
                avatar: item.employee_avatar,
                full_name: item.employee_name,
                date_of_dismissal: item.employee_date_of_dismissal,
              }"
              :size="35"
              :link="false"
            />
          </a>
        </td>
        <td>{{ $t(getVacationType(item)) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import EmployeeAvatar from '@/components/EmployeeAvatar.vue';

export default {
  components: {
    EmployeeAvatar,
  },
  props: {
    vacationItems: {
      type: Array,
      required: true,
    },
  },
  emits: ['open-vacation-modal'],
  methods: {
    getVacationType(item) {
      const typesDict = {
        vacation: 'vacation',
        'day-off': 'dayOff',
        'half-day-off': 'halfDayOff',
        workoff: 'workOff',
        sickleave: 'sickLeave',
      };
      return typesDict[item.type] || 'unknown';
    },
    openVacationModal(vacationId, type) {
      this.$emit('open-vacation-modal', vacationId, type);
    },
  },
};
</script>

<style scoped>
.employee {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
  transition: color 0.3s ease;
}

.employee:hover {
  color: #1a73e8;
}

.vacation-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.vacation-table th,
.vacation-table td {
  padding: 7px 9px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.vacation-table tbody tr:hover {
  background-color: #f5f5f5;
  transition: background-color 0.3s ease;
}

.vacation-table a {
  text-decoration: none;
}
</style>
