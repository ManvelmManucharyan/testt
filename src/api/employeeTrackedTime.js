import { get } from '@/utils/fetch';

export async function getEmployeeTrackedTime(params) {
  const url = `/api/v1/reports/tracked-times`;
  return await get(url, { params });
}

export async function getWorkingHoursTotals(params) {
  const url = `/api/v1/reports/working-hours-totals/`;
  return await get(url, { params });
}
