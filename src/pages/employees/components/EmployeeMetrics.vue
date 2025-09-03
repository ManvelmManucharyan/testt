<template>
  <div class="employee-metrics">
    <n-table :bordered="true">
      <thead></thead>
      <tbody>
        <tr>
          <td>{{ $t('daysInCompany') }}</td>
          <td>{{ formData.days_in_company ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('showLastSixMonthsTrackedHours') }}</td>
          <td>{{ formData.last_six_months_tracked_hours ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('accumulatedVacationDays') }}</td>
          <td>{{ formData.accumulated_vacation_days ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('usedVacationDays') }}</td>
          <td>{{ formData.used_vacation_days ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('unusedVacationDays') }}</td>
          <td>{{ formData.available_vacation_days ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('plannedVacationDays') }}</td>
          <td>{{ formData.planned_vacation_days ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('totalDayOffsLastSixMonths') }}</td>
          <td>{{ formData.total_day_offs_last_six_months ?? '-' }}</td>
        </tr>
        <tr>
          <td>{{ $t('areVacationsApproved') }}</td>
          <td>
            {{
              formData.are_vacations_approved !== null
                ? formData.are_vacations_approved
                : '-'
            }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.employee-metrics {
  padding: 16px;
  background-color: #fff;
}

.n-table {
  width: 100%;
}
</style>
