import { get } from '@/utils/fetch';

export async function getHolidays(params) {
  const url = `/api/v1/hr/holidays/`;
  return await get(url, { params });
}
